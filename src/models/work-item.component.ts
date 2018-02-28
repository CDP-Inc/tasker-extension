import { WorkItemTypeClass } from "TFS/WorkItemTracking/ProcessContracts";

/** 
 * @description Represents a work item to which tasks may be assignable.
*/
export class WorkItemComponent
{
    private workItemId: number;
    private title: string;
    private appliedCss: string;
    private iconString: string;
    private outputHtml: string;
    private workItemType: string;

    /** 
     * @description Creates a new instance of the object.
    */
    constructor(title: string, workItemType: string, workItemId: number){
        this.title = title;
        this.workItemType = workItemType;
        this.workItemId = workItemId;
        switch(workItemType.toLowerCase()){
            case "bug":
                this.iconString = "<i class=\"fa fa-bug\"/>"
                this.appliedCss = "wit-bug"
                break;
            case "issue":
                this.iconString = "<i class=\"fa fa-asterisk\"/>"
                this.appliedCss = "wit-issue"
                break;
            case "user story":
                this.iconString = "<i class=\"fa fa-book\"/>"
                this.appliedCss = "wit-userstory"
                break;
            default:
                this.iconString = "<i class=\"fa fa-ban\"/>"
                this.appliedCss = "wit-invalid"
            }
        
        this.outputHtml  = "<div class=\"col-md-6\">";
        this.outputHtml += `    <div class=\"wit ${this.appliedCss}\">`;
        this.outputHtml += `        ${this.iconString} <span class=\"wit-title\">${this.workItemType} ${this.workItemId}: ${this.title}</span>`;
        this.outputHtml += "    </div>";    
        this.outputHtml += "</div>";    
    }

    /** 
     * @description Gets the HTML string representation of the object.
    */
    public toHtmlString():string{
        return this.outputHtml;
    }

}

