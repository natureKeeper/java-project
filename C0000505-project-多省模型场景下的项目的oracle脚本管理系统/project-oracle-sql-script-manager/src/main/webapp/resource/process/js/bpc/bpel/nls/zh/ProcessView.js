//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/zh/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 04:53:39
// SCCS path, id: /family/botp/vc/14/5/3/2/s.63 1.6
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
    KEY_NotAuthorized: "不允许您查看此任务的流程上下文信息。",
    KEY_GeneralException: "无法从以下 URL 装入流程上下文信息：${1}。",
    KEY_NoProcessContext: "没有为此任务提供流程上下文信息。",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "不活动 ",
    Key_READY: "可用",	   
    Key_RUNNING: "正在进行",
    Key_SKIPPED: "已跳过",
    Key_FINISHED: "已完成 ",
    Key_FAILED: "失败",
    Key_TERMINATED: "已取消",
    Key_CLAIMED: "正在进行",
    Key_TERMINATING: "已取消",
    Key_FAILING: "失败",
    Key_WAITING: "暂挂",
    Key_EXPIRED: "已到期",
    KEY_FORWARDED: "已授权",
    Key_STOPPED: "已停止",
    Key_PROCESSING_UNDO: "撤销",
    Key_UNKNOWN: "未知",

    Key_Owner: "所有者： ",
    Key_Status: "状态： ",
    Key_State: "状态： ",
	
	KEY_TaskDescription: "描述",
    KEY_TaskHistory: "历史记录 ",
    KEY_NoHistoryInformation: "没有提供历史记录信息 ",

    KEY_ActiveCaseScopeTitle: "活动 Case",
    KEY_InactiveCaseScopeTitle: "Case",
    KEY_ForEachTitle: "多个实例",
    KEY_SubtasksSectionTitle: "相关任务 ",

    KEY_Skip: "跳过",
    KEY_CancelSkip: "取消跳过",
    KEY_Redo: "重做 ",
    KEY_ShowDetails: "详细信息 ",
    KEY_ShowSubtasks: "显示相关任务 ",
    KEY_HideSubtasks: "隐藏相关任务 ",
    KEY_ShowError: "显示故障信息 ",
    KEY_View: "查看",
    KEY_Edit: "编辑",

    KEY_TooltipShowRedo: "显示可能的重做目标",
    KEY_TTReducedFlow: "一个或多个活动没有人员交互",
    KEY_TTRefresh: "刷新流程状态",
    KEY_TTDetails: "显示详细信息 ",

    // Failed link
    KEY_FLConsultAdmin: "要解决此问题，请与流程管理员联系并提供以下信息。",
    KEY_FLActivity: "活动 ",
    KEY_FLActivityID: "活动标识",
    KEY_FLTemplate: "模板",
    KEY_FLProcess: "流程",
    KEY_FLProcessID: "流程标识",
    KEY_FLState: "状态",

    KEY_GetTaskFailed: "无法检索任务信息。",
    KEY_RedoFailed: "无法重新执行此任务。",
    KEY_SkipFailed: "无法跳过此任务。",
    KEY_CancelSkipFailed: "无法取消跳过此任务的请求。",

    KEY_MigrationInfo: "迁移信息",
    KEY_Migration: "迁移",
    KEY_Template: "模板",
    KEY_ProcessDefinition: "流程定义",
    KEY_Model: "模型",
    KEY_MigrationTime: "迁移时间",
    KEY_MigrationState: "状态",
    KEY_SourceTemplate: "源",
    KEY_TargetTemplate: "目标",
    KEY_ValidFrom: "生效时间",
    
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



