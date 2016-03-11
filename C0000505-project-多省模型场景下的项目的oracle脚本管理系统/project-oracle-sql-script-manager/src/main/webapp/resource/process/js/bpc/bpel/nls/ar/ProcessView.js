//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/ar/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/15 15:10:18
// SCCS path, id: /family/botp/vc/14/6/2/8/s.61 1.8
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
    KEY_NotAuthorized: "غير مسموح لك بمشاهدة المعلومات السياقية للعملية لهذه المهمة.",
    KEY_GeneralException: "لا يمكن تحميل المعلومات السياقية للعملية من عنوان URL: ${1}.",
    KEY_NoProcessContext: "المعلومات السياقية للعملية غير متاحة لهذه المهمة.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "غير فعال",
    Key_READY: "متاح",	   
    Key_RUNNING: "جاري تشغيله",
    Key_SKIPPED: "تخطي",
    Key_FINISHED: "تام",
    Key_FAILED: "فشل",
    Key_TERMINATED: "ملغي",
    Key_CLAIMED: "جاري تشغيله",
    Key_TERMINATING: "ملغي",
    Key_FAILING: "فشل",
    Key_WAITING: "معلق",
    Key_EXPIRED: "منتهي الصلاحية",
    KEY_FORWARDED: "مفوض",
    Key_STOPPED: "متوقف",
    Key_PROCESSING_UNDO: "تراجع",
    Key_UNKNOWN: "غير معروف",

    Key_Owner: "المالك:",
    Key_Status: "الحالة:",
    Key_State: "الحالة:",
	
	KEY_TaskDescription: "الوصف",
    KEY_TaskHistory: "السجل التاريخي",
    KEY_NoHistoryInformation: "لا توجد أية معلومات متاحة للسجل التاريخي",

    KEY_ActiveCaseScopeTitle: "حالة فعالة",
    KEY_InactiveCaseScopeTitle: "الحالة",
    KEY_ForEachTitle: "عدة نسخ",
    KEY_SubtasksSectionTitle: "المهام المتعلقة",

    KEY_Skip: "تخطي",
    KEY_CancelSkip: "الغاء التخطي",
    KEY_Redo: "اعادة",
    KEY_ShowDetails: "تفاصيل",
    KEY_ShowSubtasks: "عرض المهام المتعلقة",
    KEY_HideSubtasks: "اخفاء المهام المتعلقة",
    KEY_ShowError: "عرض معلومات الفشل",
    KEY_View: "مشاهدة",
    KEY_Edit: "تحرير",

    KEY_TooltipShowRedo: "عرض الوجهات المستهدفة المحتملة للاعادة",
    KEY_TTReducedFlow: "نشاط أو أكثر بدون تدخل عملي",
    KEY_TTRefresh: "تجديد حالة العملية",
    KEY_TTDetails: "عرض التفاصيل",

    // Failed link
    KEY_FLConsultAdmin: "لحل المشكلة، اتصل بموجه العملية باستخدام المعلومات التالية.",
    KEY_FLActivity: "النشاط",
    KEY_FLActivityID: "كود النشاط",
    KEY_FLTemplate: "القالب",
    KEY_FLProcess: "العملية",
    KEY_FLProcessID: "كود العملية",
    KEY_FLState: "الحالة",

    KEY_GetTaskFailed: "لا يمكن استرجاع معلومات المهمة.",
    KEY_RedoFailed: "لا يمكن اعادة هذه المهمة.",
    KEY_SkipFailed: "لا يمكن تخطي هذه المهمة.",
    KEY_CancelSkipFailed: "لا يمكن الغاء الطلب الخاص بتخطي هذه المهمة.",

    KEY_MigrationInfo: "معلومات تطوير النسخة",
    KEY_Migration: "نقل",
    KEY_Template: "القالب",
    KEY_ProcessDefinition: "تعريف العملية",
    KEY_Model: "النموذج",
    KEY_MigrationTime: "وقت تطوير النسخة",
    KEY_MigrationState: "الحالة",
    KEY_SourceTemplate: "المصدر",
    KEY_TargetTemplate: "الوجهة المستهدفة",
    KEY_ValidFrom: "صحيح من",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "خالي",
    KEY_Activityinvoke: "استدعاء",
    KEY_Activityreceive: "استلام",
    KEY_Activityreply: "رد",
    KEY_Activityassign: "تخصيص",
    KEY_Activitysnippet: "مقطع",
    KEY_Activitywait: "انتظر",
    KEY_Activityterminate: "ايقاف",
    KEY_Activitythrow: "اصدار",
    KEY_Activityrethrow: "اعادة اصدار",
    KEY_Activitycompensate: "تعويض"
    // END: do not translate this section
})



