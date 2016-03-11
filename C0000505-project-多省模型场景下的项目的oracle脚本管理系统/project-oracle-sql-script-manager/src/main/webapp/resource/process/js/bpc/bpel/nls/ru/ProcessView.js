//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/ru/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 22:28:50
// SCCS path, id: /family/botp/vc/14/5/3/2/s.62 1.6
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
    KEY_NotAuthorized: "Вам запрещен просмотр контекста процесса данной задачи.",
    KEY_GeneralException: "Не удалось загрузить информацию о контексте процесса с URL: ${1}.",
    KEY_NoProcessContext: "Информация о контексте процесса недоступна для этой задачи.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Не активна",
    Key_READY: "Доступна",	   
    Key_RUNNING: "Выполняется",
    Key_SKIPPED: "Пропущена",
    Key_FINISHED: "Выполнена",
    Key_FAILED: "Сбой",
    Key_TERMINATED: "Отменена",
    Key_CLAIMED: "Выполняется",
    Key_TERMINATING: "Отменена",
    Key_FAILING: "Сбой",
    Key_WAITING: "Ожидание",
    Key_EXPIRED: "Устарела",
    KEY_FORWARDED: "Делегирована",
    Key_STOPPED: "Остановлена",
    Key_PROCESSING_UNDO: "Отмена",
    Key_UNKNOWN: "Неизвестно",

    Key_Owner: "Владелец:",
    Key_Status: "Состояние:",
    Key_State: "Состояние:",
	
	KEY_TaskDescription: "Описание",
    KEY_TaskHistory: "Хронология",
    KEY_NoHistoryInformation: "Информация о хронологии недоступна",

    KEY_ActiveCaseScopeTitle: "Активный вариант",
    KEY_InactiveCaseScopeTitle: "Вариант",
    KEY_ForEachTitle: "Несколько экземпляров",
    KEY_SubtasksSectionTitle: "Связанные задачи",

    KEY_Skip: "Пропустить",
    KEY_CancelSkip: "Отменить-пропустить",
    KEY_Redo: "Повторить",
    KEY_ShowDetails: "Сведения",
    KEY_ShowSubtasks: "Показать связанные задачи",
    KEY_HideSubtasks: "Скрыть связанные задачи",
    KEY_ShowError: "Показать информацию о сбое",
    KEY_View: "Вид",
    KEY_Edit: "Изменить",

    KEY_TooltipShowRedo: "Показать целевые объекты для повтора",
    KEY_TTReducedFlow: "Одна или несколько операций без участия пользователя",
    KEY_TTRefresh: "Обновить состояние процесса",
    KEY_TTDetails: "Показать сведения",

    // Failed link
    KEY_FLConsultAdmin: "Для устранения неполадки обратитесь к администратору процесса, предоставив следующую информацию.",
    KEY_FLActivity: "Операция",
    KEY_FLActivityID: "ИД операции",
    KEY_FLTemplate: "Шаблон",
    KEY_FLProcess: "Процесс",
    KEY_FLProcessID: "ИД процесса",
    KEY_FLState: "Состояние",

    KEY_GetTaskFailed: "Не удалось получить информацию о задаче.",
    KEY_RedoFailed: "Нельзя повторить запуск этой задачи.",
    KEY_SkipFailed: "Эту задачу нельзя пропустить.",
    KEY_CancelSkipFailed: "Невозможно отменить запрос на пропуск этой задачи.",

    KEY_MigrationInfo: "Информация о миграции",
    KEY_Migration: "Миграция",
    KEY_Template: "Шаблон",
    KEY_ProcessDefinition: "Определение процесса",
    KEY_Model: "Модель",
    KEY_MigrationTime: "Время миграции",
    KEY_MigrationState: "Состояние",
    KEY_SourceTemplate: "Источник",
    KEY_TargetTemplate: "Целевой объект",
    KEY_ValidFrom: "Действует с",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "Пустая",
    KEY_Activityinvoke: "Вызов",
    KEY_Activityreceive: "Принять",
    KEY_Activityreply: "Ответ",
    KEY_Activityassign: "Присвоить",
    KEY_Activitysnippet: "Фрагмент кода",
    KEY_Activitywait: "Ожидание",
    KEY_Activityterminate: "Прервать",
    KEY_Activitythrow: "Выбросить исключение",
    KEY_Activityrethrow: "Повторить",
    KEY_Activitycompensate: "Компенсировать"
    // END: do not translate this section
})



