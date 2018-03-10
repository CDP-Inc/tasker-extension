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
    
    // Properties that can be used for non ui functions
    private _workItemType: string;
    public get workItemType():string{
        return this._workItemType
    }
    public set workItemType(v:string){
        this._workItemType = v;
    }

    /**
     * @description The area path of the work item.
     */
    private _areaPath:string;
    public get areaPath():string{
        return this._areaPath;
    }
    public set areaPath(v:string){
        this._areaPath = v;
    }

    /**
     * @description The iteration path of the work item.
     */
    private _iterationPath:string;
    public get iterationPath():string{
        return this._iterationPath;
    }
    public set iterationPath(v:string){
        this._iterationPath = v;
    }


    /** 
     * @description Creates a new instance of the object.
    */
    constructor(title: string, workItemType: string, workItemId: number){
        this.title = title;
        this._workItemType = workItemType;
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
        this.outputHtml += `    <div class=\"wit ${this.appliedCss} workItem\" data-workItemId=\"${this.workItemId}\" >`;
        this.outputHtml += `        ${this.iconString} <span class=\"wit-title\">${this._workItemType} ${this.workItemId}: ${this.title}</span>`;
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

