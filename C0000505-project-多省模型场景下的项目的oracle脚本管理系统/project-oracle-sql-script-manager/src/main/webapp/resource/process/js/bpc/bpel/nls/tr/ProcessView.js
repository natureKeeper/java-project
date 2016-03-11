//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/nls/tr/ProcessView.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/15 15:36:09
// SCCS path, id: /family/botp/vc/16/0/7/1/s.92 1.4
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
    KEY_NotAuthorized: "Bu görevin süreç bağlamı bilgilerini görmenize izin verilmiyor.",
    KEY_GeneralException: "Bu URL adresinden süreç bağlamı bilgileri yüklenemiyor: ${1}.",
    KEY_NoProcessContext: "Bu göreve ilişkin süreç bağlamı bilgisi yok.",
    //KEY_HttpError: "Bad HTTP response. Status: ${1}, Error: ${2}."

    // states
    Key_INACTIVE: "Etkin Değil",
    Key_READY: "Kullanılabilir",	   
    Key_RUNNING: "Devam Ediyor",
    Key_SKIPPED: "Atlandı",
    Key_FINISHED: "Tamamlandı",
    Key_FAILED: "Başarısız Oldu",
    Key_TERMINATED: "İptal Edildi",
    Key_CLAIMED: "Devam Ediyor",
    Key_TERMINATING: "İptal Edildi",
    Key_FAILING: "Başarısız Oldu",
    Key_WAITING: "Bekliyor",
    Key_EXPIRED: "Süresi Doldu",
    KEY_FORWARDED: "Başkasına Atandı",
    Key_STOPPED: "Durduruldu",
    Key_PROCESSING_UNDO: "Geri Al",
    Key_UNKNOWN: "Bilinmiyor",

    Key_Owner: "Sahip:",
    Key_Status: "Durum:",
    Key_State: "Durum:",
	
	KEY_TaskDescription: "Tanım",
    KEY_TaskHistory: "Geçmiş",
    KEY_NoHistoryInformation: "Kullanılabilecek geçmiş bilgisi yok",

    KEY_ActiveCaseScopeTitle: "Etkin Vaka",
    KEY_InactiveCaseScopeTitle: "Vaka",
    KEY_ForEachTitle: "Birden çok eşgörünüm",
    KEY_SubtasksSectionTitle: "İlgili Görevler",

    KEY_Skip: "Atla",
    KEY_CancelSkip: "Atlamayı iptal et",
    KEY_Redo: "Yinele",
    KEY_ShowDetails: "Ayrıntılar",
    KEY_ShowSubtasks: "İlgili görevleri göster",
    KEY_HideSubtasks: "İlgili görevleri gizle",
    KEY_ShowError: "Başarısızlık bilgilerini göster",
    KEY_View: "Görüntüle",
    KEY_Edit: "Düzenle",

    KEY_TooltipShowRedo: "Olası yineleme hedeflerini göster",
    KEY_TTReducedFlow: "İnsan etkileşimi olmayan bir ya da daha çok etkinlik",
    KEY_TTRefresh: "Süreç durumunu yenile",
    KEY_TTDetails: "Ayrıntıları göster",

    // Failed link
    KEY_FLConsultAdmin: "Sorunu çözmek için, aşağıdaki bilgilerle süreç denetimcinize başvurun.",
    KEY_FLActivity: "Etkinlik",
    KEY_FLActivityID: "Etkinlik Tanıtıcısı",
    KEY_FLTemplate: "Şablon",
    KEY_FLProcess: "Süreç",
    KEY_FLProcessID: "Süreç Tanıtıcısı",
    KEY_FLState: "Durum",

    KEY_GetTaskFailed: "Görev bilgileri alınamıyor.",
    KEY_RedoFailed: "Bu görevi yineleyemezsiniz.",
    KEY_SkipFailed: "Bu görevi atlayamazsınız.",
    KEY_CancelSkipFailed: "Bu görevi atlama isteği iptal edilemiyor.",

    KEY_MigrationInfo: "Yeni düzeye geçiş bilgileri",
    KEY_Migration: "Yeni Düzeye Geçiş",
    KEY_Template: "Şablon",
    KEY_ProcessDefinition: "Süreç Tanımlaması",
    KEY_Model: "Model",
    KEY_MigrationTime: "Geçiş zamanı",
    KEY_MigrationState: "Durum",
    KEY_SourceTemplate: "Kaynak",
    KEY_TargetTemplate: "Hedef",
    KEY_ValidFrom: "Geçerlilik başlangıcı",
    
    // BEGIN: do not translate this section 
    KEY_Activityempty: "Boş",
    KEY_Activityinvoke: "Çağır",
    KEY_Activityreceive: "Al",
    KEY_Activityreply: "Yanıtla",
    KEY_Activityassign: "Ata",
    KEY_Activitysnippet: "Parçacık",
    KEY_Activitywait: "Bekle",
    KEY_Activityterminate: "Sonlandır",
    KEY_Activitythrow: "Fırlat",
    KEY_Activityrethrow: "Yeniden Fırlat",
    KEY_Activitycompensate: "Compensate"
    // END: do not translate this section
})



