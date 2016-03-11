//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/de/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 22:28:46
// SCCS path, id: /family/botp/vc/14/5/3/2/s.56 1.6
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
    KEY_NotAuthorized: "Sie sind nicht zur Anzeige der Prozesskontextinformationen dieser Task berechtigt.",
    KEY_GeneralException: "Das Laden der Prozesskontextinformationen über die URL ist nicht möglich: ${1}.",
    KEY_NoProcessContext: "Es sind keine Prozesskontextinformationen für diese Task verfügbar.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inaktiv",
    Key_READY: "Verfügbar",	   
    Key_RUNNING: "In Bearbeitung",
    Key_SKIPPED: "Übersprungen",
    Key_FINISHED: "Abgeschlossen",
    Key_FAILED: "Fehlgeschlagen",
    Key_TERMINATED: "Abgebrochen",
    Key_CLAIMED: "In Bearbeitung",
    Key_TERMINATING: "Abgebrochen",
    Key_FAILING: "Fehlgeschlagen",
    Key_WAITING: "Anstehend",
    Key_EXPIRED: "Abgelaufen",
    KEY_FORWARDED: "Delegiert",
    Key_STOPPED: "Gestoppt",
    Key_PROCESSING_UNDO: "Widerrufen",
    Key_UNKNOWN: "Unbekannt",

    Key_Owner: "Eigner:",
    Key_Status: "Status:",
    Key_State: "Status:",
	
	KEY_TaskDescription: "Beschreibung",
    KEY_TaskHistory: "Protokoll",
    KEY_NoHistoryInformation: "Keine Protokolldaten verfügbar",

    KEY_ActiveCaseScopeTitle: "Aktives case-Element",
    KEY_InactiveCaseScopeTitle: "case-Element",
    KEY_ForEachTitle: "Mehrere Instanzen",
    KEY_SubtasksSectionTitle: "Zugehörige Tasks",

    KEY_Skip: "Überspringen",
    KEY_CancelSkip: "Überspringen abbrechen",
    KEY_Redo: "Wiederholen",
    KEY_ShowDetails: "Details",
    KEY_ShowSubtasks: "Zugehörige Tasks anzeigen",
    KEY_HideSubtasks: "Zugehörige Tasks ausblenden",
    KEY_ShowError: "Informationen zum Fehler anzeigen",
    KEY_View: "Anzeigen",
    KEY_Edit: "Bearbeiten",

    KEY_TooltipShowRedo: "Mögliche Ziele für Wiederholung anzeigen",
    KEY_TTReducedFlow: "Mindestens eine Aktivität ohne manuellen Eingriff",
    KEY_TTRefresh: "Prozessstatus aktualisieren",
    KEY_TTDetails: "Details anzeigen",

    // Failed link
    KEY_FLConsultAdmin: "Wenden Sie sich zur Behebung des Fehlers mit den folgenden Informationen an den zuständigen Prozessadministrator.",
    KEY_FLActivity: "Aktivität",
    KEY_FLActivityID: "Aktivitäts-ID",
    KEY_FLTemplate: "Schablone",
    KEY_FLProcess: "Prozess",
    KEY_FLProcessID: "Prozess-ID",
    KEY_FLState: "Status",

    KEY_GetTaskFailed: "Die Taskinformationen können nicht abgerufen werden.",
    KEY_RedoFailed: "Die Task kann nicht wiederholt werden.",
    KEY_SkipFailed: "Die Task kann nicht übersprungen werden.",
    KEY_CancelSkipFailed: "Die Anforderung zum Überspringen dieser Task kann nicht abgebrochen werden.",

    KEY_MigrationInfo: "Migrationsinformationen",
    KEY_Migration: "Migration",
    KEY_Template: "Schablone",
    KEY_ProcessDefinition: "Prozessdefinition",
    KEY_Model: "Modell",
    KEY_MigrationTime: "Migrationszeit",
    KEY_MigrationState: "Status",
    KEY_SourceTemplate: "Quelle",
    KEY_TargetTemplate: "Ziel",
    KEY_ValidFrom: "Gültig ab",
    
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



