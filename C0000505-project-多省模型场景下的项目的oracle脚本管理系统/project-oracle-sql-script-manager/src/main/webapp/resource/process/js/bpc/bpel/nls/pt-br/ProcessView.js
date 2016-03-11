//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/pt-br/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/14 22:28:48
// SCCS path, id: /family/botp/vc/14/5/3/2/s.61 1.6
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
    KEY_NotAuthorized: "Você não tem permissão para visualizar as informações de contexto do processo desta tarefa.",
    KEY_GeneralException: "Não é possível carregar as informações de contexto do processo a partir da URL: ${1}.",
    KEY_NoProcessContext: "As informações de contexto do processo não estão disponíveis para essa tarefa.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inativo",
    Key_READY: "Disponível",	   
    Key_RUNNING: "Em Progresso",
    Key_SKIPPED: "Omitido",
    Key_FINISHED: "Concluída",
    Key_FAILED: "Falha",
    Key_TERMINATED: "Cancelado",
    Key_CLAIMED: "Em Progresso",
    Key_TERMINATING: "Cancelado",
    Key_FAILING: "Falha",
    Key_WAITING: "Pendente",
    Key_EXPIRED: "Expirado",
    KEY_FORWARDED: "Delegado",
    Key_STOPPED: "Interrompido",
    Key_PROCESSING_UNDO: "Desfazer",
    Key_UNKNOWN: "Desconhecido(a)",

    Key_Owner: "Proprietário:",
    Key_Status: "Status:",
    Key_State: "Estado:",
	
	KEY_TaskDescription: "Descrição",
    KEY_TaskHistory: "Histórico",
    KEY_NoHistoryInformation: "Nenhuma informação de histórico disponível",

    KEY_ActiveCaseScopeTitle: "Caso Ativo",
    KEY_InactiveCaseScopeTitle: "Caso",
    KEY_ForEachTitle: "Várias Instâncias",
    KEY_SubtasksSectionTitle: "Tarefas Relacionadas",

    KEY_Skip: "Ignorar",
    KEY_CancelSkip: "Cancelar Ignorar",
    KEY_Redo: "Refazer",
    KEY_ShowDetails: "Detalhes",
    KEY_ShowSubtasks: "Mostrar tarefas relacionadas",
    KEY_HideSubtasks: "Ocultar tarefas relacionadas",
    KEY_ShowError: "Mostrar informações sobre a falha",
    KEY_View: "Visualizar",
    KEY_Edit: "Editar",

    KEY_TooltipShowRedo: "Mostrar possíveis destinos para refazer",
    KEY_TTReducedFlow: "Uma ou mais atividades sem interação humana",
    KEY_TTRefresh: "Atualizar estado do processo",
    KEY_TTDetails: "Mostrar detalhes",

    // Failed link
    KEY_FLConsultAdmin: "Para resolver o problema, entre em contato com o seu administrador do processo com as seguintes informações.",
    KEY_FLActivity: "Atividade",
    KEY_FLActivityID: "ID de Atividade",
    KEY_FLTemplate: "Modelo",
    KEY_FLProcess: "Processo",
    KEY_FLProcessID: "ID do Processo",
    KEY_FLState: "Estado",

    KEY_GetTaskFailed: "Não é possível recuperar informações da tarefa.",
    KEY_RedoFailed: "Não é possível refazer esta tarefa.",
    KEY_SkipFailed: "Não é possível ignorar esta tarefa.",
    KEY_CancelSkipFailed: "O pedido para ignorar esta tarefa não pode ser cancelado.",

    KEY_MigrationInfo: "Informações de Migração",
    KEY_Migration: "Migração",
    KEY_Template: "Modelo",
    KEY_ProcessDefinition: "Definição de Processo",
    KEY_Model: "Modelo",
    KEY_MigrationTime: "Tempo de Migração",
    KEY_MigrationState: "Estado",
    KEY_SourceTemplate: "Origem",
    KEY_TargetTemplate: "Destino",
    KEY_ValidFrom: "Válido a partir de",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "Vazio",
    KEY_Activityinvoke: "Chamar",
    KEY_Activityreceive: "Receber",
    KEY_Activityreply: "Responder",
    KEY_Activityassign: "Atribuir",
    KEY_Activitysnippet: "Trecho",
    KEY_Activitywait: "Aguarde",
    KEY_Activityterminate: "Finalizar",
    KEY_Activitythrow: "Acionar",
    KEY_Activityrethrow: "Lançar Novamente",
    KEY_Activitycompensate: "Compensar"
    // END: do not translate this section
})



