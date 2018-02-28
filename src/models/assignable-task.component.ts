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
        this.outputHtml += `    <div class=\"wit wit-assignable text-left\" draggable=\"true\">`;
        this.outputHtml += `       <span class=\"wit-title\"><i class=\"${this.iconClass}\"/>&nbsp;${this.name}</span>`;
        this.outputHtml += "    </div>";    
        this.outputHtml += "</div>";   
        
        // Return the object.
        return this.outputHtml;
    }
}