import * as WIT from "TFS/WorkItemTracking/RestClient"
import { AssignableTask } from "../models/assignable-task.component";
import { WorkItemComponent } from "../models/work-item.component";

export class TeamService{

  public context: WebContext;
  private witClient:WIT.WorkItemTrackingHttpClient4

  public assignableTasks: Array<AssignableTask>;
  public assignedTasks: Array<AssignableTask>;
      
  constructor(){
      this.witClient = WIT.getClient();
      this.context = VSS.getWebContext();
      this.assignableTasks = new Array<AssignableTask>();
      this.assignedTasks = new Array<AssignableTask>();
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
        wis.push(wi);        
        callback(wis);
      });
    });
  }

}
