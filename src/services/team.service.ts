import * as WIT from "TFS/WorkItemTracking/RestClient"
import { AssignableTask } from "../models/assignable-task.component";
import { WorkItemComponent } from "../models/work-item.component";
import { JsonPatchDocument } from "VSS/WebApi/Contracts";

export class TeamService{

  public context: WebContext;
  private witClient:WIT.WorkItemTrackingHttpClient4

  public assignableTasks: Array<AssignableTask>;
  public assignedTasks: Array<AssignableTask>;
        
  private witUri: string;

  constructor(){
      this.witClient = WIT.getClient();
      this.context = VSS.getWebContext();
      this.assignableTasks = new Array<AssignableTask>();
      this.assignedTasks = new Array<AssignableTask>();

      this.witUri =  encodeURI(`${this.context.host.uri}/${this.context.project.name}/_apis/wit/WorkItems/`);
      console.log("URI: " + this.witUri);
  }

  /**
   * @description gets an array of work items from a specified id.
   * @param id an array of work item ids as strings.
   */
  public getWorkItemsById(ids: number[], callback: (o:WorkItemComponent[]) => void) : void {
    
    let wis = new Array<WorkItemComponent>();
    console.info(`calling getWorkItems for ids: ${JSON.stringify(ids)}`)
    // call the service to get the work items.
    this.witClient.getWorkItems(ids).then(a => {
      $.each(a, (i, o) => {
        let wi = new WorkItemComponent(o.fields["System.Title"], o.fields["System.WorkItemType"], o.id);
        wi.iterationPath = o.fields["System.IterationPath"];
        wi.areaPath = o.fields["System.AreaPath"];
        wis.push(wi);        
        callback(wis);
      });
    });
  }

  public addTaskToWorkItem(id: number, taskNames:string[], callback:(msg:string) => void): void{
      this.getWorkItemsById([id], (o) => {
        
        let wi = o.pop();
        console.info(`adding tasks to work item: ${id} \n ${JSON.stringify(taskNames)}`);

        $.each(taskNames, (i:number, s:string) => {
          
          var taskUri = encodeURI(`${this.witUri}${id}`);
          console.log("Task uri: " + taskUri);
         
          var patch:JsonPatchDocument = [
            {
              "op":"add",
              "path": "/fields/System.Title",
              "value": `${wi.workItemType} ${id}: ${s}`
            },
            {
              "op":"add",
              "path": "/fields/System.IterationPath",
              "value": `${wi.iterationPath}`
            },
            {
              "op":"add",
              "path": "/fields/System.AreaPath",
              "value": `${wi.areaPath}`
            },
            {
              "op":"add",
              "path": "/relations/-",
              "value":{
                 "rel": "System.LinkTypes.Hierarchy-Reverse",
                 "url": taskUri,
                 "attributes": { "comment":"Added by Tasker Extension"}
              }
            }

          ];

          this.witClient.createWorkItem(patch, this.context.project.name, "Task").then(r => {
            let msg:string = `Task ${r.id}: ${s} was added to work item ${id}`;
            console.log(msg)
            callback(msg); 
          });
        })
      });
  }

}
