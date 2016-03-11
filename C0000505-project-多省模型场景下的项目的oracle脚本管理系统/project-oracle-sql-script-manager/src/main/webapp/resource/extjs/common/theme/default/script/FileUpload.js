var FileUpload = function(){
    var isInited = false;
    var fileUploadForm,fileUploadWin;
    var url;
    var callback;
    return {
        init:function(){
            this.createFormPanel();
            this.createUploadWin();
            isInited = true;
        },
        createFormPanel:function(){        	
            fileUploadForm = new Ext.FormPanel({
                fileUpload: true,
                width: 500,
                frame: true,
                autoHeight: true,
                bodyStyle: 'padding: 10px 10px 0 10px;',
                labelWidth: 80,
                labelPad:5,
                buttonAlign:'center',
                defaults: {
                    anchor: '95%',
                    msgTarget: 'side'
                },
                items: [{
                    xtype: 'textfield',
                    name:'fileName',
                    id:'fileName',
                    fieldLabel: '文件名称'
                },{
                    xtype: 'fileuploadfield',
                    id: 'uploadFile',
                    emptyText: '选择文件',
                    fieldLabel: '文件路径',
                    allowBlank: false,
                    name: 'uploadFile',
                    buttonText: '',
                    buttonCfg: {
                        iconCls: 'button_add_image'//button_import
                    }
                }],
                buttons: [{
                    text: '保存',
                    iconCls: 'button_save',
                    handler: function(){
                        if(fileUploadForm.getForm().isValid()){
                            fileUploadForm.getForm().submit({
                                url: url,
                                waitMsg: '正在上传文件......',
                                //icon:'ext-mb-download',
                                waitTitle:'请稍等',
                                success: function(fp, response){
                                    Ext.MessageBox.hide();
                                    show(Ext.MessageBox.INFO, response.result.resultText);
                                    fileUploadWin.close();
                                    if(!Ext.isEmpty(callback)){
                                        callback(response);
                                    }
                                },
                                failure: function(fp, response){
                                    Ext.MessageBox.hide();
                                    show(Ext.MessageBox.ERROR, response.result.resultText);
                                    return;
                                }
                            });
                        }
                    }
                },{
                    text: '重置',
                    handler: function(){
                        fileUploadForm.getForm().reset();
                    }
                }]
            });
        },
        createUploadWin : function(){
            fileUploadWin = createNoButtonWindow('文件上传',150,500,fileUploadForm);
        },
        getPanel:function(){
            return panel;
        },
        isInited:function(){
            return isInited;
        },
        getName:function(){
            return 'FileUpload';
        },
        setUrl :function(_url){
            url = _url;
        },
        setCallback : function(_callback){
            callback = _callback;
        },
        show : function(){
            if(Ext.isEmpty(url)||Ext.isEmpty(fileUploadWin)){
                show(Ext.MessageBox.WARNING,'请先初始化,并设置url参数');
                return;
            }
            fileUploadWin.show();
            fileUploadForm.getForm().reset();
        }
    }
}();
/**
if(!FileUpload.isInited()){
    FileUpload.setUrl('xxx');
    FileUpload.init();
}
FileUpload.show();
**/