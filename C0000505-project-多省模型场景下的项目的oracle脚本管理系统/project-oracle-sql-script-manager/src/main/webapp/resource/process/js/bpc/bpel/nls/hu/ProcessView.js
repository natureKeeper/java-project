//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/hu/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 04:53:33
// SCCS path, id: /family/botp/vc/14/5/3/2/s.58 1.6
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
    KEY_NotAuthorized: "Nem jogosult a feladat folyamatkontextus-információinak megjelenítésére.",
    KEY_GeneralException: "A folyamatkontextus-információk nem tölthetők be az URL címről: ${1}.",
    KEY_NoProcessContext: "Ehhez a feladathoz nem állnak rendelkezésre folyamatkontextus-információk.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inaktív",
    Key_READY: "Elérhető",	   
    Key_RUNNING: "Folyamatban",
    Key_SKIPPED: "Kihagyva",
    Key_FINISHED: "Kész",
    Key_FAILED: "Sikertelen",
    Key_TERMINATED: "Visszavonva",
    Key_CLAIMED: "Folyamatban",
    Key_TERMINATING: "Visszavonva",
    Key_FAILING: "Sikertelen",
    Key_WAITING: "Függőben van",
    Key_EXPIRED: "Lejárt",
    KEY_FORWARDED: "Delegálva",
    Key_STOPPED: "Leállítva",
    Key_PROCESSING_UNDO: "Visszavonás",
    Key_UNKNOWN: "Ismeretlen",

    Key_Owner: "Tulajdonos:",
    Key_Status: "Állapot:",
    Key_State: "Állapot:",
	
	KEY_TaskDescription: "Leírás",
    KEY_TaskHistory: "Történet",
    KEY_NoHistoryInformation: "Nem állnak rendelkezésre történeti információk",

    KEY_ActiveCaseScopeTitle: "Aktív eset",
    KEY_InactiveCaseScopeTitle: "Eset",
    KEY_ForEachTitle: "Több példány",
    KEY_SubtasksSectionTitle: "Kapcsolódó feladatok",

    KEY_Skip: "Kihagyás",
    KEY_CancelSkip: "Kihagyás megszakítása",
    KEY_Redo: "Újra",
    KEY_ShowDetails: "Részletek",
    KEY_ShowSubtasks: "Kapcsolódó feladatok megjelenítése",
    KEY_HideSubtasks: "Kapcsolódó feladatok elrejtése",
    KEY_ShowError: "Hibainformációk megjelenítése",
    KEY_View: "Nézet",
    KEY_Edit: "Szerkesztés",

    KEY_TooltipShowRedo: "Lehetséges újravégrehajtási célok megjelenítése",
    KEY_TTReducedFlow: "Legalább egy emberi beavatkozás nélküli tevékenység",
    KEY_TTRefresh: "Folyamatállapot frissítése",
    KEY_TTDetails: "Részletek megjelenítése",

    // Failed link
    KEY_FLConsultAdmin: "A probléma megoldása érdekében a következő információk birtokában lépjen kapcsolatba a folyamatadminisztrátorral.",
    KEY_FLActivity: "Tevékenység",
    KEY_FLActivityID: "Tevékenységazonosító",
    KEY_FLTemplate: "Sablon",
    KEY_FLProcess: "Folyamat",
    KEY_FLProcessID: "Folyamatazonosító",
    KEY_FLState: "Állapot",

    KEY_GetTaskFailed: "A feladatinformációk nem kérhetők le.",
    KEY_RedoFailed: "Nem hajthatja újra végre ezt a feladatot.",
    KEY_SkipFailed: "Nem hagyhatja ki ezt a feladatot.",
    KEY_CancelSkipFailed: "A feladat kihagyására vonatkozó kérést nem lehet visszavonni.",

    KEY_MigrationInfo: "Áttérési információk",
    KEY_Migration: "Áttérés",
    KEY_Template: "Sablon",
    KEY_ProcessDefinition: "Folyamatmeghatározás",
    KEY_Model: "Modell",
    KEY_MigrationTime: "Áttérés ideje",
    KEY_MigrationState: "Állapot",
    KEY_SourceTemplate: "Forrás",
    KEY_TargetTemplate: "Cél",
    KEY_ValidFrom: "Érvényesség kezdete",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "Üres",
    KEY_Activityinvoke: "Meghívás",
    KEY_Activityreceive: "Fogadás",
    KEY_Activityreply: "Válasz",
    KEY_Activityassign: "Hozzárendelés",
    KEY_Activitysnippet: "Kódrészlet",
    KEY_Activitywait: "Várakozás",
    KEY_Activityterminate: "Lezárás",
    KEY_Activitythrow: "Dobás",
    KEY_Activityrethrow: "Úrjadob",
    KEY_Activitycompensate: "Kompenzálás"
    // END: do not translate this section
})



