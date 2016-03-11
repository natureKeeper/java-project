//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/iw/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/16 05:19:33
// SCCS path, id: /family/botp/vc/14/6/2/8/s.63 1.5
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
    KEY_NotAuthorized: "אינכם מורשים להציג פרטי הקשר תהליך עבור משימה זו.",
    KEY_GeneralException: "לא ניתן לטעון את פרטי הקשר התהליך מה-URL:‏ ${1}.",
    KEY_NoProcessContext: "פרטי הקשר התהליך אינם זמינים עבור משימה זו.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "לא פעיל",
    Key_READY: "זמין",	   
    Key_RUNNING: "בביצוע",
    Key_SKIPPED: "בוצע דילוג",
    Key_FINISHED: "הושלם",
    Key_FAILED: "נכשל",
    Key_TERMINATED: "בוטל",
    Key_CLAIMED: "בביצוע",
    Key_TERMINATING: "בוטל",
    Key_FAILING: "נכשל",
    Key_WAITING: "ממתין",
    Key_EXPIRED: "התוקף פג",
    KEY_FORWARDED: "הואצל",
    Key_STOPPED: "נעצר",
    Key_PROCESSING_UNDO: "ביטול עיבוד",
    Key_UNKNOWN: "לא ידוע",

    Key_Owner: "בעלים:",
    Key_Status: "מצב:",
    Key_State: "מצב:",
	
	KEY_TaskDescription: "תיאור",
    KEY_TaskHistory: "היסטוריה",
    KEY_NoHistoryInformation: "אין פרטי היסטוריה זמינים",

    KEY_ActiveCaseScopeTitle: "מקרה פעיל",
    KEY_InactiveCaseScopeTitle: "מקרה",
    KEY_ForEachTitle: "מופעים מרובים",
    KEY_SubtasksSectionTitle: "משימות קשורות",

    KEY_Skip: "דילוג",
    KEY_CancelSkip: "ביטול דילוג",
    KEY_Redo: "ביצוע חוזר",
    KEY_ShowDetails: "פרטים",
    KEY_ShowSubtasks: "הצגת משימות קשורות",
    KEY_HideSubtasks: "הסתרת משימות קשורות",
    KEY_ShowError: "הצגת פרטי כשל",
    KEY_View: "הצגה",
    KEY_Edit: "עריכה",

    KEY_TooltipShowRedo: "הצגת יעדים אפשריים לביצוע חוזר",
    KEY_TTReducedFlow: "פעילות או פעילויות ללא הידברות אדם",
    KEY_TTRefresh: "רענון מצב תהליך",
    KEY_TTDetails: "הצגת פרטים",

    // Failed link
    KEY_FLConsultAdmin: "כדי לפתור את הבעיה, פנו אל מנהלן התהליך וספקו את הפרטים שלהלן.",
    KEY_FLActivity: "פעילות",
    KEY_FLActivityID: "זיהוי פעילות",
    KEY_FLTemplate: "תבנית",
    KEY_FLProcess: "תהליך",
    KEY_FLProcessID: "זיהוי תהליך",
    KEY_FLState: "מצב",

    KEY_GetTaskFailed: "לא ניתן לאחזר את פרטי המשימה.",
    KEY_RedoFailed: "ביצוע חוזר אינו אפשרי עבור משימה זו.",
    KEY_SkipFailed: "דילוג אינו אפשרי עבור משימה זו.",
    KEY_CancelSkipFailed: "לא ניתן לבטל את הבקשה לדילוג על משימה זו.",

    KEY_MigrationInfo: "פרטי הגירה",
    KEY_Migration: "גירה",
    KEY_Template: "תבנית",
    KEY_ProcessDefinition: "הגדרת תהליך ",
    KEY_Model: "מודל ",
    KEY_MigrationTime: "מועד הגירה",
    KEY_MigrationState: "מצב",
    KEY_SourceTemplate: "מקור",
    KEY_TargetTemplate: "יעד",
    KEY_ValidFrom: "התחלת תוקף",
    
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



