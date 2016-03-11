//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/ko/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 04:53:37
// SCCS path, id: /family/botp/vc/14/5/3/2/s.60 1.6
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
    KEY_NotAuthorized: "이 타스크의 프로세스 컨텍스트 정보를 볼 수 없습니다. ",
    KEY_GeneralException: "다음 URL에서 프로세스 컨텍스트 정보를 로드할 수 없습니다. ${1}.",
    KEY_NoProcessContext: "이 타스크에 프로세스 컨텍스트 정보를 사용할 수 없습니다. ",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "비활성",
    Key_READY: "사용 가능",	   
    Key_RUNNING: "진행 중",
    Key_SKIPPED: "건너뜀",
    Key_FINISHED: "완료됨",
    Key_FAILED: "실패됨",
    Key_TERMINATED: "취소됨",
    Key_CLAIMED: "진행 중",
    Key_TERMINATING: "취소됨",
    Key_FAILING: "실패됨",
    Key_WAITING: "보류 중",
    Key_EXPIRED: "만기됨",
    KEY_FORWARDED: "위임됨",
    Key_STOPPED: "중지됨",
    Key_PROCESSING_UNDO: "실행 취소",
    Key_UNKNOWN: "알 수 없음",

    Key_Owner: "소유자:",
    Key_Status: "상태:",
    Key_State: "상태:",
	
	KEY_TaskDescription: "설명",
    KEY_TaskHistory: "히스토리",
    KEY_NoHistoryInformation: "사용 가능한 히스토리 정보 없음",

    KEY_ActiveCaseScopeTitle: "활성 Case",
    KEY_InactiveCaseScopeTitle: "Case",
    KEY_ForEachTitle: "다중 인스턴스",
    KEY_SubtasksSectionTitle: "관련 타스크",

    KEY_Skip: "건너뛰기",
    KEY_CancelSkip: "건너뛰기 취소",
    KEY_Redo: "다시 실행",
    KEY_ShowDetails: "세부사항",
    KEY_ShowSubtasks: "관련 타스크 표시",
    KEY_HideSubtasks: "관련 타스크 숨기기",
    KEY_ShowError: "장애 정보 표시",
    KEY_View: "보기",
    KEY_Edit: "편집",

    KEY_TooltipShowRedo: "실행 취소 가능한 대상 표시",
    KEY_TTReducedFlow: "사용자와 상호작용하지 않는 하나 이상의 활동",
    KEY_TTRefresh: "프로세스 상태 새로 고치기",
    KEY_TTDetails: "세부사항 표시",

    // Failed link
    KEY_FLConsultAdmin: "문제점을 해결하려면 다음 정보를 사용하여 프로세스 관리자에게 문의하십시오.",
    KEY_FLActivity: "활동",
    KEY_FLActivityID: "활동 ID",
    KEY_FLTemplate: "템플리트",
    KEY_FLProcess: "프로세스",
    KEY_FLProcessID: "프로세스 ID",
    KEY_FLState: "상태",

    KEY_GetTaskFailed: "타스크 정보를 검색할 수 없습니다.",
    KEY_RedoFailed: "이 타스크를 다시 실행할 수 없습니다.",
    KEY_SkipFailed: "이 타스크를 건너뛸 수 없습니다.",
    KEY_CancelSkipFailed: "이 타스크를 건너뛰기 위한 요청을 취소할 수 없습니다.",

    KEY_MigrationInfo: "이주 정보",
    KEY_Migration: "이주",
    KEY_Template: "템플리트",
    KEY_ProcessDefinition: "프로세스 정의",
    KEY_Model: "모델",
    KEY_MigrationTime: "이주 시간",
    KEY_MigrationState: "상태",
    KEY_SourceTemplate: "소스",
    KEY_TargetTemplate: "대상",
    KEY_ValidFrom: "유효 시작 날짜",
    
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



