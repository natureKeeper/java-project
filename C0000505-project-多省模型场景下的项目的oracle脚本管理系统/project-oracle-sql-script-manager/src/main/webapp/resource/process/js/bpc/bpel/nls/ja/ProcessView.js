//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/ja/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/15 15:10:01
// SCCS path, id: /family/botp/vc/14/3/3/0/s.18 1.14
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
    KEY_NotAuthorized: "このタスクのプロセス・コンテキスト情報を表示する権限がありません。",
    KEY_GeneralException: "プロセス・コンテキスト情報を URL からロードできません: ${1}。",
    KEY_NoProcessContext: "このタスクのプロセス・コンテキスト情報はありません。",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "非アクティブ",
    Key_READY: "使用可能",	   
    Key_RUNNING: "進行中",
    Key_SKIPPED: "スキップ",
    Key_FINISHED: "完了",
    Key_FAILED: "失敗",
    Key_TERMINATED: "取り消し",
    Key_CLAIMED: "進行中",
    Key_TERMINATING: "取り消し",
    Key_FAILING: "失敗",
    Key_WAITING: "保留",
    Key_EXPIRED: "期限切れ",
    KEY_FORWARDED: "代行",
    Key_STOPPED: "停止",
    Key_PROCESSING_UNDO: "取り消し",
    Key_UNKNOWN: "不明",

    Key_Owner: "所有者:",
    Key_Status: "状況:",
    Key_State: "状態:",
	
	KEY_TaskDescription: "説明",
    KEY_TaskHistory: "履歴",
    KEY_NoHistoryInformation: "履歴情報がありません",

    KEY_ActiveCaseScopeTitle: "アクティブ・ケース",
    KEY_InactiveCaseScopeTitle: "ケース",
    KEY_ForEachTitle: "複数のインスタンス",
    KEY_SubtasksSectionTitle: "関連タスク",

    KEY_Skip: "スキップ",
    KEY_CancelSkip: "スキップの取り消し",
    KEY_Redo: "やり直し",
    KEY_ShowDetails: "詳細",
    KEY_ShowSubtasks: "関連タスクの表示",
    KEY_HideSubtasks: "関連タスクの非表示",
    KEY_ShowError: "障害情報の表示",
    KEY_View: "表示",
    KEY_Edit: "編集",

    KEY_TooltipShowRedo: "可能なやり直しターゲットの表示",
    KEY_TTReducedFlow: "対話型操作のない 1 つ以上のアクティビティー",
    KEY_TTRefresh: "プロセス状態の最新表示",
    KEY_TTDetails: "詳細の表示",

    // Failed link
    KEY_FLConsultAdmin: "問題を解決するには、以下の情報とともにプロセス管理者に連絡してください。",
    KEY_FLActivity: "アクティビティー",
    KEY_FLActivityID: "アクティビティー ID",
    KEY_FLTemplate: "テンプレート",
    KEY_FLProcess: "プロセス",
    KEY_FLProcessID: "プロセス ID",
    KEY_FLState: "状態",

    KEY_GetTaskFailed: "タスク情報を取得できません。",
    KEY_RedoFailed: "このタスクをやり直すことはできません。",
    KEY_SkipFailed: "このタスクをスキップできません。",
    KEY_CancelSkipFailed: "このタスクをスキップする要求をキャンセルできません。",

    KEY_MigrationInfo: "マイグレーション情報",
    KEY_Migration: "マイグレーション",
    KEY_Template: "テンプレート",
    KEY_ProcessDefinition: "プロセス定義",
    KEY_Model: "モデル",
    KEY_MigrationTime: "マイグレーションの時間",
    KEY_MigrationState: "状態",
    KEY_SourceTemplate: "ソース",
    KEY_TargetTemplate: "ターゲット",
    KEY_ValidFrom: "有効開始日",
    
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



