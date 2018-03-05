import { TeamService } from "./services/team.service";
import { WorkItemComponent } from "./models/work-item.component";
import { TaskerConfig } from "./models/tasker-config.model";
import { TaskerTeam } from "./models/tasker-team.model";
import { AssignableTask } from "./models/assignable-task.component";
import { WorkItem } from "TFS/WorkItemTracking/Contracts";

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
                            this.teamservice.assignedTasks.push(obj);
                        }
                        else if (o.supportedTasks.indexOf(obj.id) > -1){
                            // This is an assignable task.
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
                let assignableTask:AssignableTask = new AssignableTask(this.teamservice.assignableTasks[ati]);
                $("#assignableTasks").append(assignableTask.toElement());
            }

            for(var xti = 0; xti < this.teamservice.assignedTasks.length; xti++){
                // Some funky typescript stuff going on here (have to convert AssignableTask to AssignableTask 
                // because it doesn't know it's type here at runtime.
                let assignedTask:AssignableTask = new AssignableTask(this.teamservice.assignedTasks[xti]);
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
}

/* Bootstrapp the app*/
$(document).ready(function(){
    var a = new App();

    $("#workItemSelector").bind("blur", function(e){
        
        // clear any existing work items from the array.
        a.selectedItems = new Array<WorkItemComponent>();
        
        // Get the work items from the box.
        let value:string = $("#workItemSelector").val() as string;
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
    });

    $(".drop-target")
        .bind("dragleave", (e:any) =>{
            $(e.target).removeClass("dragover-indicator");
        })
        .bind("dragover", (e:any) => {
            e.preventDefault();

            console.log(`Event Target: ${e.target.id}, Original Event Target: ${e.originalEvent.target.id}, currentTarget: ${e.currentTarget.id}, original current target ${e.originalEvent.currentTarget.id}`)

            var dataTrsf:any = $(e.originalEvent.target).attr("data-transfer");
            console.log(`data transfer: ${dataTrsf}`)
            var d = JSON.parse(dataTrsf);
            if(d.source !== e.currentTarget.id){
                $(e.currentTarget).addClass("dragover-indicator");
            }
        })
        .bind("drop", (e:any) => {
            e.preventDefault();
            var dataTrsf = $(e.currentTarget).attr("data-transfer");
            console.log(`data transfer: ${dataTrsf}`)
        });
});

