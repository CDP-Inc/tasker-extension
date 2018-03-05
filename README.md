# Tasker Extension
Tasker was a project developed by CDP, Inc. for use with TFS 2010 because teams would often need to add many of the same tasks to every user story.  The goal of tasker was to have a set of tasks that you could simply add to any given story, bug, or issue.  It was later updated to work with TFS 2015 and added a lot of additional dynamic features, this was called Tasker2. This respository contains a new version that is being built as an extension compatible with Visual Studio Online (Visual Studio Team Services) and TFS releases supporting the VSTS Rest API version 4.

***Like the documentation, this software is not complete***  

[<img src="https://cdpinc.visualstudio.com/_apis/public/build/definitions/b60ff22e-6fe0-469e-b948-1a18c5a2ae5d/3/badge"/>](https://cdpinc.visualstudio.com/WUMEI/_build/index?definitionId=5)

# Building the extension
Some simple npm scripts were created for the build process.  
* In order to compile the typescript files simply run `npm run-script compile`.
* To build the vsix output to upload to the extension gallery run `npm run-script package`. *note, this doesn't actually deply to the extension gallery, it only builds the package*

# Publishing the extension
An extension must be published in order to use it in a VSTS or TFS environment.  Instructions to publish an extension can be found at [Microsoft's Documentation Site](https://docs.microsoft.com/en-us/vsts/extend/publish/overview)

# Configuring the extension
Inside the static folder is a data folder.  This folder contains the [taskList.json](static/data/taskList.json) file.  The structure of this file is as follows:

## `tasks`
Tasks represent the different tasks that can be added in batch from the Tasker.  

### `id`
An identifier for the task, this is a number.  It is referenced by the defaultTasks and supportedTasks properties of the team node objects.  This provides a direct relationship between these tasks and the various teams and projects.

### `name`
The name of the task, this will be used as the title of the task when the task batch is submitted.

### `hasReview`
A simple boolean value that indicates whether or not a review task with the same **Name** is added when this task is added.  For example, a task: *Make Donuts* with `"hasReview": true` would add not only the *Make Donuts* task, but also a *Make Donuts Review* task.

### `iconClass`
Icon class is the css class for icons that can be applied to the task visually.  This can be any FontAwesome 4.7 or Glyphicon (Bootstrap 4.3) icon class.

## `teams`
The teams node represents the different teams within the organization.  Each team and project that is using tasker within an organization should have an entry in this node.

### `name`
Each team has a name, this is the same as the team name specified in VSTS or TFS.

### `projects`
The projects array represents the different projects for which this team is responsible.  These projects should match the names in VSTS and TFS.

*Important Note* Tasker checks for a match on team and project, if it doesn't find one, then it will not function.  It is important that both of these values are set correctly.

### `defaultTasks`
An array of `tasks.id` values that correspond with the tasks that will be pre-selected as **assigned** when the tasker is loaded for the given team.

### `supportedTasks`
An array of `tasks.id` values that correspond with the tasks that made available as **assignable** when the tasker is loaded for the given team.

## `workItemTypes`
This represents the work item types that are recognized as valid parents for the tasker.  Currently this is limited to "User Story", "Bug", and/or "Issue".