//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/09/28 09:21:37
// SCCS path, id: /family/botp/vc/14/0/1/0/s.22 1.18.1.5
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
({  	
    KEY_NotAuthorized: "You are not allowed to view process context information of this task.",
    KEY_GeneralException: "Cannot load the process context information from URL: ${1}.",
    KEY_NoProcessContext: "Process context information is not available for this task.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inactive",
    Key_READY: "Available",	   
    Key_RUNNING: "In Progress",
    Key_SKIPPED: "Skipped",
    Key_FINISHED: "Completed",
    Key_FAILED: "Failed",
    Key_TERMINATED: "Canceled",
    Key_CLAIMED: "In Progress",
    Key_TERMINATING: "Canceled",
    Key_FAILING: "Failed",
    Key_WAITING: "Pending",
    Key_EXPIRED: "Expired",
    KEY_FORWARDED: "Delegated",
    Key_STOPPED: "Stopped",
    Key_PROCESSING_UNDO: "Undo",
    Key_UNKNOWN: "Unknown",

    Key_Owner: "Owner:",
    Key_Status: "Status:",
    Key_State: "State:",
	
	KEY_TaskDescription: "Description",
    KEY_TaskHistory: "History",
    KEY_NoHistoryInformation: "No history information available",

    KEY_ActiveCaseScopeTitle: "Active Case",
    KEY_InactiveCaseScopeTitle: "Case",
    KEY_ForEachTitle: "Multiple instances",
    KEY_SubtasksSectionTitle: "Related Tasks",

    KEY_Skip: "Skip",
    KEY_CancelSkip: "Cancel skip",
    KEY_Redo: "Redo",
    KEY_ShowDetails: "Details",
    KEY_ShowSubtasks: "Show related tasks",
    KEY_HideSubtasks: "Hide related tasks",
    KEY_ShowError: "Show failure information",
    KEY_View: "View",
    KEY_Edit: "Edit",

    KEY_TooltipShowRedo: "Show possible redo targets",
    KEY_TTReducedFlow: "One or more activities without human interaction",
    KEY_TTRefresh: "Refresh process state",
    KEY_TTDetails: "Show details",

    // Failed link
    KEY_FLConsultAdmin: "To resolve the problem, contact your process administrator with the following information.",
    KEY_FLActivity: "Activity",
    KEY_FLActivityID: "Activity ID",
    KEY_FLTemplate: "Template",
    KEY_FLProcess: "Process",
    KEY_FLProcessID: "Process ID",
    KEY_FLState: "State",

    KEY_GetTaskFailed: "Cannot retrieve task information.",
    KEY_RedoFailed: "You cannot redo this task.",
    KEY_SkipFailed: "You cannot skip this task.",
    KEY_CancelSkipFailed: "The request to skip this task cannot be canceled.",

    KEY_MigrationInfo: "Migration information",
    KEY_Migration: "Migration",
    KEY_Template: "Template",
    KEY_ProcessDefinition: "Process Definition",
    KEY_Model: "Model",
    KEY_MigrationTime: "Migration time",
    KEY_MigrationState: "State",
    KEY_SourceTemplate: "Source",
    KEY_TargetTemplate: "Target",
    KEY_ValidFrom: "Valid from",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "Empty",
    KEY_Activityinvoke: "Invoke",
    KEY_Activityreceive: "Receive",
    KEY_Activityreply: "Reply",
    KEY_Activityassign: "Assign",
    KEY_Activitysnippet: "Snippet",
    KEY_Activitywait: "Wait",
    KEY_Activityterminate: "Terminate",
    KEY_Activitythrow: "Throw",
    KEY_Activityrethrow: "Rethrow",
    KEY_Activitycompensate: "Compensate"
    // END: do not translate this section
})

