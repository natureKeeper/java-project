//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/fr/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/15 15:09:59
// SCCS path, id: /family/botp/vc/14/3/3/0/s.17 1.15
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
    KEY_NotAuthorized: "Vous n'êtes pas autorisé à afficher les informations de contexte liées au traitement de cette tâche.",
    KEY_GeneralException: "Impossible de charger les informations de contexte de traitement à partir de l'URL : ${1}.",
    KEY_NoProcessContext: "Aucune information de contexte de traitement n'est disponible pour cette tâche.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Inactif",
    Key_READY: "Disponible",	   
    Key_RUNNING: "En cours",
    Key_SKIPPED: "Ignoré",
    Key_FINISHED: "Clos",
    Key_FAILED: "Echec",
    Key_TERMINATED: "Annulé",
    Key_CLAIMED: "En cours",
    Key_TERMINATING: "Annulé",
    Key_FAILING: "Echec",
    Key_WAITING: "En attente",
    Key_EXPIRED: "Expiré",
    KEY_FORWARDED: "Délégué",
    Key_STOPPED: "Arrêté",
    Key_PROCESSING_UNDO: "Annuler",
    Key_UNKNOWN: "Inconnu",

    Key_Owner: "Propriétaire :",
    Key_Status: "Statut :",
    Key_State: "Etat :",
	
	KEY_TaskDescription: "Description",
    KEY_TaskHistory: "Historique",
    KEY_NoHistoryInformation: "Aucune information d'historique disponible",

    KEY_ActiveCaseScopeTitle: "Case active",
    KEY_InactiveCaseScopeTitle: "Case",
    KEY_ForEachTitle: "Instances multiples",
    KEY_SubtasksSectionTitle: "Tâches associées",

    KEY_Skip: "Ignorer",
    KEY_CancelSkip: "Annuler le saut",
    KEY_Redo: "Rétablir",
    KEY_ShowDetails: "Détails",
    KEY_ShowSubtasks: "Afficher les tâches associées",
    KEY_HideSubtasks: "Masquer les tâches associées",
    KEY_ShowError: "Afficher les informations sur l'erreur",
    KEY_View: "Afficher",
    KEY_Edit: "Editer",

    KEY_TooltipShowRedo: "Afficher les cibles de répétition possibles",
    KEY_TTReducedFlow: "Une ou plusieurs activités sans interaction humaine",
    KEY_TTRefresh: "Actualiser l'état du processus",
    KEY_TTDetails: "Afficher les détails",

    // Failed link
    KEY_FLConsultAdmin: "Pour corriger le problème, contactez l'administrateur du processus avec les informations suivantes.",
    KEY_FLActivity: "Activité",
    KEY_FLActivityID: "ID activité",
    KEY_FLTemplate: "Modèle",
    KEY_FLProcess: "Processus",
    KEY_FLProcessID: "ID processus",
    KEY_FLState: "Etat",

    KEY_GetTaskFailed: "Impossible de récupérer les informations de tâche.",
    KEY_RedoFailed: "Impossible de rétablir cette tâche.",
    KEY_SkipFailed: "Vous ne pouvez pas ignorer cette tâche.",
    KEY_CancelSkipFailed: "La demande de saut de cette tâche ne peut pas être annulée.",

    KEY_MigrationInfo: "Informations sur la migration ",
    KEY_Migration: "Migration",
    KEY_Template: "Modèle",
    KEY_ProcessDefinition: "Définition de processus ",
    KEY_Model: "Type ",
    KEY_MigrationTime: "Date de la migration ",
    KEY_MigrationState: "Etat",
    KEY_SourceTemplate: "Source",
    KEY_TargetTemplate: "Cible ",
    KEY_ValidFrom: "Valide à partir du",
    
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



