import { generateUID } from "VSS/Utils/String";
import { App } from "../app";

/** 
 * @description Represents a task that can be assigned to a work item.
*/
export class AssignableTask {

    public id : number;
    public name : string;
    public hasReview : boolean;
    private iconClass: string;
    private element: HTMLDivElement;

    constructor(private app:App, value?:any){
        if(value !== null){
            this.id = value.id;
            this.name = value.name;
            this.hasReview = value.hasReview;
            this.iconClass = value.iconClass || "fa fa-asterisk";
        }

        this.element = this.initalize();
        this.element.addEventListener("dragstart", this.onDragStart);
        this.element.addEventListener("dblclick", this.onDblClick);
        this.element.addEventListener("dragend", this.onDragEnd);
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
        var guid = generateUID();
        let el = document.createElement("div");
        el.setAttribute("class", "col-md-6 text-center");
        el.id = `task-${guid}`;
        
        let inEl = document.createElement("div");
        inEl.setAttribute("class", "wit wit-assignable text-left");
        inEl.setAttribute("data-taskId", (this.id? this.id.toString() : "custom"));        
        inEl.setAttribute("data-hasReview", this.hasReview ? "true":"false");
        inEl.setAttribute("data-taskName", this.name);
        inEl.setAttribute("draggable", "true");

        let span = document.createElement("span");
        span.setAttribute("class", "wit-title");
        span.innerHTML =  `<i class=\"${this.iconClass}\" />&nbsp;${this.name}`;

        inEl.appendChild(span);
        el.appendChild(inEl);

        return el;
    }

    private onDblClick = (ev: any) => {
        // Find the current target.
        this.app.directTransfer(this.element.id, this.element.parentElement.id);
    }

    private onDragStart = (ev: any) => {
        this.app.prepareTransfer(ev, true);
    }

    private onDragEnd = (ev:any) => { 
        this.app.finishDrag(ev);
    }

    public static CreateReviewTask(taskName:string, assocTaskId: string) : HTMLDivElement{
        var guid = generateUID();
        let el = document.createElement("div");        
        el.setAttribute("class", "col-md-6 text-center");
        el.id = `task-${guid}`;

        let inEl = document.createElement("div");
        inEl.setAttribute("class", "wit wit-assignable text-left");
        inEl.setAttribute("draggable", "true");
        inEl.setAttribute("data-taskName", taskName + " Review");
        inEl.setAttribute("data-reviewFor", assocTaskId);
        inEl.setAttribute("data-taskId", "review")
        inEl.setAttribute("data-hasReview", "false");

        let span = document.createElement("span");
        span.setAttribute("class", "wit-title");
        span.innerHTML =  `<i class=\"fa fa-pencil-square-o\" />&nbsp;${taskName} Review`;

        inEl.appendChild(span);
        el.appendChild(inEl);

        return el;
    }

}