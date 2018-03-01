# Tasker Extension
Tasker was a project developed by CDP, Inc. for use with TFS 2010 because teams would often need to add many of the same tasks to every user story.  The goal of tasker was to have a set of tasks that you could simply add to any given story, bug, or issue.  It was later updated to work with TFS 2015 and added a lot of additional dynamic features, this was called Tasker2. This respository contains a new version that is being built as an extension compatible with Visual Studio Online (Visual Studio Team Services) and TFS releases supporting the VSTS Rest API version 4.

***Like the documentation, this Softare is not complete*** 
[<img src="https://cdpinc.visualstudio.com/_apis/public/build/definitions/b60ff22e-6fe0-469e-b948-1a18c5a2ae5d/3/badge"/>](https://cdpinc.visualstudio.com/WUMEI/_build/index?definitionId=5)

# Building the extension
Some simple npm scripts were created for the build process.  
* In order to compile the typescript files simply run `npm run-script compile`.
* To build the vsix output to upload to the extension gallery run `npm run-script deploy`.
