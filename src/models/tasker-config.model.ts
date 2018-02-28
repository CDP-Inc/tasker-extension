import { TaskerTeam } from "./tasker-team.model";
import { AssignableTask } from "./assignable-task.component";

/** 
 * @description defines an object representing the contents of the configuration file.
*/
export class TaskerConfig{

    public workItemTypes : Array<string>;
    public teams: Array<TaskerTeam>;
    public tasks: Array<AssignableTask>;

    constructor(configJson:any){
        this.workItemTypes = new Array<string>();
        this.teams = new Array<TaskerTeam>();
        this.tasks = new Array<AssignableTask>();
        this.loadJsonData(configJson);
    }

    private loadJsonData(configJson:any):void{
        let cfg = configJson as TaskerConfig;
        this.workItemTypes = cfg.workItemTypes;
        this.teams = cfg.teams;
        this.tasks = cfg.tasks;
    }

    public toJsonString():string{
        return JSON.stringify(this);
    }
}