//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/zh-tw/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 04:53:41
// SCCS path, id: /family/botp/vc/14/5/3/2/s.64 1.7
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
    KEY_NotAuthorized: "不允許您檢視此作業的程序環境定義資訊。",
    KEY_GeneralException: "無法從 URL 載入程序環境定義資訊：${1}。",
    KEY_NoProcessContext: "此作業無法使用程序環境定義資訊。",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "非作用中",
    Key_READY: "可用",	   
    Key_RUNNING: "進行中",
    Key_SKIPPED: "已跳過",
    Key_FINISHED: "已完成",
    Key_FAILED: "失敗",
    Key_TERMINATED: "已取消",
    Key_CLAIMED: "進行中",
    Key_TERMINATING: "已取消",
    Key_FAILING: "失敗",
    Key_WAITING: "擱置中",
    Key_EXPIRED: "已過期",
    KEY_FORWARDED: "已委派",
    Key_STOPPED: "已停止",
    Key_PROCESSING_UNDO: "復原",
    Key_UNKNOWN: "不明",

    Key_Owner: "擁有者：",
    Key_Status: "狀態：",
    Key_State: "狀態：",
	
	KEY_TaskDescription: "說明",
    KEY_TaskHistory: "歷程",
    KEY_NoHistoryInformation: "沒有可用的歷程資訊",

    KEY_ActiveCaseScopeTitle: "作用中案例",
    KEY_InactiveCaseScopeTitle: "案例",
    KEY_ForEachTitle: "多個實例",
    KEY_SubtasksSectionTitle: "相關作業",

    KEY_Skip: "跳過",
    KEY_CancelSkip: "取消跳過",
    KEY_Redo: "重做",
    KEY_ShowDetails: "詳細資料",
    KEY_ShowSubtasks: "顯示相關作業",
    KEY_HideSubtasks: "隱藏相關作業",
    KEY_ShowError: "顯示失敗資訊",
    KEY_View: "檢視",
    KEY_Edit: "編輯",

    KEY_TooltipShowRedo: "顯示可行的重做目標",
    KEY_TTReducedFlow: "一個以上不具有人機互動的活動",
    KEY_TTRefresh: "重新整理程序狀態",
    KEY_TTDetails: "顯示明細",

    // Failed link
    KEY_FLConsultAdmin: "若要解決問題，請與程序管理者聯絡，並提供下列資訊。",
    KEY_FLActivity: "活動",
    KEY_FLActivityID: "活動 ID",
    KEY_FLTemplate: "範本",
    KEY_FLProcess: "程序",
    KEY_FLProcessID: "程序 ID",
    KEY_FLState: "狀態",

    KEY_GetTaskFailed: "無法擷取作業資訊。",
    KEY_RedoFailed: "您無法重做此作業。",
    KEY_SkipFailed: "您無法跳過此作業。",
    KEY_CancelSkipFailed: "無法取消跳過此作業的要求。",

    KEY_MigrationInfo: "移轉資訊",
    KEY_Migration: "移轉",
    KEY_Template: "範本",
    KEY_ProcessDefinition: "程序定義",
    KEY_Model: "模型",
    KEY_MigrationTime: "移轉時間",
    KEY_MigrationState: "狀態",
    KEY_SourceTemplate: "來源",
    KEY_TargetTemplate: "目標",
    KEY_ValidFrom: "生效時間",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "空的",
    KEY_Activityinvoke: "呼叫",
    KEY_Activityreceive: "接收",
    KEY_Activityreply: "回覆",
    KEY_Activityassign: "指派",
    KEY_Activitysnippet: "Snippet",
    KEY_Activitywait: "等待",
    KEY_Activityterminate: "終止",
    KEY_Activitythrow: "擲出",
    KEY_Activityrethrow: "重新擲出",
    KEY_Activitycompensate: "補償"
    // END: do not translate this section
})



