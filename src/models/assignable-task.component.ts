import { generateUID } from "VSS/Utils/String";

/** 
 * @description Represents a task that can be assigned to a work item.
*/
export class AssignableTask{

    public id : number;
    public name : string;
    public hasReview : boolean;
    private iconClass: string;
    private element: HTMLDivElement;

    constructor(value?:any){
        if(value !== null){
            this.id = value.id;
            this.name = value.name;
            this.hasReview = value.hasReview;
            this.iconClass = value.iconClass || "fa fa-asterisk";
        }

        this.element = this.initalize();
        this.element.addEventListener("dragstart", this.onDragStart);
        this.element.addEventListener("dblclick", this.onDblClick);
    }

    /** 
     * @description Gets the HTML string representation of the object.
    */
    public toHtmlString() : string{
        // Return the object.
        return this.element.outerHTML;
    }
    
    /** 
     * @description Gets the HTML element represented within this object.
    */
    public toElement() : HTMLDivElement{
        return this.element;
    }

    private initalize(): HTMLDivElement{
        let el = document.createElement("div");
        el.id = `task-${generateUID()}`
        el.setAttribute("class", "col-md-6 text-center");
        
        let inEl = document.createElement("div");
        inEl.setAttribute("class", "wit wit-assignable text-left");
        inEl.setAttribute("data-taskId", this.id.toString() || "custom");
        inEl.setAttribute("draggable", "true");

        let span = document.createElement("span");
        span.setAttribute("class", "wit-title");
        span.innerHTML =  `<i class=\"${this.iconClass}\" />&nbsp;${this.name};`

        inEl.appendChild(span);
        el.appendChild(inEl);

        return el;
    }

    private onDblClick = (ev: Event) => {
        this.prepareTransfer(ev);
    }

    private onDragStart = (ev: Event) => {
        this.prepareTransfer(ev, true);
    }

    private prepareTransfer(event: Event, toggle: boolean = false){
        let parentId = (event.currentTarget as HTMLElement).parentElement.id;
        let target = (event.currentTarget as HTMLElement);

        // append the information to the object.
        let data: any = { "target": target.id, "source": parentId };
        target.setAttribute("data-transfer", JSON.stringify(data));
        
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
}