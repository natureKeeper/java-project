//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/pl/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/27 04:54:39
// SCCS path, id: /family/botp/vc/14/3/3/0/s.19 1.15
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
    KEY_NotAuthorized: "Użytkownik nie ma uprawnień do wyświetlania informacji o kontekście procesu tej czynności.",
    KEY_GeneralException: "Nie można załadować informacji o kontekście procesu z adresu URL: ${1}.",
    KEY_NoProcessContext: "Informacje o kontekście procesu nie są dostępne dla tej czynności.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Nieaktywne",
    Key_READY: "Dostępne",	   
    Key_RUNNING: "W toku",
    Key_SKIPPED: "Pominięte",
    Key_FINISHED: "Zakończone",
    Key_FAILED: "Nieudane",
    Key_TERMINATED: "Anulowane",
    Key_CLAIMED: "W toku",
    Key_TERMINATING: "Anulowane",
    Key_FAILING: "Nieudane",
    Key_WAITING: "Oczekujące",
    Key_EXPIRED: "Wygasłe",
    KEY_FORWARDED: "Delegowane",
    Key_STOPPED: "Zatrzymane",
    Key_PROCESSING_UNDO: "Wycofywanie",
    Key_UNKNOWN: "Nieznane",

    Key_Owner: "Właściciel:",
    Key_Status: "Status:",
    Key_State: "Stan:",
	
	KEY_TaskDescription: "Opis",
    KEY_TaskHistory: "Historia",
    KEY_NoHistoryInformation: "Brak dostępnych informacji o historii",

    KEY_ActiveCaseScopeTitle: "Aktywny przypadek",
    KEY_InactiveCaseScopeTitle: "Przypadek",
    KEY_ForEachTitle: "Wiele instancji",
    KEY_SubtasksSectionTitle: "Czynności pokrewne",

    KEY_Skip: "Pomiń",
    KEY_CancelSkip: "Anuluj pominięcie",
    KEY_Redo: "Przywróć",
    KEY_ShowDetails: "Szczegóły",
    KEY_ShowSubtasks: "Pokaż czynności pokrewne",
    KEY_HideSubtasks: "Ukryj czynności pokrewne",
    KEY_ShowError: "Pokaż informacje o niepowodzeniu",
    KEY_View: "Wyświetl",
    KEY_Edit: "Edytuj",

    KEY_TooltipShowRedo: "Pokaż możliwe do przywrócenia elementy docelowe",
    KEY_TTReducedFlow: "Co najmniej jedno działanie bez interakcji z użytkownikiem",
    KEY_TTRefresh: "Odśwież stan procesu",
    KEY_TTDetails: "Pokaż szczegóły",

    // Failed link
    KEY_FLConsultAdmin: "Aby rozwiązać problem, należy skontaktować się z administratorem procesu, podając następujące informacje.",
    KEY_FLActivity: "Działanie",
    KEY_FLActivityID: "Identyfikator działania",
    KEY_FLTemplate: "Szablon",
    KEY_FLProcess: "Proces",
    KEY_FLProcessID: "Identyfikator procesu",
    KEY_FLState: "Stan",

    KEY_GetTaskFailed: "Nie można pobrać informacji o czynności.",
    KEY_RedoFailed: "Nie można przywrócić tego zadania.",
    KEY_SkipFailed: "Nie można pominąć tego zadania.",
    KEY_CancelSkipFailed: "Nie można anulować żądania pominięcia tej czynności.",

    KEY_MigrationInfo: "Informacje o migracji",
    KEY_Migration: "Migracja",
    KEY_Template: "Szablon",
    KEY_ProcessDefinition: "Definicja procesu",
    KEY_Model: "Model",
    KEY_MigrationTime: "Czas migracji",
    KEY_MigrationState: "Stan",
    KEY_SourceTemplate: "Źródło",
    KEY_TargetTemplate: "Cel",
    KEY_ValidFrom: "Ważne od",
    
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



