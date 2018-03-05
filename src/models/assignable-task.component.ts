/** 
 * @description Represents a task that can be assigned to a work item.
*/
export class AssignableTask{

    public id : number;
    public name : string;
    public hasReview : boolean;
    private outputHtml: string;
    private iconClass: string;

    constructor(value?:any){
        if(value !== null){
            this.id = value.id;
            this.name = value.name;
            this.hasReview = value.hasReview;
            this.iconClass = value.iconClass || "fa fa-asterisk";
        }
    }

    /** 
     * @description Gets the HTML string representation of the object.
    */
    public toHtmlString() : string{
        
        this.outputHtml  = "<div class=\"col-md-6 text-center\">";
        this.outputHtml += `    <div data-taskId=\"${this.id || "custom"}\" class=\"wit wit-assignable text-left\" draggable=\"true\">`;
        this.outputHtml += `       <span class=\"wit-title\"><i class=\"${this.iconClass}\"/>&nbsp;${this.name}</span>`;
        this.outputHtml += "    </div>";    
        this.outputHtml += "</div>";   
        
        // Return the object.
        return this.outputHtml;
    }

    public toElement(): HTMLDivElement{
        let el = document.createElement("div");
        el.setAttribute("class", "col-md-6 text-center");
        
        let inEl = document.createElement("div");
        inEl.setAttribute("class", "wit wit-assignable text-left");
        inEl.setAttribute("data-taskId", this.id.toString() || "custom");
        inEl.setAttribute("draggable", "true");

        let span = document.createElement("span");
        span.setAttribute("class", "wit-title");
        span.innerHTML =  `<i class=\"${this.iconClass}\" />&nbsp;${this.name};`

        let i = document.createElement("i");
        i.setAttribute("class", this.iconClass);
        span.appendChild(i);
        

        inEl.appendChild(span);
        el.appendChild(inEl);

        el.ondragstart = this.onDragStart;

        return el;
    }

    private onDragStart(ev: Event){
        let parentId = (ev.target as HTMLElement).parentElement.id;
        let target = (ev.target as HTMLElement);

        // append the information to the object.
        let data: any = { "target": target.id, "source": parentId };
        target.setAttribute("data-transfer", JSON.stringify(data));
        
        if(parentId === "assignedTasksDropTarget"){
            $("assignedTasksDropTarget").addClass("hidden");
            $("unAssignedTasksDropTarget").removeClass("hidden");
        }
        else if (parentId == "unAssignedTasksDropTarget"){
            $("assignedTasksDropTarget").removeClass("hidden");
            $("unAssignedTasksDropTarget").addClass("hidden");
        }
        else{
            $("assignedTasksDropTarget").addClass("hidden");
            $("unAssignedTasksDropTarget").addClass("hidden");
        }
    }
}