//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/es/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 22:42:25
// SCCS path, id: /family/botp/vc/14/5/3/2/s.57 1.6
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
    KEY_NotAuthorized: "No puede ver la información de contexto de proceso de esta tarea.",
    KEY_GeneralException: "No se puede cargar la información de contexto de proceso desde el URL: ${1}.",
    KEY_NoProcessContext: "La información de contexto de proceso no está disponible para esta tarea.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inactivo",
    Key_READY: "Disponible",	   
    Key_RUNNING: "En curso",
    Key_SKIPPED: "Omitido",
    Key_FINISHED: "Completado",
    Key_FAILED: "Anómalo",
    Key_TERMINATED: "Cancelado",
    Key_CLAIMED: "En curso",
    Key_TERMINATING: "Cancelado",
    Key_FAILING: "Anómalo",
    Key_WAITING: "Pendiente",
    Key_EXPIRED: "Caducado",
    KEY_FORWARDED: "Delegado",
    Key_STOPPED: "Detenido",
    Key_PROCESSING_UNDO: "Deshacer",
    Key_UNKNOWN: "Desconocido",

    Key_Owner: "Propietario:",
    Key_Status: "Estado:",
    Key_State: "Estado:",
	
	KEY_TaskDescription: "Descripción",
    KEY_TaskHistory: "Historial",
    KEY_NoHistoryInformation: "No hay ninguna información de historial disponible",

    KEY_ActiveCaseScopeTitle: "Caso activo",
    KEY_InactiveCaseScopeTitle: "Caso",
    KEY_ForEachTitle: "Varias instancias",
    KEY_SubtasksSectionTitle: "Tareas relacionadas",

    KEY_Skip: "Omitir",
    KEY_CancelSkip: "Cancelar omitir",
    KEY_Redo: "Rehacer",
    KEY_ShowDetails: "Detalles",
    KEY_ShowSubtasks: "Mostrar tareas relacionadas",
    KEY_HideSubtasks: "Ocultar tareas relacionadas",
    KEY_ShowError: "Mostrar información de anomalía",
    KEY_View: "Ver",
    KEY_Edit: "Editar",

    KEY_TooltipShowRedo: "Mostrar posibles destinos de rehacer",
    KEY_TTReducedFlow: "Una o varias actividades sin interacción humana",
    KEY_TTRefresh: "Renovar estado del proceso",
    KEY_TTDetails: "Mostrar detalles",

    // Failed link
    KEY_FLConsultAdmin: "Para resolver el problema, póngase en contacto con el administrador de procesos con la siguiente información.",
    KEY_FLActivity: "Actividad",
    KEY_FLActivityID: "ID de actividad",
    KEY_FLTemplate: "Plantilla",
    KEY_FLProcess: "Proceso",
    KEY_FLProcessID: "ID de proceso",
    KEY_FLState: "Estado",

    KEY_GetTaskFailed: "No se puede recuperar la información de la tarea.",
    KEY_RedoFailed: "No puede rehacer esta tarea.",
    KEY_SkipFailed: "No puede omitir esta tarea.",
    KEY_CancelSkipFailed: "La petición de omitir esta tarea no se puede cancelar. ",

    KEY_MigrationInfo: "Información de migración",
    KEY_Migration: "Migración",
    KEY_Template: "Plantilla",
    KEY_ProcessDefinition: "Definición de proceso",
    KEY_Model: "Modelo",
    KEY_MigrationTime: "Hora de migración",
    KEY_MigrationState: "Estado",
    KEY_SourceTemplate: "Origen",
    KEY_TargetTemplate: "Destino",
    KEY_ValidFrom: "Válida a partir de",
    
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



