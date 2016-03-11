//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/cs/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 04:53:29
// SCCS path, id: /family/botp/vc/14/5/3/2/s.55 1.6
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
    KEY_NotAuthorized: "Nemáte povoleno zobrazovat kontextové informace procesu této úlohy.",
    KEY_GeneralException: "Nelze načíst kontextové informace procesu z adresy URL: ${1}.",
    KEY_NoProcessContext: "Informace o kontextu procesu nejsou pro tuto úlohu dostupné.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Neaktivní",
    Key_READY: "K dispozici",	   
    Key_RUNNING: "Probíhá",
    Key_SKIPPED: "Přeskočeno",
    Key_FINISHED: "Dokončeno",
    Key_FAILED: "Nezdařilo se",
    Key_TERMINATED: "Zrušeno",
    Key_CLAIMED: "Probíhá",
    Key_TERMINATING: "Zrušeno",
    Key_FAILING: "Nezdařilo se",
    Key_WAITING: "Nevyřízené",
    Key_EXPIRED: "Vypršení platnosti",
    KEY_FORWARDED: "Delegováno",
    Key_STOPPED: "Zastaveno",
    Key_PROCESSING_UNDO: "Vrátit zpět",
    Key_UNKNOWN: "Neznámý",

    Key_Owner: "Vlastník:",
    Key_Status: "Stav:",
    Key_State: "Stav:",
	
	KEY_TaskDescription: "Popis",
    KEY_TaskHistory: "Historie",
    KEY_NoHistoryInformation: "Informace o historii nejsou dostupné",

    KEY_ActiveCaseScopeTitle: "Aktivní případ",
    KEY_InactiveCaseScopeTitle: "Případ",
    KEY_ForEachTitle: "Více instancí",
    KEY_SubtasksSectionTitle: "Související úlohy",

    KEY_Skip: "Přeskočit",
    KEY_CancelSkip: "Zrušit přeskočení",
    KEY_Redo: "Znovu",
    KEY_ShowDetails: "Podrobnosti",
    KEY_ShowSubtasks: "Zobrazit související úlohy",
    KEY_HideSubtasks: "Skrýt související úlohy",
    KEY_ShowError: "Zobrazit informace o selhání",
    KEY_View: "Pohled",
    KEY_Edit: "Upravit",

    KEY_TooltipShowRedo: "Zobrazit možné cíle zopakování",
    KEY_TTReducedFlow: "Minimálně jedna aktivita bez interakce s člověkem",
    KEY_TTRefresh: "Obnovit stav procesu",
    KEY_TTDetails: "Zobrazit podrobnosti",

    // Failed link
    KEY_FLConsultAdmin: "Chcete-li problém vyřešit, kontaktujte s následujícími informacemi svého administrátora procesu.",
    KEY_FLActivity: "Aktivita",
    KEY_FLActivityID: "ID aktivity",
    KEY_FLTemplate: "Šablona",
    KEY_FLProcess: "Proces",
    KEY_FLProcessID: "ID procesu",
    KEY_FLState: "Stav",

    KEY_GetTaskFailed: "Nelze přijmout informace o úloze.",
    KEY_RedoFailed: "Nemůžete vrátit tuto úlohu.",
    KEY_SkipFailed: "Nemůžete přeskočit tuto úlohu.",
    KEY_CancelSkipFailed: "Požadavek na přeskočení této úlohy nelze zrušit.",

    KEY_MigrationInfo: "Informace o migraci",
    KEY_Migration: "Migrace",
    KEY_Template: "Šablona",
    KEY_ProcessDefinition: "Definice procesu",
    KEY_Model: "Model",
    KEY_MigrationTime: "Čas migrace",
    KEY_MigrationState: "Stav",
    KEY_SourceTemplate: "Zdroj",
    KEY_TargetTemplate: "Cíl",
    KEY_ValidFrom: "Platí od",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "Empty",
    KEY_Activityinvoke: "Invoke",
    KEY_Activityreceive: "Receive",
    KEY_Activityreply: "Reply",
    KEY_Activityassign: "Přiřadit",
    KEY_Activitysnippet: "Snippet",
    KEY_Activitywait: "Wait",
    KEY_Activityterminate: "Ukončit",
    KEY_Activitythrow: "Throw",
    KEY_Activityrethrow: "Rethrow",
    KEY_Activitycompensate: "Kompenzovat"
    // END: do not translate this section
})



