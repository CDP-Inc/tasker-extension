import { TeamService } from "./services/team.service";
import { WorkItemComponent } from "./models/work-item.component";
import { TaskerConfig } from "./models/tasker-config.model";
import { TaskerTeam } from "./models/tasker-team.model";
import { AssignableTask } from "./models/assignable-task.component";
import { WorkItem } from "TFS/WorkItemTracking/Contracts";
import { createElement } from "react";

export class App{
    private config: TaskerConfig;
    private teamservice: TeamService;
    
    public outputMessages: Array<string>;

    /**
     * @description a collection of selected work item components.
     */
    public selectedItems: Array<WorkItemComponent>;

    /** 
     * @description creates a new isntance of the object.
    */
    constructor(){
        this.teamservice = new TeamService();
        this.outputMessages = new Array<string>();
        this.init();
    }

    /** 
     * @description called by the constructor, this method initializes the UI components.
    */
    private init(){
        $("#contextAccount").text(this.teamservice.context.account.name);
        $("#contextTeam").text(this.teamservice.context.team.name);
        $("#contextProject").text(this.teamservice.context.project.name);

        this.selectedItems = new Array<WorkItemComponent>();

        $.getJSON("../static/data/taskList.json", (data) => {
            
            // load the configuration from the data.
            this.config = new TaskerConfig(data);
            
            let team: TaskerTeam = null;
            
            // find the current team.
            let found: boolean = false;
            let i = 0;
            do{
                var o = this.config.teams[i];
                
                if(o.name === this.teamservice.context.team.name){
                    // this is our team..
                    found = true;
                    for(var x = 0; x < this.config.tasks.length; x++){
                        var obj = this.config.tasks[x];
                    
                        if(o.defaultTasks.indexOf(obj.id) > -1){
                            // This is a default task for this team.
                            console.log(`Adding assigned task ${JSON.stringify(obj)}`)
                            this.teamservice.assignedTasks.push(obj);
                        }
                        else if (o.supportedTasks.indexOf(obj.id) > -1){
                            // This is an assignable task.
                            console.log(`Adding assigned task ${JSON.stringify(obj)}`)
                            this.teamservice.assignableTasks.push(obj);
                        }
                        // else it's neither so we ignore.                        
                    };
                }
                i++;
            } while(!found && i < this.config.teams.length);

            // Finally, we can now load the initial values.
            for(var ati = 0; ati < this.teamservice.assignableTasks.length; ati++){
                // Some funky typescript stuff going on here (have to convert AssignableTask to AssignableTask 
                // because it doesn't know it's type here at runtime.
                let assignableTask:AssignableTask = new AssignableTask(this, this.teamservice.assignableTasks[ati]);
                $("#assignableTasks").append(assignableTask.toElement());
            }

            for(var xti = 0; xti < this.teamservice.assignedTasks.length; xti++){
                // Some funky typescript stuff going on here (have to convert AssignableTask to AssignableTask 
                // because it doesn't know it's type here at runtime.
                let assignedTask:AssignableTask = new AssignableTask(this, this.teamservice.assignedTasks[xti]);
                $("#assignedTasks").append(assignedTask.toElement());
            }
        });

    }

    /**
     * @description gets an array of work items from a specified id.
     * @param id an array of work item ids as strings.
     */
    public loadSelectedItems(ids : string[], callback:() => void ) : void{
        // call the service to get the work items.
        let idNums = new Array<number>();
        $.each(ids, (i, o) =>{
            var parsed = parseInt(o);
            if(!isNaN(parsed)){
                idNums.push(parsed)
            }
            else{
                console.info(`Work Item ${o} is not a numeric value and will be ignored.`);
                this.outputMessages.push(`Work Item ${o} is not a numeric value and will be ignored.`)
            }
        });
        
        // Now just load 'em up from the response.
        this.teamservice.getWorkItemsById(idNums, (w) => {
            
            // Simply set the property to contain the results of the callback.
            this.selectedItems =  w;
            
            // Async operation is done, so make callback.
            callback();
        });

    }

    public prepareTransfer(event: any, toggle: boolean = false){
        // Check the standard zones first.
        let parentId = event.target.parentElement.id;
        let target = event.target;

        // Sometimes it comes in in the "currentTarget" field instead.
        if(!target.id){
            parentId = event.currentTarget.parentElement.id;
            target = event.currentTarget;
        }

        // append the information to the object.
        let data: any = { "target": target.id, "source": parentId };
        
        // Set a custom attribute and the event transfer state.
        target.setAttribute("data-transfer", JSON.stringify(data));
        event.dataTransfer.setData("application/json", JSON.stringify(data))

        if(toggle){
            if(parentId === "assignedTasks"){
                $("#unAssignedTasksDropTarget").removeClass("hidden");
                $("#assignedTasksDropTarget").addClass("hidden");
            }
            else if (parentId === "assignableTasks"){
                $("#unAssignedTasksDropTarget").addClass("hidden");
                $("#assignedTasksDropTarget").removeClass("hidden");
            }
            else{
                $("#unAssignedTasksDropTarget").addClass("hidden");
                $("#assignedTasksDropTarget").addClass("hidden");
            }
        }

        console.log("Drag in process: data-transfer=|" + JSON.stringify(data) + "|");
    }

    public directTransfer(elementId: string, currentParentId: string){
        if(currentParentId === "assignableTasks"){
            // moving to assigned
            this.moveTask($(`#${elementId}`), $("#assignedTasks"));
        }
        else{
            // moving to assignable
            this.moveTask($(`#${elementId}`), $("#assignableTasks"));
        }
    }

    public finishDrag(e:any){
        $("#unAssignedTasksDropTarget").addClass("hidden");
        $("#assignedTasksDropTarget").addClass("hidden");
    }

    public moveTask(taskElement: JQuery<HTMLElement>, destination: JQuery<HTMLElement>){
        let el = $(taskElement).detach();
        $(destination).append(el);

        let child = $(el).children(".wit-assignable").first();

        let taskId = $(child).attr("data-taskId");
        let hasReview = ($(child).attr("data-hasReview").toLowerCase() === "true") ? true:false;
        let taskName = $(child).attr("data-taskName");

        console.log(`The task ${taskName} which ${hasReview? "has review":"does not have review"} was moved to ${destination.attr("id")}`);

        if(taskName !== "" && hasReview){
            if($(destination).attr("id") === "assignedTasks"){
                console.log("Creating review task.")
                let reviewTask = AssignableTask.CreateReviewTask(taskName, taskId);
                $(destination).append(reviewTask);
            }
            else{
                console.log("Removing any associated review task");
                let reviewTask =  $("div[data-reviewFor='" + taskId + "']");
                reviewTask.remove();
            }
        }
    }

    public saveTasks(){
        var assigned = $("#assignedTasks");
        var assignable = assigned.find(".wit-assignable");

        
        if($("#workItemSelector").val() === "" || assignable.length < 1){
            console.log("form is invalid")
            var eom = document.createElement("div");
            $(eom).addClass("alert alert-danger");
            $(eom).attr("role", "alert");
            $(eom).fadeOut(10000);
            $(eom).text("At least one work item must be specified, and at least one task must be assigned in order to continue.")
            $("#outputMessages").append(eom);  
        }
        else{
            console.log("Assigning Tasks from " + assignable.length + " items.")

            let tasks:Array<string> = new Array<string>();
            $.each(assignable, (i:any, o:HTMLElement) => {
                var t = $(o).attr("data-taskName",);
                tasks.push(t)
            });

            // log the tasks to the console.
            console.log("Tasks: " + JSON.stringify(tasks));

            // all "workitems" shoudl get each of the tasks
            let targets = $(".workItem")

            $.each(targets, (i, o) => {
                var wid = parseInt($(o).attr("data-workItemId"));
                console.log("Adding tasks to work item " + wid.toString());

                // now use the service to add the task to the work item.
                $.each(assignable, (i:number, o:HTMLElement) => {               
                    this.teamservice.addTaskToWorkItem(wid,tasks,(m) => {
                        // Reflect the changes in the ui messages the remove them.
                        console.log(m);
                        var x : HTMLDivElement = document.createElement("div");
                        $(x).addClass("alert alert-info");
                        $(x).attr("role", "alert");
                        $(x).text(m);
                        $(x).fadeOut(8000);
                        $("#outputMessages").append(x);     
                        
                        // Clear the excess junk.
                        $("#selectedItems").html("");
                        $("#workItemSelector").val("");
                        $("#customTask").val("");
                    });
                });
            });
        }
    }
}

/* Bootstrapp the app*/
$(document).ready(function(){
    var a = new App();

    $("#workItemSelector").bind("blur", function(e){
        
        // clear any existing work items from the array.
        a.selectedItems = new Array<WorkItemComponent>();
        
        // Get the work items from the box.
        let value:string = $("#workItemSelector").val() as string;

        if(value !== ""){
            console.info(`Processing the following work items: ${JSON.stringify(value.split(","))}`);

            a.loadSelectedItems(value.split(","), () => {
                // roll through the items and list them.
                console.info(`selected work items: ${JSON.stringify(a.selectedItems)}`)
                
                // clear any existing content in the html.
                $("#selectedItems").html("");
                $.each(a.selectedItems, function(o, i){
                    $("#selectedItems").append(i.toHtmlString())
                });

            });
        }
        else{
            $("#selectedItems").html("");
        }
    });

    $("#addCustomTask").click((e:any) => {
        let t = new AssignableTask(this, 
            {
                name: `${$("#customTask").val()}`,
                hasReview: false,
                iconClass: "fa fa-cloud"
            }
        );

        $("#assignedTasks").append(t.toElement());
    });

    $("#updateTask").click((e:any) =>{
        a.saveTasks();
    });

    $(".drop-target")
        .bind("dragleave", (e:any) =>{
            $(e.target).removeClass("dragover-indicator");
        })
        .bind("dragover", (e:any) =>{
            e.preventDefault();
        })
        .bind("dragenter", (e:any) => {
            e.preventDefault();
        })
        .bind("drop", (e:any) => {
            e.preventDefault();
            e.dataTransfer = e.originalEvent.dataTransfer;
            
            // Get the data string from the transfer object.
            let dataTrsf  = e.dataTransfer.getData("application/json");
            console.log(`data transfer: ${dataTrsf}`)

            // Parse it.
            var d = JSON.parse(dataTrsf);

            // Get the components
            let dataTarget = $("#" + d.target);
            let dataSource = $("#" + d.source);

            // Get the dropzone 
            let dd = $(e.target || e.currentTarget);
            
            // Define and determine where it goes from here.
            let dataDestination : JQuery<HTMLElement> = null;
            if(dd.attr("id") === "unAssignedTasksDropTarget"){
                dataDestination = $("#assignableTasks")
            }
            else if(dd.attr("id") === "assignedTasksDropTarget") {
                dataDestination = $("#assignedTasks");
            }

            // Now, if everythings good, then move it.
            if(dataDestination !== null){
                console.log(`Moving ${dataTarget.attr("id")} from ${dataSource.attr("id")} to ${dataDestination.attr("id")}`);
                a.moveTask(dataTarget, dataDestination);
            }
            else{
                console.log(`Destination could not be determined.`);
            }

            // Now hide the drop target...
            dd.addClass("hidden");
        });
});

