//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/it/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 04:53:35
// SCCS path, id: /family/botp/vc/14/5/3/2/s.59 1.6
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
    KEY_NotAuthorized: "Non è consentito visualizzare le informazioni di contesto del processo di questa attività.",
    KEY_GeneralException: "Impossibile caricare le informazioni di contesto del processo dall'URL: ${1}.",
    KEY_NoProcessContext: "Informazioni sul contesto del processo non disponibili per questa attività.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inattiva",
    Key_READY: "Disponibile",	   
    Key_RUNNING: "In corso",
    Key_SKIPPED: "Ignorata",
    Key_FINISHED: "Completato",
    Key_FAILED: "Non riuscito",
    Key_TERMINATED: "Annullato",
    Key_CLAIMED: "In corso",
    Key_TERMINATING: "Annullato",
    Key_FAILING: "Non riuscito",
    Key_WAITING: "In sospeso",
    Key_EXPIRED: "Scaduta",
    KEY_FORWARDED: "Delegato",
    Key_STOPPED: "Arrestato",
    Key_PROCESSING_UNDO: "Annulla",
    Key_UNKNOWN: "Sconosciuto",

    Key_Owner: "Proprietario:",
    Key_Status: "Stato:",
    Key_State: "Stato:",
	
	KEY_TaskDescription: "Descrizione",
    KEY_TaskHistory: "Cronologia",
    KEY_NoHistoryInformation: "Non sono disponibili informazioni sulla cronologia",

    KEY_ActiveCaseScopeTitle: "Attiva maiuscolo/minuscolo",
    KEY_InactiveCaseScopeTitle: "Maiuscolo/minuscolo",
    KEY_ForEachTitle: "Più istanze",
    KEY_SubtasksSectionTitle: "Operazioni collegate",

    KEY_Skip: "Ignora",
    KEY_CancelSkip: "Annulla ignora",
    KEY_Redo: "Ripristina",
    KEY_ShowDetails: "Dettagli",
    KEY_ShowSubtasks: "Mostra attività correlate",
    KEY_HideSubtasks: "Nascondi attività correlate",
    KEY_ShowError: "Mostra informazioni errore",
    KEY_View: "Visualizza",
    KEY_Edit: "Modifica",

    KEY_TooltipShowRedo: "Mostra possibili destinazioni di ripristino",
    KEY_TTReducedFlow: "Una o più attività senza interazione umana.",
    KEY_TTRefresh: "Aggiorna stato processo",
    KEY_TTDetails: "Mostra dettagli",

    // Failed link
    KEY_FLConsultAdmin: "Per risolvere il problema, contattare l'amministratore del processo e comunicare le seguenti informazioni.",
    KEY_FLActivity: "Attività",
    KEY_FLActivityID: "ID attività",
    KEY_FLTemplate: "Modello",
    KEY_FLProcess: "Processo",
    KEY_FLProcessID: "ID processo",
    KEY_FLState: "Stato",

    KEY_GetTaskFailed: "Impossibile richiamare le informazioni di attività.",
    KEY_RedoFailed: "Impossibile ripristinare questa attività.",
    KEY_SkipFailed: "Impossibile ignorare questa attività.",
    KEY_CancelSkipFailed: "La richiesta di ignorare questa attività non può essere annullata.",

    KEY_MigrationInfo: "Informazioni sulla migrazione",
    KEY_Migration: "Migrazione",
    KEY_Template: "Modello",
    KEY_ProcessDefinition: "Definizione del processo",
    KEY_Model: "Modello",
    KEY_MigrationTime: "Ora di migrazione",
    KEY_MigrationState: "Stato",
    KEY_SourceTemplate: "Origine",
    KEY_TargetTemplate: "Destinazione",
    KEY_ValidFrom: "Valido da",
    
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



