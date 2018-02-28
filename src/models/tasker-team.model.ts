/**
 * @description defines a team as known to the tasker extension.
 */
export class TaskerTeam{

    /**
     * @description the name of the team.
     */
    public name: string;

    /**
     * @description the projects on which the team is a contributor.
     */
    public projects: Array<string>;

    /**
     * @description the tasks that are assigned to a team by default.
     */
    public defaultTasks: Array<number>;

    /**
     * @description a list of known tasks that are supported by the team.
     */
    public supportedTasks: Array<number>;

    /**
     * @description a stack rank of tasks applied to the generated work items to provide sort order.
     */
    public taskSortOrder: Array<number>;

    /** 
     * @description creates a new instance of the object.
    */
    constructor(){
        this.projects = new Array<string>();
        this.defaultTasks = new Array<number>();
        this.supportedTasks = new Array<number>();
        this.taskSortOrder = new Array<number>();
    }

}