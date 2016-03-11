/**
 * 定义侧边栏sideBar的开关状态(如果是true，则开启侧边栏，如果是false,则不显示侧边栏)
 */
var sideInfoBarEnable = false;

/**
 * 创建Homepage页面Id
 * @param obj
 * @return
 */
function createTabId(obj){
    var  modelId        = Ext.isEmpty(obj.modelId)?0:obj.modelId;
    var  gridPageId     = Ext.isEmpty(obj.gridPageId)?0:obj.gridPageId;
    var  entityTypeId   = Ext.isEmpty(obj.entityTypeId)?0:obj.entityTypeId;
    var  networkLayerId = Ext.isEmpty(obj.networkLayerId)?0:obj.networkLayerId;
    var  specialtyTypeId= Ext.isEmpty(obj.specialtyTypeId)?0:obj.specialtyTypeId;
    var  metaEntityTypeId= Ext.isEmpty(obj.metaEntityTypeId)?0:obj.metaEntityTypeId;
    if(gridPageId>0){
        return '_tabs'+modelId+'_'+entityTypeId+'_'+specialtyTypeId+'_'+networkLayerId+'_'+metaEntityTypeId;
    }else{
        return '_tabs'+modelId+'_'+entityTypeId;
    }
}

/**
 * 为存量配置出来的Region triggerfield赋值
 * @param fieldName  用于定义树的层次与entityTypeId(所以必须选定指点的4个值)
 * @param hiddenId
 * @param callback
 * @return
 */
function selectRegionWin(fieldName,callback,field){
    var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    var depth = 0;
    switch(fieldName){
        case 'field_townshipId':
            depth = 4;
            break;
		case 'field_aendCountyId':
        case 'field_zendCountyId':
        case 'field_countyId':
            depth = 3;
            break;
        case 'field_aendPrefectureId':
        case 'field_zendPrefectureId':
        case 'field_prefectureId':
            depth = 2;
            break;
        case 'field_provinceId':
            depth = 1;
            break;
    }
    
    var formPanel = field.findParentByType('form');
    var form = formPanel.getForm();
    var params = createParams(formPanel,fieldName);
    var href = 'inventoryRegionAction!createRegionTriggerField.html?nodeDepth='+depth+"&params="+params;
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(fieldName,rtn[0],field);
      }
}

/**
 * 区域选择未限制(可选择任意一级区域)
 * @param fieldName
 * @param callback
 * @param field
 * @return
 */
function selectRegionWithoutLimiteWin(fieldName,hiddenName,callback,field){
	var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
	var href = 'inventoryRegionAction!createRegionNoLimiteTriggerField.html?nodeDepth=4';
	var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(fieldName,hiddenName,rtn[0],field);
      }
}

/**
 * 区域选择未限制
 * @param fieldName
 * @param returnObj
 * @param field
 * @return
 */
function regionWithoutLimiteCallback(fieldName,hiddenName,returnObj,field){
	var formPanel = field.findParentByType('form');
	var form = formPanel.getForm();
	var fieldValueName;
	var fieldHiddenValueName;
	field.setValue(returnObj['name']);
	var fieldHidden = form.findField(hiddenName);
	if(!Ext.isEmpty(fieldHidden)){
		fieldHidden.setValue(returnObj['id']);
	}
}

function selectRegionTreeWin(fieldName,callback,field,rootFieldName){
    var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    var depth = 1;
    var rootDepth = 1;
    switch(fieldName){
        case 'field_townshipId':
            depth = 4;
            break;
        case 'field_countyId':
            depth = 3;
            break;
        case 'field_prefectureId':
            depth = 2;
            break;
        case 'field_provinceId':
            depth = 1;
            break;
    }
    switch(rootFieldName){
        case 'field_townshipId':
            rootDepth = 4;
            break;
        case 'field_countyId':
            rootDepth = 3;
            break;
        case 'field_prefectureId':
            rootDepth = 2;
            break;
        case 'field_provinceId':
            rootDepth = 1;
            break;
    }
    var formPanel = field.findParentByType('form');
    var form = formPanel.getForm();
    var params = createParams(formPanel,fieldName);
      var href = 'inventoryRegionAction!createRegionTriggerFieldTreeSelection.html?nodeDepth='+depth+"&params="+params+"&rootDepth="+rootDepth;
        var rtn = openModalDialogWindow(href, window, features);
        if (null != rtn) {
            callback(fieldName,rtn[0],field);
        }
}

function selectQualityRegionTreeWin(fieldName,callback,urlParams,rootFieldName){
    var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    var depth = 1;
    var rootDepth = 1;
    switch(fieldName){
        case 'field_townshipId':
            depth = 4;
            break;
        case 'field_countyId':
            depth = 3;
            break;
        case 'field_prefectureId':
            depth = 2;
            break;
        case 'field_provinceId':
            depth = 1;
            break;
    }
    switch(rootFieldName){
        case 'field_townshipId':
            rootDepth = 4;
            break;
        case 'field_countyId':
            rootDepth = 3;
            break;
        case 'field_prefectureId':
            rootDepth = 2;
            break;
        case 'field_provinceId':
            rootDepth = 1;
            break;
    }
    var params = 'params=';
    if(!Ext.isEmpty(urlParams))
    	params = urlParams;
      var href = 'inventoryRegionAction!createRegionTriggerFieldTreeSelection.html?nodeDepth='+depth+"&"+params+"&rootDepth="+rootDepth;
        var rtn = openModalDialogWindow(href, window, features);
        if (null != rtn) {
            callback(fieldName,rtn[0]);
        }
}

function findParentRegionValue(fieldName,field){
    var formPanel = field.findParentByType('form');
    if(formPanel!=null){
        var field = formPanel.getForm().findField(fieldName);
        if(field!=null)
            return field.getValue();
    }
    return null;
}
/**
 * 为存量配置出来的triggerfield赋值,不许修改
 * @param entityTypeId
 * @param fieldName
 * @param hiddenId
 * @param callback
 * @return
 */
function selectEntity(entityTypeId,fieldName,hiddenId,callback,field){
	var multSelect = Ext.isEmpty(Ext.getDom('multSelect'))?'':Ext.getDom('multSelect').value;
    var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    var href = "inventoryGridPage!createGridPage.html?isWin=true&entityTypeId="+entityTypeId;
    if(!Ext.isEmpty(multSelect)){
    	href+='&multSelect='+multSelect;
    }
    var formPanel = field.findParentByType('form');
    var form = formPanel.getForm();
    var params = createParams(formPanel,fieldName);
    if('parentAddressId'==fieldName){
        if(Ext.isEmpty(params)){
            params='limitAddressLevel,4,;field___AddressQueryIncludeRegion__,true,;';
        }else{
            params+='&limitAddressLevel,4,;field___AddressQueryIncludeRegion__,true,;';
        }
    }
    if('addressId'==fieldName){
        if(Ext.isEmpty(params)){
            params='limitAddressLevel,5,;field___AddressQueryIncludeRegion__,false,;';
        }else{
            params+='&limitAddressLevel,5,;field___AddressQueryIncludeRegion__,false,;';
        }
    }
    //alert(params);
    href=href+'&params='+params;
    //window.open(href);
    //return;
    //出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        if(multSelect=='true'){
            callback(fieldName,hiddenId,rtn,field);
        }else{
            callback(fieldName,hiddenId,rtn[0],field);
        }
        return rtn.length;
    }
}

/**
 * 为存量配置出来的triggerfield赋值,如果需要添加额外的参数,参数需要符合Params的规则
 * @param entityTypeId
 * @param fieldName
 * @param hiddenId
 * @param callback
 * @param field
 * @param additionalParams 
 * @return
 */
function selectEntityContainsAdditionalParams(entityTypeId,fieldName,hiddenId,callback,field,additionalParams){
	 var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
	    var href = "inventoryGridPage!createGridPage.html?isWin=true&entityTypeId="+entityTypeId;
	    var formPanel = field.findParentByType('form');
	    var form = formPanel.getForm();
	    var params = createParams(formPanel,fieldName);
	    if(!Ext.isEmpty(additionalParams)){
	    	for(var i=0;i<additionalParams.length;i++){
	    		var row = additionalParams[i];
	    		var code = row['field_code'];
	    		var field0key = row['field_value'];//从页面查找显示字段的值
	    		var field1key = row['field_hiddenValue'];//从页面查找掩藏字段的值
	    		var value = row['value'];//直接设置额外参数
	    		var hiddeValue = row['hiddenValue']//直接设置额外参数
	    		var field0Value;
	    		var field1Value;
	    		if(!Ext.isEmpty(field0key)){
	    			var field0 = form.findField(field0key);
	    			if(!Ext.isEmpty(field0)){
	    				field0Value = field0.getValue();
	    			}
	    		}
	    		
	    		if(!Ext.isEmpty(field1key)){
	    			var field1 = form.findField(field1key);
	    			if(!Ext.isEmpty(field1)){
	    				field1Value = field1.getValue();
	    			}
	    		}
	    		if(!Ext.isEmpty(code)&&!Ext.isEmpty(field0Value)){
	    			params += code+','+field1Value+','+field0Value+';';
	    		}else if(!Ext.isEmpty(code)&&!Ext.isEmpty(value)){
	    			params += code+','+value+','+hiddeValue+';';
	    		}
	    	}
	    }
	    href=href+'&params='+params;
	    //window.open(href);
	    //出错时放开调试，可以查看源码
	    var rtn = openModalDialogWindow(href, window, features);
	    if (null != rtn) {
	        callback(fieldName,hiddenId,rtn[0],field);
	    }
}

function selectMultiQualityScopeEntity(entityTypeId,gridPageTypeId, callback,selectionType, params){
    var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = "inventoryGridPage!createValidationGridPage.html?isWin=true&entityTypeId="+entityTypeId+"&gridPageTypeId="+gridPageTypeId+"&multSelect=true";
    if(!Ext.isEmpty(params))
    	href +="&"+params;
    if(selectionType != undefined)
    	href +="&selectionType="+selectionType;
    //window.open(href);
    //出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn);
    }
}

function selectMultiQualityScopeMetaEntity(metaEntityTypeId,gridPageTypeId, callback, params){
    var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = "inventoryGridPage!createValidationGridPage.html?isWin=true&metaEntityTypeId="+metaEntityTypeId+"&gridPageTypeId="+gridPageTypeId+"&multSelect=true";
    //window.open(href);
    //出错时放开调试，可以查看源码
    if(!Ext.isEmpty(params))
    	href +="&"+params;
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn);
    }
}

function selectOrderTaskActor(callback){
	var features = "dialogWidth:500px;dialogHeight:370px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = "comparisonNavigation!queryOrderTaskActor.html?isWin=true";
    //window.open(href);
    //出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn);
    }
}
/**
 * 创建trigger查询条件
 * @param form
 * @param fieldName
 * @param hiddenName
 * @param code
 * @returns {String}
 */
function createTriggerParams(form,fieldName,hiddenName,code){
    var name = getFieldValue(form,fieldName);
    var id = getFieldValue(form,hiddenName);
    if(Ext.isEmpty(id)){
        id = getFieldValue(form,hiddenName+'_In');
    }
    if(!Ext.isEmpty(name)&&id>0){
        return (Ext.isEmpty(code)?fieldName:code)+','+id+','+utfEncode(name)+';';
    }else{
        return '';
    }
}
/**
 * 创建combo查询条件
 * @param form
 * @param fieldName
 * @param code
 * @returns {String}
 */
function createComboParams(form,fieldName,code){
    var name = '';
    var id = getFieldValue(form,fieldName);
    
    if(id>0){
        name = form.getForm().findField(fieldName).getRawValue();
    }
    if(!Ext.isEmpty(name)&&id>0){
        return (Ext.isEmpty(code)?fieldName:code)+','+id+','+utfEncode(name)+';';
    }else{
        return '';
    }
}
function createParams(form,fieldName){
    var params='';
    var entityTypeCode = Ext.isEmpty(Ext.getDom('entityTypeCode'))?'':Ext.getDom('entityTypeCode').value;
    switch(fieldName){
        case 'deviceId'     ://设备比roomId多一个设备类型与roomId
            params += createTriggerParams(form,'roomId','field_roomId');
            params += createTriggerParams(form,'siteId','field_siteId');
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            params += createComboParams(form,'field___PortDeviceEntityTypeIdId__','entityTypeId');
            /**
            if(!Ext.isEmpty(form.getForm().findField('field___PortDeviceEntityTypeIdId__'))&&!Ext.isEmpty(form.findField('field___PortDeviceEntityTypeIdId__').getValue())){
                var deviceName = form.findField('field___PortDeviceEntityTypeIdId__').getRawValue();
                var deviceId = form.findField('field___PortDeviceEntityTypeIdId__').getValue();
                params += 'entityTypeId,'+deviceId+',;';
            }
            **/
            break;
        case 'roomId'       : 
            params += createTriggerParams(form,'siteId','field_siteId');
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'aendRoomId'       : 
            params += createTriggerParams(form,'aendSiteId','field_aendSiteId','siteId');
            break;
        case 'zendRoomId'       : 
            params += createTriggerParams(form,'zendSiteId','field_zendSiteId','siteId');
            break;
        case 'aendDeviceId'       : 
            params += createTriggerParams(form,'aendRoomId','field_aendRoomId','roomId');
            params += createTriggerParams(form,'aendStrongholdId','field_aendStrongholdId','strongholdId');
            params += createTriggerParams(form,'aendSiteId','field_aendSiteId','siteId');
            break;
        case 'zendDeviceId'       : 
            params += createTriggerParams(form,'zendRoomId','field_zendRoomId','roomId');
            params += createTriggerParams(form,'zendStrongholdId','field_zendStrongholdId','strongholdId');
            params += createTriggerParams(form,'zendSiteId','field_zendSiteId','siteId');
            break;
        case 'siteId'       : 
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'strongholdId' :
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'field_townshipId'   : 
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'field_countyId'     : 
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'field_prefectureId' : 
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'addressId' :
            if(!Ext.isEmpty(getFieldValue(form,'limitAddressLevel'))){
                params += 'limitAddressLevel,'+getFieldValue(form,'limitAddressLevel')+','+utfEncode('limitAddressLevel')+';';
            }
            if(!Ext.isEmpty(getFieldValue(form,'__AddressQueryIncludeRegion__'))){
                params += '__AddressQueryIncludeRegion__,'+getFieldValue(form,'__AddressQueryIncludeRegion__')+','+utfEncode('__AddressQueryIncludeRegion__')+';';
            }
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'aendPortId' :
            params += createTriggerParams(form,'aendDeviceId','field_aendDeviceId','deviceId');    
            params += createTriggerParams(form,'aendRoomId','field_aendRoomId','roomId');    
            params += createTriggerParams(form,'aendSiteId','field_aendSiteId','siteId');    
            params += createTriggerParams(form,'aendStrongholdId','field_aendStrongholdId','strongholdId');    
            break;
        case 'zendPortId' :
            params += createTriggerParams(form,'zendDeviceId','field_zendDeviceId','deviceId');    
            params += createTriggerParams(form,'zendRoomId','field_zendRoomId','roomId');    
            params += createTriggerParams(form,'zendSiteId','field_zendSiteId','siteId');    
            params += createTriggerParams(form,'zendStrongholdId','field_zendStrongholdId','strongholdId');
            break;
        case 'zendShelfId' :
            params += createTriggerParams(form,'zendDeviceId','field_zendDeviceId','deviceId');
            params += createTriggerParams(form,'zendRoomId','field_zendRoomId','roomId');    
            params += createTriggerParams(form,'zendSiteId','field_zendSiteId','siteId');    
            params += createTriggerParams(form,'zendStrongholdId','field_zendStrongholdId','strongholdId');
            break;
        case 'portId' :
            params += createTriggerParams(form,'deviceId','field_deviceId');
            break;
        case 'parentPortId' :
            params += createTriggerParams(form,'deviceId','field_deviceId');
            break; 
        case 'shelfId' :
            params += createTriggerParams(form,'deviceId','field_deviceId');
            break; 
        case 'rack.name'     :
            /**
            params += createTriggerParams(form,'roomId','field_roomId');
            params += createTriggerParams(form,'siteId','field_siteId');
            **/
            break;
        case 'room.name'       : 
            params += createTriggerParams(form,'site.name','site.id','siteId');
            params += createTriggerParams(form,'township.name','township.id','townshipId');
            params += createTriggerParams(form,'county.name','county.id','countyId');
            params += createTriggerParams(form,'prefecture.name','prefecture.id','prefectureId');
            params += createTriggerParams(form,'province.name','province.id','provinceId');
            break;
        case 'site.name'       : 
            params += createTriggerParams(form,'township.name','township.id','townshipId');
            params += createTriggerParams(form,'county.name','county.id','countyId');
            params += createTriggerParams(form,'prefecture.name','prefecture.id','prefectureId');
            params += createTriggerParams(form,'province.name','province.id','provinceId');
            break;
        case 'stronghold.name'       : 
            params += createTriggerParams(form,'township.name','township.id','townshipId');
            params += createTriggerParams(form,'county.name','county.id','countyId');
            params += createTriggerParams(form,'prefecture.name','prefecture.id','prefectureId');
            params += createTriggerParams(form,'province.name','province.id','provinceId');
            break;
        case 'township.name'       : 
            params += createTriggerParams(form,'county.name','county.id','countyId');
            params += createTriggerParams(form,'prefecture.name','prefecture.id','prefectureId');
            params += createTriggerParams(form,'province.name','province.id','provinceId');
            break;
        case 'county.name'       : 
            params += createTriggerParams(form,'prefecture.name','prefecture.id','prefectureId');
            params += createTriggerParams(form,'province.name','province.id','provinceId');
            break;
        case 'prefecture.name'       : 
            params += createTriggerParams(form,'province.name','province.id','provinceId');
            break;
        case 'parentDeviceId'       : 
            if(entityTypeCode=='Onu'){
                params += createTriggerParams(form,'grandFatherDeviceId','field_grandFatherDeviceId','grandFatherDeviceId');
            }
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
        case 'grandFatherDeviceId'       : 
            params += createComboParams(form,'field_townshipId','townshipId');
            params += createComboParams(form,'field_countyId','countyId');
            params += createComboParams(form,'field_prefectureId','prefectureId');
            params += createComboParams(form,'field_provinceId','provinceId');
            break;
    }
    if(fieldName.indexOf('childCircuitId2ParentCircuit___Relay2Signaling')==0){
        params += createTriggerParams(form,'aendDeviceId','field_aendDeviceId','aendDeviceId');
        params += createTriggerParams(form,'zendDeviceId','field_zendDeviceId','zendDeviceId');
    }
    return params;
}
/**
* 根据entityTypeCode,metaEntityTypeCode生成Trigger
*/
function createTrigger(name,label,entityTypeCode,metaEntityTypeCode,hiddenId,callback,allowBlank){
    var trigger = new Ext.form.TwinTriggerField({
        fieldLabel : label,
        name : name,
        allowBlank : allowBlank==undefined?true:allowBlank,
        editable : false,
        trigger1Class : 'x-form-clear-trigger',
        trigger2Class : 'x-form-search-trigger',
        onTrigger2Click : function () {
            if(!this.disabled){
                triggerClick(entityTypeCode,metaEntityTypeCode,callback,this);
            }
        },
        onTrigger1Click : function() {
            if(!this.disabled){
                trigger.setValue('');
                Ext.getCmp(hiddenId).setValue('');
            }
        }
    });
    return trigger;
}
function triggerClick(entityTypeCode,metaEntityTypeCode,callback,field){
    var formPanel = field.findParentByType('form');
    var form = formPanel.getForm();
    var params = createParams(formPanel,field.name);
    //alert(params);
    var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;location:no;";
    var href = "inventoryGridPage!createGridPage.html?isWin=true&entityType.code="+entityTypeCode+"&metaEntityTypeCode="+metaEntityTypeCode;
    href=href+'&params='+params;
    // window.open(href);
    // 出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn[0]);
    }
}

/**
 * 根据metaEntityTypeId创建trigger
 */
function createTriggerByMetaEntityTypeId(name,label,metaEntityTypeId,hiddenId,callback){
    var trigger = new Ext.form.TwinTriggerField({
        fieldLabel : label,
        name : name,
        //allowBlank : false,
        editable : false,
        trigger1Class : 'x-form-clear-trigger',
        trigger2Class : 'x-form-search-trigger',
        onTrigger2Click : function () {
            var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
            href = "inventoryGridPage!createGridPage.html?isWin=true&metaEntityTypeId="+metaEntityTypeId;
            // window.open(href);
            // 出错时放开调试，可以查看源码
            var rtn = openModalDialogWindow(href, window, features);
            if (null != rtn) {
                callback(rtn);
            }
        },
        onTrigger1Click : function() {
            trigger.setValue('');
            Ext.getCmp(hiddenId).setValue('');
        }
    });
    return trigger;
}
function createTriggerByMetaEntityTypeCode(name,label,metaEntityTypeCode,hiddenId,callback,allowBlank){
	//entityType List过滤
	var queryEntrance = Ext.isEmpty(Ext.getDom(name+'queryEntrance'))?'':Ext.getDom(name+'queryEntrance').value;
    var trigger = new Ext.form.TwinTriggerField({
        fieldLabel : label,
        name : name,
        allowBlank : allowBlank==undefined?true:allowBlank,
        editable : false,
        trigger1Class : 'x-form-clear-trigger',
        trigger2Class : 'x-form-search-trigger',
        onTrigger2Click : function () {
            var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
            href = "inventoryGridPage!createGridPage.html?isWin=true&metaEntityTypeCode="+metaEntityTypeCode;
            if(!Ext.isEmpty(queryEntrance)){
            	href+='&queryEntrance='+queryEntrance;
            }
            // window.open(href);
            // 出错时放开调试，可以查看源码
            var rtn = openModalDialogWindow(href, window, features);
            if (null != rtn) {
                callback(name,hiddenId,rtn[0]);
            }
        },
        onTrigger1Click : function() {
            trigger.setValue('');
            Ext.getCmp(hiddenId).setValue('');
        }
    });
    return trigger;
}
function createTriggerBySpecialtyTypeId(name,label,metaEntityTypeCode,specialtyTypeId,hiddenId,callback,allowBlank){
    var trigger = new Ext.form.TwinTriggerField({
        fieldLabel : label,
        name : name,
        allowBlank : allowBlank==undefined?true:allowBlank,
        editable : false,
        trigger1Class : 'x-form-clear-trigger',
        trigger2Class : 'x-form-search-trigger',
        onTrigger2Click : function () {
            var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
            href = "inventoryGridPage!createGridPage.html?isWin=true&metaEntityTypeCode="+metaEntityTypeCode+'&specialtyTypeIdForEntityType='+specialtyTypeId;
            // window.open(href);
            // 出错时放开调试，可以查看源码
            var rtn = openModalDialogWindow(href, window, features);
            if (null != rtn) {
                callback(name,hiddenId,rtn[0]);
            }
        },
        onTrigger1Click : function() {
            trigger.setValue('');
            Ext.getCmp(hiddenId).setValue('');
        }
    });
    return trigger;
}
/**
 * 根据entityTypeId、entityTypeCode & metaEntityTypeCode、metaEntityTypeId创建查询窗口
 */
function createQueryWin(entityTypeId,entityTypeCode,metaEntityTypeCode,metaEntityTypeId,callback){
    var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = 'inventoryGridPage!createGridPage.html?isWin=true';
    if(!Ext.isEmpty(entityTypeId)){
        href += '&entityTypeId='+entityTypeId;
    }
    if(!Ext.isEmpty(entityTypeCode)&&!Ext.isEmpty(metaEntityTypeCode)){
        href += '&entityType.code='+entityTypeCode+'&metaEntityTypeCode='+metaEntityTypeCode;
    }else if(!Ext.isEmpty(metaEntityTypeCode)){//应用meta查询传code的情况
    	href += '&metaEntityTypeCode='+metaEntityTypeCode;
    }
    
    if(!Ext.isEmpty(metaEntityTypeId)){
        href += '&metaEntityTypeId='+metaEntityTypeId;
    }
    
    // window.open(href);
    // 出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn);
    }
}
function createEntityQueryWinByEntityTypeCode(entityTypeCode,metaEntityTypeCode,multSelect,callback){
    var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = 'inventoryGridPage!createGridPage.html?isWin=true&multSelect='+multSelect;
    if(!Ext.isEmpty(entityTypeCode)&&!Ext.isEmpty(metaEntityTypeCode)){
        href += '&entityType.code='+entityTypeCode+'&metaEntityTypeCode='+metaEntityTypeCode;
    }else if(!Ext.isEmpty(metaEntityTypeCode)){//应用meta查询传code的情况
        href += '&metaEntityTypeCode='+metaEntityTypeCode;
    }
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn);
    }
}
/**
 * 根据attributeTypeId、metaAttributeTypeId创建查询窗口
 * 配置专用，请勿修改
 */
function createMetaQueryWin(attributeTypeId,metaEntityTypeId,fieldName,hiddenId,callback,field){
    var multSelect = Ext.isEmpty(Ext.getDom('multSelect'))?'':Ext.getDom('multSelect').value;
    var formPanel = field.findParentByType('form');
    var form = formPanel.getForm();
    var params = createParams(formPanel,field.name);
    //alert(params);
    var features = "dialogWidth:1000px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = 'inventoryGridPage!createGridPage.html?isWin=true';
    if(!Ext.isEmpty(multSelect)){
        href+='&multSelect='+multSelect;
    }
    if((typeof(entityTypeCode)!='undefined'&&'OpticalCircuit'==entityTypeCode)&&('aendPortId'==fieldName||'zendPortId'==fieldName)){
        params+='opticalElectricalFeature,2,;&paramReadOnly=true';
    }
    var opener = getOpener(window);
    if(!Ext.isEmpty(opener)){
    	var queryEntrance = Ext.isEmpty(opener.Ext.getDom('queryEntrance'+fieldName))?0:opener.Ext.getDom('queryEntrance'+fieldName).value;
    	if(queryEntrance>0){
    		href+='&queryEntrance='+queryEntrance;
    	}
    }else{
        var queryEntrance = Ext.isEmpty(Ext.getDom('queryEntrance'+fieldName))?0:Ext.getDom('queryEntrance'+fieldName).value;
        if(queryEntrance>0){
            href+='&queryEntrance='+queryEntrance;
        }
    }
    href=href+'&params='+params; 
    if(!Ext.isEmpty(metaEntityTypeId)){
        href += '&metaEntityTypeId='+metaEntityTypeId+'&attributeTypeId='+attributeTypeId;
    }
    //IP承载的本端设备类型根据专业过滤
    if(typeof(specialtyTypeId)!='undefined'&&specialtyTypeId>0){
    	href += '&specialtyTypeId='+specialtyTypeId;
    }
//     window.open(href);
    // 出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        if(multSelect=='true'){
            callback(fieldName,hiddenId,rtn,field);
        }else{
            callback(fieldName,hiddenId,rtn[0],field);
        }
        return rtn.length;
    }
}

/**
 * 根据attributeTypeId、metaAttributeTypeId创建查询窗口,EntityRelation专用
 * 配置专用，请勿修改
 */
function createMetaEntityRelationQueryWin(attributeTypeId,metaEntityTypeId,fieldName,hiddenId,entityTypeIds,callback,field){
	var formPanel = field.findParentByType('form');
	var form = formPanel.getForm();
	var params = createParams(formPanel,field.name);
	//alert(params);
	
	var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
	href = 'inventoryGridPage!createGridPage.html?isWin=true';
	href=href+'&params='+params; 
	if(!Ext.isEmpty(metaEntityTypeId)){
		href += '&metaEntityTypeId='+metaEntityTypeId+'&attributeTypeId='+attributeTypeId;
	}
	href += '&entityTypeIds='+entityTypeIds;
//     window.open(href);
	// 出错时放开调试，可以查看源码
	var rtn = openModalDialogWindow(href, window, features);
	if (null != rtn) {
		callback(fieldName,hiddenId,rtn[0],field);
		return rtn.length;
	}
}

/**
 * 逻辑端口查询条件“设备”特殊处理
 * @param specialtyTypeId
 * @param metaEntityTypeId
 * @param fieldName
 * @param hiddenId
 * @param callback
 * @param field
 * @return
 */
function createLogicPortDeviceQueryWin(specialtyTypeId,metaEntityTypeCode,fieldName,hiddenId,callback,field){
    var multSelect = Ext.isEmpty(Ext.getDom('multSelect'))?'':Ext.getDom('multSelect').value;
    var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = 'inventoryGridPage!createGridPage.html?isWin=true';
    href += '&metaEntityTypeCode='+metaEntityTypeCode+'&specialtyTypeIdForEntityType='+specialtyTypeId;
    if(!Ext.isEmpty(multSelect)){
        href+='&multSelect='+multSelect;
    }
    // window.open(href);
    // 出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        if(multSelect=='true'){
            callback(fieldName,hiddenId,rtn,field);
        }else{
            callback(fieldName,hiddenId,rtn[0],field);
        }
    }
}
/**
 * 根据metaAttributeTypeId创建Vlan的meta查询窗口(注vlan没有对应的attributeTypeId)
 */
function createVlanMetaQueryWin(metaEntityTypeId,callback,field,metaArrowBlank){
    var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
    href = 'inventoryVlanGridPage!createGridPage.html?isWin=true&metaVlan=true&metaArrowBlank='+metaArrowBlank;
    if(!Ext.isEmpty(metaEntityTypeId)){
        href += '&metaEntityTypeId='+metaEntityTypeId;
    }
    // window.open(href);
    // 出错时放开调试，可以查看源码
    var rtn = openModalDialogWindow(href, window, features);
    if (null != rtn) {
        callback(rtn,field);
    }
}

/**
 * 根据gridPageId创建查询窗口
 */
function createQueryWinByGridPageId(gridPageId,callback){
    if(gridPageId>0){
        href = "inventoryGridPage!createGridPage.html?isWin=true&gridPageId="+gridPageId;
        var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
        // window.open(href);
        // 出错时放开调试，可以查看源码
        var rtn = openModalDialogWindow(href, window, features);
        if (null != rtn) {
            callback(rtn);
        }
    }else{
        Ext.Msg.alert('错误','gridPageId 为空');
    }
}

function setCommonTriggerValue(fieldName,hiddenId,obj,field){
    var formPanel = field.findParentByType('form');
    if(fieldName.toLowerCase().indexOf('portid')>=0||fieldName.toLowerCase().indexOf('connectorid')>=0){
        var usingWhichName = obj.usingWhichName_hidden;
        if (usingWhichName <= 0 || usingWhichName == '1') {
            formPanel.getForm().findField(fieldName).setValue(obj.name==null?'':obj.name);
        }else{
            formPanel.getForm().findField(fieldName).setValue(obj.assembleName==null?'':obj.assembleName);
        }
    }else if(fieldName.toLowerCase().indexOf('addressid')>=0||fieldName.toLowerCase().indexOf('parentAddressId')>=0){
        formPanel.getForm().findField(fieldName).setValue(obj.detailedAddress==null?'':obj.detailedAddress);
    }else{
        formPanel.getForm().findField(fieldName).setValue(obj.name);
    }
    formPanel.getForm().findField(hiddenId).setValue(obj.id);
    setParentFieldValue(fieldName,obj,field);
}

function setCommonRegionValue(fieldName,obj,field){
    var formPanel = field.findParentByType('form');
    setRegionValue(fieldName,obj.name,obj.id,field);
    setParentFieldValue(fieldName,obj,field);
}

function getComboboxRawValueByFieldName(form,fieldName){
    var field  = form.findField(fieldName);
    if(!Ext.isEmpty(field)){
        var rawValue = field.getRawValue();
        if(!Ext.isEmpty(rawValue)||rawValue != 'null'){
            return rawValue;
        }
    }
        return '';
}

function getTextFieldValueByFieldName(form,fieldName){
    var field  = form.findField(fieldName);
    if(!Ext.isEmpty(field)){
        if(!Ext.isEmpty(field.getValue())){
            return field.getValue();
        }
    }
        return '';
    
}

//对于标准地址界面修改与新建的时候,选中了父关联标准地址与名称字段,自动补全详细地址,自动加拼音字段
function completeDetailedAddress(field,newValue,oldValue){
    var formPanel = field.findParentByType('form');
    var f = formPanel.getForm();
    var fValue = '';
    fValue = fValue + getComboboxRawValueByFieldName(f,'field_prefectureId');
    fValue = fValue + getComboboxRawValueByFieldName(f,'field_countyId');
    fValue = fValue + getComboboxRawValueByFieldName(f,'field_townshipId');
    fValue = fValue + getComboboxRawValueByFieldName(f,'parentAddressId');
    if(!Ext.isEmpty(newValue)){
        fValue = fValue + newValue;
    }
    setFieldValue(f,'field_detailedAddress',fValue);
    if(!Ext.isEmpty(f)){
        completeFirstSpell(newValue,f.findField('field_pinyin'));
    }
}

//对中文字符串显示拼音首字母
function completeFirstSpell(cnStr,field){
    var params = {cnStr:cnStr};
    ajaxRequest('inventoryCommonUtil!getFirstSpell.html',params,function(obj){
        if(!Ext.isEmpty(field)){
            field.setValue(obj.resultText);
        }
    });
}

function addressIsRegion(addressLevel){
    if(Ext.isEmpty(addressLevel)){
        return 'true';
    }else{
        switch(addressLevel){
        case '省份':
        case '地市':
        case '区县':
        case '乡镇':
        case '乡镇街道':
            return 'true';
        default :
            return 'false';
        }
    }
}

function setParentFieldValue(fieldName,obj,field){
    var entityTypeCode = '';
    if(Ext.getDom('entityTypeCode')!=undefined&&!Ext.isEmpty(Ext.getDom('entityTypeCode'))&&!Ext.isEmpty(Ext.getDom('entityTypeCode').value)){
        entityTypeCode = Ext.getDom('entityTypeCode').value;
    }
    var parentForm = field.findParentByType('form');
    switch(fieldName){
        //父级标准地址带区域属性
        case 'parentAddressId'      : 
            setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            if('StandardAddress'==entityTypeCode){
                //对于标准地址界面修改与新建的时候,选中了父关联标准地址,自动补全详细地址
                var parentForm = field.findParentByType('form');
                var addressNameStr = getTextFieldValueByFieldName(parentForm.getForm(),'field_name');
                completeDetailedAddress(field,addressNameStr,addressNameStr);
                var isRegion = false;
                if(obj.id.indexOf('Region')==0){
                    isRegion = true;
                }
                //标准地址 分区域与地址 需要特殊赋值 判定是否是区域
                setFieldValueInParentForm(field,'field___AddressIsRegion__',isRegion);
            }
            break;
        case 'addressId'     : 
            setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            break;
        case 'deviceId'     : 
            if('UtranCell'==entityTypeCode){
                setTriggerFieldValue('grandFatherDeviceId','field_grandFatherDeviceId',obj.parentDeviceId,obj.parentDeviceId_hidden,field);
                setTriggerFieldValue('roomId','field_roomId',obj.roomId,obj.roomId_hidden,field);
                setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
                setTriggerFieldValue('strongholdId','field_strongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
                setTriggerFieldValue('parentDeviceId','field_parentDeviceId',obj.parentDeviceId,obj.parentDeviceId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            }else if('AddressCover'==entityTypeCode){
                //不做处理
            }else{
                setTriggerFieldValue('roomId','field_roomId',obj.roomId,obj.roomId_hidden,field);
                setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
                setTriggerFieldValue('strongholdId','field_strongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
                setTriggerFieldValue('parentDeviceId','field_parentDeviceId',obj.parentDeviceId,obj.parentDeviceId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
                //所属设备类型
                setFieldValueInParentForm(field,'field___PortDeviceEntityTypeIdId__',obj.entityTypeId_hidden);
            }
            break;
        case 'aendDeviceId' :
            if('Signaling'==entityTypeCode){
                setTriggerFieldValue('strongholdId','field_strongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
                setTriggerFieldValue('roomId','field_roomId',obj.roomId,obj.roomId_hidden,field);
                setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
                break;
            }else if ('ExportShunt'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            }else if('PdhSection'==entityTypeCode||'PdhPath'==entityTypeCode||'MwPath'==entityTypeCode||'MwSection'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            setTriggerFieldValue('aendStrongholdId','field_aendStrongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
            setTriggerFieldValue('aendRoomId','field_aendRoomId',obj.roomId,obj.roomId_hidden,field);
            setTriggerFieldValue('aendSiteId','field_aendSiteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_aendCountyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_aendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            
            break;
        case 'zendDeviceId' :
            setTriggerFieldValue('zendStrongholdId','field_zendStrongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
            setTriggerFieldValue('zendRoomId','field_zendRoomId',obj.roomId,obj.roomId_hidden,field);
            setTriggerFieldValue('zendSiteId','field_zendSiteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_zendCountyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_zendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            if('SignalingLinks'==entityTypeCode){
                setFieldValueByAjax('field_ZENDSIGNALINGPOINTCODE', obj, 'NATIONALSIGNALINGPOINTCODE',field, '对端信令点编码为空，请在设备上进行补充');
            }
            break;
        case 'roomId'       : 
            setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            if(entityTypeCode=='Repeter'||entityTypeCode=='MovementGenerator'){
                setFieldValue(parentForm.getForm(),'field_x',obj.x);
                setFieldValue(parentForm.getForm(),'field_y',obj.y);
            }
            break;
        case 'aendRoomId'   :
            setTriggerFieldValue('aendSiteId','field_aendSiteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            if('Circuit'==entityTypeCode){
                setRegionValue('field_aendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_aendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            if('ExportShunt'==entityTypeCode){
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            }
            break;
        case 'zendRoomId'   :
            setTriggerFieldValue('zendSiteId','field_zendSiteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            if('Circuit'==entityTypeCode){
                setRegionValue('field_zendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_zendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            if('ExportShunt'==entityTypeCode){
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            }
            break;
        case 'aendSiteId'   : 
            if('SiteCable'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            }else if('Circuit'==entityTypeCode){
                setRegionValue('field_aendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_aendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            break;
        case 'zendSiteId'   : 
            if('SiteCable'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            }else if('Circuit'==entityTypeCode){
                setRegionValue('field_zendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_zendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            break;
        case 'siteId'       : 
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            if(entityTypeCode=='Occp'||entityTypeCode=='Odp'||entityTypeCode=='OpticalTerminalBox'||entityTypeCode=='SubStation'||entityTypeCode=='Repeter'){
                setFieldValue(parentForm.getForm(),'field_x',obj.x);
                setFieldValue(parentForm.getForm(),'field_y',obj.y);
            }
            break;
        case 'strongholdId' :
            setTriggerFieldValue('siteId','field_siteId',obj.siteId,obj.siteId_hidden,field);
            setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            if(entityTypeCode=='Occp'||entityTypeCode=='Odp'||entityTypeCode=='OpticalTerminalBox'||entityTypeCode=='Repeter'||entityTypeCode=='MovementGenerator'){
                setFieldValue(parentForm.getForm(),'field_x',obj.x);
                setFieldValue(parentForm.getForm(),'field_y',obj.y);
            }
            break;
        case 'aendStrongholdId'   : 
            if('Circuit'==entityTypeCode){
                setRegionValue('field_aendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_aendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            if('ExportShunt'==entityTypeCode){
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            }
            break;
        case 'zendStrongholdId'   : 
            if('Circuit'==entityTypeCode){
                setRegionValue('field_zendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_zendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            if('ExportShunt'==entityTypeCode){
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
            }
            break;
        case 'field_townshipId' : 
            setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
        case 'field_countyId'   : 
            setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            break;
        case 'field_prefectureId'   : 
            setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            break;
        case 'field_aendCountyId':
        	setRegionValue('field_aendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
        	break;
        case 'field_zendCountyId':
        	setRegionValue('field_zendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
        	break;
        case 'aendAccessPointCountyId'   : 
        	setTriggerFieldValue('aendAccessPointPrefectureId','field_aendAccessPointPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
        	break;
        case 'zendAccessPointCountyId'   : 
        	setTriggerFieldValue('zendAccessPointPrefectureId','field_zendAccessPointPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
        	break;
        case 'zendShelfId' :
            if('ExportShunt'==entityTypeCode){
                if(obj.specialtyTypeId=='PowerEnvironmentNetwork'){
                    setTriggerFieldValue('zendDeviceId','field_zendDeviceId',obj.deviceId,obj.deviceId_hidden,field);
                }else{
                    setTriggerFieldValue('zendDeviceId','field_zendDeviceId',obj.rackId,obj.rackId_hidden,field);
                }
            }
            break;
        case 'aendPortId' :
            setTriggerFieldValue('aendDeviceId','field_aendDeviceId',obj.deviceId,obj.deviceId_hidden,field);
            setTriggerFieldValue('aendStrongholdId','field_aendStrongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
            setTriggerFieldValue('aendRoomId','field_aendRoomId',obj.roomId,obj.roomId_hidden,field);
            setTriggerFieldValue('aendSiteId','field_aendSiteId',obj.siteId,obj.siteId_hidden,field);
            if('Bearing'==entityTypeCode){
            	setFieldValue(parentForm.getForm(),'field_CARDNAME',obj.cardId);
            	//setFieldValue(parentForm.getForm(),'field_PORTTYPE',obj.PORTTYPE);
            }
            if('PdhSection'==entityTypeCode||'PdhPath'==entityTypeCode||'ExportShunt'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            if('Circuit'==entityTypeCode){
                setRegionValue('field_aendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_aendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            break;
        case 'zendPortId'   :
            setTriggerFieldValue('zendDeviceId','field_zendDeviceId',obj.deviceId,obj.deviceId_hidden,field);
            setTriggerFieldValue('zendStrongholdId','field_zendStrongholdId',obj.strongholdId,obj.strongholdId_hidden,field);
            setTriggerFieldValue('zendRoomId','field_zendRoomId',obj.roomId,obj.roomId_hidden,field);
            setTriggerFieldValue('zendSiteId','field_zendSiteId',obj.siteId,obj.siteId_hidden,field);
            if('Circuit'==entityTypeCode){
                setRegionValue('field_zendCountyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_zendPrefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
            }
            if('ExportShunt'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setTriggerFieldValue('zendShelfId','field_zendShelfId',obj.shelfId,obj.shelfId_hidden,field);
            }
            break;
        case 'cellId'   :
            if('Antenna'==entityTypeCode){
                setTriggerFieldValue('grandFatherDeviceId','field_grandFatherDeviceId',obj.deviceId,obj.deviceId_hidden,field);
            }else if('Trx'==entityTypeCode||'Carrier'==entityTypeCode){
                setTriggerFieldValue('deviceId','field_deviceId',obj.deviceId,obj.deviceId_hidden,field);
            }else{
                setTriggerFieldValue('parentDeviceId','field_parentDeviceId',obj.deviceId,obj.deviceId_hidden,field);
            }
            break;
        case 'parentDeviceId'   :
            if('RepeterSplitter'!=entityTypeCode&&'Ap'!=entityTypeCode){
                setTriggerFieldValue('grandFatherDeviceId','field_grandFatherDeviceId',obj.grandFatherDeviceId,obj.grandFatherDeviceId_hidden,field);
            }
            if('BatteryPack'==entityTypeCode){
            	setFieldValue(parentForm.getForm(),'field_alias',obj.code);
            }
            if('BladeServer'==entityTypeCode){
                setRegionValue('field_townshipId',obj.townshipId,obj.townshipId_hidden,field);
                setRegionValue('field_countyId',obj.countyId,obj.countyId_hidden,field);
                setRegionValue('field_prefectureId',obj.prefectureId,obj.prefectureId_hidden,field);
                setRegionValue('field_provinceId',obj.provinceId,obj.provinceId_hidden,field);
            }
            break;
        case 'circuitBundle1Id'   : 
        	if('Signaling'==entityTypeCode||'Relay'==entityTypeCode){
        		setTriggerFieldValue('aendDeviceId','field_aendDeviceId',obj.aendDeviceId,obj.aendDeviceId_hidden,field);
        	}
        	break;
        case 'circuitBundle2Id'   : 
        	if('Signaling'==entityTypeCode||'Relay'==entityTypeCode){
        		setTriggerFieldValue('zendDeviceId','field_zendDeviceId',obj.aendDeviceId,obj.aendDeviceId_hidden,field);
        	}
        	break;
    }
}
/**
 * 根据id从后台取出对象，再取属性值。用于没有配置出的列取值
 * @param fieldName
 * @param obj
 * @param objProperty
 * @param field
 * @param alertMsg
 */
function setFieldValueByAjax(fieldName, obj, objProperty, field, alertMsg) {
	var formPanel = field.findParentByType('form');
	var f = formPanel.getForm().findField(fieldName);
	if (!f) {
		return;
	}
	var url = 'inventoryGridPage!queryData.html';
	var param = {};
	param['entityTypeId'] = obj.entityTypeId_hidden;
	param['field_id'] = obj.id;
	param['needExtension'] = true;
	progressBar_dlg.showDialog();
	ajaxRequest('inventoryGridPage!queryData.html',param,function(parseObj){
		progressBar_dlg.hideDialog();
		if (parseObj.rows.length > 0) {
			var entity = parseObj.rows[0];
			if (!!entity[objProperty]) {
				f.setValue(entity[objProperty]);
			}else {
				var extension = entity['extension'];
				if(!!extension){
					var extensionAttributes = extension['attributes'];
					if (!!extensionAttributes && !!extensionAttributes[objProperty]) {
						f.setValue(extensionAttributes[objProperty]);
					}else if (!!alertMsg){
						Ext.Msg.alert('警告',alertMsg);
					}
				}else{
					Ext.Msg.alert('警告',alertMsg);
				}
			}
		}
	});
}
/**
 * 封装Gird页面内部调用，用于设置Trigger的值
 * @param fieldName
 * @param hiddenId
 * @param obj
 * @return
 */
function setQueryTriggerValue(fieldName,hiddenId,obj,field){
    setCommonTriggerValue(fieldName,hiddenId,obj,field);
}

/**
 * @param fieldName
 * @param fieldDisplayValue
 * @param fieldValue
 * @param field
 * @return
 */
        
function setRegionValue(fieldName,fieldDisplayValue,fieldValue,field){
    var parentForm = field.findParentByType('form');
    var region = parentForm.getForm().findField(fieldName);
    if(!Ext.isEmpty(region)){
        if(Ext.isEmpty(fieldValue)){
            region.setValue('');
        }else{
        	//循环有重复不加
        	var regionStore = region.getStore();
        	var count = region.getStore().getCount();
        	if(count>0){
        		var records = regionStore.getRange(0,count);
        		for(var i = 0;i<records.length;i++){
        			var record = records[i];
        			if(!Ext.isEmpty(record.get('id'))&&fieldValue==record.get('id')){
        				region.setValue(fieldValue);
        				return;
        			}
        		}
        		
        	}
    		var returnEntity= new Ext.data.Record({
    			name:fieldDisplayValue,
    			id:fieldValue
    		});
    		regionStore.insert(0,[returnEntity]);
    		region.setValue(fieldValue);
        }
        
    }
}

/**
 * 暂时写成setQueryRegionFieldValue--以后统一更改方法名
 * @param fieldId
 * @param hiddenId
 * @param fieldValue
 * @param hiddenValue
 * @param field
 * @return
 */
function setTriggerFieldValue(fieldId,hiddenId,fieldValue,hiddenValue,field){
    var formPanel = field.findParentByType('form');
    if(!Ext.isEmpty(formPanel.getForm().findField(fieldId))&&!Ext.isEmpty(formPanel.getForm().findField(hiddenId))){
        if(!Ext.isEmpty(fieldValue)&&!Ext.isEmpty(hiddenValue)){
            formPanel.getForm().findField(fieldId).setValue(fieldValue);
            formPanel.getForm().findField(hiddenId).setValue(hiddenValue);
        }else{
            formPanel.getForm().findField(fieldId).setValue('');
            formPanel.getForm().findField(hiddenId).setValue('');
        }
    }
}

/**
 * 区域树
 * var region = createRegionTrigger('region','区域','regionId',true,2,function(obj){
 *      alert(obj.length);
 * });
 * @param name
 * @param label
 * @param hiddenId
 * @param callback
 * @return
 */
function createRegionTrigger(name, label, hiddenId, checkTree, regionLevel,
        callback) {
    if (Ext.isEmpty(checkTree)) {
        checkTree = false;
    }
    var trigger = new Ext.form.TwinTriggerField(
    {
        fieldLabel : label,
        name : name,
        //allowBlank : false,
        editable : false,
        trigger1Class : 'x-form-clear-trigger',
        trigger2Class : 'x-form-search-trigger',
        onTrigger2Click : function() {
            var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
            href = "regionMgmt!selectRegion.html?checkTree=true&regionLevel="
                    + regionLevel;
            // window.open(href);
            // 出错时放开调试，可以查看源码
            var rtn = openModalDialogWindow(href, window, features);
            if (null != rtn) {
                if (checkTree) {
                    var ids = '';
                    var names = '';
                    for ( var i = 0; i < rtn.length; i++) {
                        if (ids == '') {
                            ids = rtn[i].id;
                            names = rtn[i].name;
                        } else {
                            ids += ',' + rtn[i].id;
                            names += ',' + rtn[i].name;
                        }
                    }
                    trigger.setValue(names);
                    Ext.getCmp(hiddenId).setValue(ids);
                } else {
                    var obj = rtn[0];
                    trigger.setValue(obj.name);
                    Ext.getCmp(hiddenId).setValue(obj.id);
                }
                if (!Ext.isEmpty(callback)) {
                    callback(rtn);
                }
            }
        },
        onTrigger1Click : function() {
            trigger.setValue('');
            Ext.getCmp(hiddenId).setValue('');
        }
    });
    return trigger;
}
function setTiggerValue(fieldId, hiddenId, fieldValue, hiddenValue, formPanel) {
    if (!Ext.isEmpty(fieldValue) && !Ext.isEmpty(hiddenValue)) {
        formPanel.getForm().findField(fieldId).setValue(fieldValue);
        formPanel.getForm().findField(hiddenId).setValue(hiddenValue);
    }else{
        formPanel.getForm().findField(fieldId).setValue('');
        formPanel.getForm().findField(hiddenId).setValue('');
    }
}

function createUrl(val, metaData, record, rowIndex, columnIndex, store){
    var cancelClick = Ext.isEmpty(Ext.getDom('cancelClick'))?'':Ext.getDom('cancelClick').value;
    
    var grid = criteriaGrid.getGridPanel();
    var record = grid.getStore().getAt(rowIndex);  // Get the Record
    var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get field name
    var columName = grid.getColumnModel().getColumnHeader(columnIndex);
    var data = record.get(fieldName);
    var entityId = record.get(fieldName+'_hidden');
    var entityTypeId = record.get(fieldName+'_entityTypeId');
    if(!Ext.isEmpty(val)&&entityId>0&&entityTypeId>0&&cancelClick!='true'){
        var str = "<a style=\"color:blue;\" href=# onclick=\"return false;\" ondblclick=\"return false;\">"+val+"</a>";
        return str;
    }else{
        return val;
    }
}

function createRegionTrigger(){
    var url = 'inventoryGridPage!queryData.html?gridPageId=1721&queryType=combo';
    var entity = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'}]);
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({url: url,method:'POST'}),
        reader: new Ext.data.JsonReader({},entity)
    });
    
    var combo = new Ext.form.ComboBox({
        fieldLabel: '乡镇街道',
        name:'townshipId',
        store: store,
        valueField:'id',
        displayField:'name',
        typeAhead: true,
        loadingText: '查询中...',
        triggerClass : 'x-form-search-trigger',
        width:100,
        labelWidth:60,
        minChars:1,
        hideTrigger:false,
        forceSelection:true,
        triggerAction:'all',
        onTriggerClick: function() {
            selectEntity('60013','townshipId','field_townshipId',function(fieldName,hiddenId,obj){
                var returnEntity= new entity({
                    name:obj.name,
                    id:obj.id
                });
                store.insert(0,[returnEntity]);
                combo.setValue(obj.id);
            });
        }
    });     
   
    store.on("beforeload", function() {
        store.baseParams = {'field_name_Like':combo.getRawValue(),start:0,limit:20 };
    });
    return combo;
}
/*********以下暂未写完*********/
function createRegionTriggerBackup(){
    var url = 'inventoryGridPage!queryData.html?gridPageId=1721&queryType=combo';
    var entity = Ext.data.Record.create([
         {name: 'id', type: 'string'},
         {name: 'name', type: 'string'},
         {name: 'townshipId', type: 'string'},
         {name: 'townshipId_hidden', type: 'string'},
         {name: 'countyId', type: 'string'},
         {name: 'countyId_hidden', type: 'string'},
         {name: 'prefectureId', type: 'string'},
         {name: 'prefectureId_hidden', type: 'string'},
         {name: 'provinceId', type: 'string'},
         {name: 'provinceId_hidden', type: 'string'}
    ]);
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({url: url,method:'POST'}),
        reader: new Ext.data.JsonReader({},entity)
    });
    
    var combo = new Ext.form.ComboBox({
        fieldLabel: '乡镇街道',
        name:'townshipId',
        store: store,
        valueField:'id',
        displayField:'name',
        typeAhead: true,
        loadingText: '查询中...',
        triggerClass : 'x-form-search-trigger',
        width:100,
        labelWidth:60,
        minChars:1,
        hideTrigger:false,
        forceSelection:true,
        triggerAction:'all',
        onTriggerClick: function() {
            selectEntity('60013','townshipId','field_townshipId',function(fieldName,hiddenId,obj){
                var returnEntity= new entity({
                    name:obj.name,
                    id:obj.id
                });
                store.insert(0,[returnEntity]);
                combo.setValue(obj.id);
            });
        }
    });     
   
    store.on("beforeload", function() {
        store.baseParams = {'field_name_Like':combo.getRawValue(),start:0,limit:20 };
    });
    return combo;
}

function onlineSelect(field,d){
    var formPanel = field.findParentByType('form');
    if(field.name.indexOf('field_')==0){
    	if(!Ext.isEmpty(formPanel.getForm().findField('field_offlineDate'))){
    		formPanel.getForm().findField('field_offlineDate').setMinValue(field.getValue());
    	}
    }else{
    	if(!Ext.isEmpty(formPanel.getForm().findField('offlineDate'))){
    		formPanel.getForm().findField('offlineDate').setMinValue(field.getValue());
    	}
    }
}
function offlineSelect(field,d){
    var formPanel = field.findParentByType('form');
    if(field.name.indexOf('field_')==0){
    	if(!Ext.isEmpty(formPanel.getForm().findField('field_onlineDate'))){
    		formPanel.getForm().findField('field_onlineDate').setMaxValue(field.getValue());
    	}
    }else{
    	if(!Ext.isEmpty(formPanel.getForm().findField('onlineDate'))){
    		formPanel.getForm().findField('onlineDate').setMaxValue(field.getValue());
    	}
    }
}

function dateFieldBlur(field){
    if(Ext.isEmpty(field.getValue())){
        var formPanel = field.findParentByType('form');
        if(field.getName()=='field_onlineDate'){
            if(!Ext.isEmpty(formPanel.getForm().findField('field_offlineDate'))){
                formPanel.getForm().findField('field_offlineDate').setMinValue('');
            }
        }else{
            if(!Ext.isEmpty(formPanel.getForm().findField('field_onlineDate'))){
                formPanel.getForm().findField('field_onlineDate').setMaxValue('');
            }
        }
    }
}

function setFieldValueInParentForm(field,fieldName,value){
    var formPanel = field.findParentByType('form');
    if(!Ext.isEmpty(formPanel)){
        var form = formPanel.getForm();
        if(!Ext.isEmpty(form)&&!Ext.isEmpty(form.findField(fieldName))){
            form.findField(fieldName).setValue(value);
        }
    }
}
/**
 * 清空TriggerField的值，及其对应的HiddenField值
 * @param field
 * @return
 */
function resetTriggerField(field){
    var formPanel = field.findParentByType('form');
    field.setValue('');
    var hiddenField = formPanel.getForm().findField('field_'+field.getName());
    if(Ext.isEmpty(hiddenField)){
        hiddenField = formPanel.getForm().findField('field_'+field.getName()+'_In');
    }
    if(!Ext.isEmpty(hiddenField)){
        hiddenField.setValue('');
    }
    if(!Ext.isEmpty(Ext.getCmp(field.getName()+'_Intip'))){
        Ext.getCmp(field.getName()+'_Intip').destroy();
    }
    if(!Ext.isEmpty(Ext.getCmp(field.getName()+'tip'))){
        Ext.getCmp(field.getName()+'tip').destroy();
    }
}
/**
 * 清空TriggerField的值，及其对应的HiddenField值(指定相关的name)
 * @param field
 * @return
 */
function resetTriggerFieldByName(field,fieldName,fieldHiddenName){
	var formPanel = field.findParentByType('form');
    var myField = formPanel.getForm().findField(fieldName);
    var myHiddenField = formPanel.getForm().findField(fieldHiddenName);
    if(!Ext.isEmpty(myField)){
    	myField.setValue('');
    }	
    if(!Ext.isEmpty(myHiddenField)){
    	myHiddenField.setValue('');
    }	
}

/**
 * 清空TriggerField的值，及其对应的HiddenField值
 * @param field
 * @return
 */
function resetSpecialTriggerField(field,hiddenName){
    var formPanel = field.findParentByType('form');
    field.setValue('');
    var hiddenField = formPanel.getForm().findField(hiddenName);
    if(!Ext.isEmpty(hiddenField)){
        hiddenField.setValue('');
    }
    if(!Ext.isEmpty(Ext.getCmp(field.getName()+'tip'))){
    	Ext.getCmp(field.getName()+'tip').destroy();
    }
}

/**
 * 设置地址类的 只知道fieldName与id 却不知道显示名字的控件做处理//(目前只有区域的combobox有这种情况)
 * @param field
 * @param fieldName
 * @param fieldValue
 * @return
 */
function setFieldValueByFieldName(field,fieldName,fieldValue){
    if(field.getXType()=='combo'){//目前只对combo的有特殊处理,以后需要trigger的再特殊处理
        ajaxRequest('inventoryCommonUtil!findFieldValueStringByFieldName.html',{'id':fieldValue,'fieldName':fieldName},function(obj){
            switch(fieldName){
                case 'field_townshipId':
                case 'field_countyId':
                case 'field_prefectureId':
                case 'field_provinceId':
                        field.getStore().add(new Ext.data.Record({'id':fieldValue,'name':obj.resultText}));
                    break;
            }
            field.setValue(fieldValue);
        });
    }else{
        field.setValue(fieldValue);
    }
}
/**
 * 查询条件回车提交
 * @param field
 * @param e
 * @return
 */
function textFieldEnterEvent(field,e){
    if(e.getKey()==13){
        queryData();
    }
}
/**
 * Combobox数据的模糊查询(目前只加了静态数据的Combobox)
 * @param queryEvent
 * @return
 */
function addComboboxLikeQuery(combobox){
	combobox.on('beforequery',function(qe){   
	    var combo = qe.combo;   
	    //q is the text that user inputed.   
	    var q = qe.query;   
	    forceAll = qe.forceAll;   
	    if(forceAll === true || (q.length >= combo.minChars)){   
	        if(combo.lastQuery !== q){   
	            combo.lastQuery = q;
//	            var data = combo.getStore().data;
//	            if(!Ext.isEmpty(data)){   
	                combo.selectedIndex = -1;   
	                if(forceAll){   
	                    combo.store.clearFilter();   
	                }else{   
	                    combo.store.filterBy(function(record,id){   
	                        var text = record.get(combo.displayField);   
	                        //在这里写自己的过滤代码   
	                        return (text.indexOf(q)!=-1);   
	                    });   
	                }   
	                combo.onLoad();   
//	            }
//	                else{   
//	                combo.store.baseParams[combo.queryParam] = q;   
//	                combo.store.load({   
//	                    params: combo.getParams(q)   
//	                });   
//	                combo.expand();   
//	            }   
	        }else{   
	            combo.selectedIndex = -1;   
	            combo.onLoad();   
	        }   
	    }   
	    return false;   
	}); 
}
 

//单双击事件处理
function findClickType(grid,rowIndex,columnIndex,fireClickType){
   if(columnIndex>1){
       var dataIndex =  grid.getColumnModel().getDataIndex(columnIndex);
       var record = grid.getStore().getAt(rowIndex);
       var cellValue = record.get(dataIndex+'_hidden');
       if(Ext.isEmpty(cellValue)){
    	   if(fireClickType=='cell'){
    		  return 'false'; 
    	   }else{
    		   return 'row';
    	   }
       }else{
    	   if(fireClickType=='row'){
     		  return 'false'; 
     	   }else{
     		  return 'cell';
     	   }
       }
   }else{
       return 'false';
   }
}

function getColumnEntityId(grid,rowIndex,columnIndex,clickType){
   switch(clickType){
       case 'row':
           var record = grid.getStore().getAt(rowIndex);
           var entityId= record.get('id');
           return entityId;
       case 'cell':
           var dataIndex =  grid.getColumnModel().getDataIndex(columnIndex);
           var record = grid.getStore().getAt(rowIndex);
           var cellValue = record.get(dataIndex+'_hidden');
           return cellValue;
   }
   
}

function getColumnEntityTypeId(grid,rowIndex,columnIndex,clickType){
   switch(clickType){
       case 'row':
           var record = grid.getStore().getAt(rowIndex);
           var myEntityTypeId = entityTypeId;
           if(!Ext.isEmpty(record.get('entityTypeId'))&&record.get('entityTypeId')>0){
               myEntityTypeId = record.get('entityTypeId');
           }
           return myEntityTypeId;
       case 'cell':
           var dataIndex =  grid.getColumnModel().getDataIndex(columnIndex);
           var record = grid.getStore().getAt(rowIndex);
           var cellValue = record.get(dataIndex+'_entityTypeId');
           return cellValue;
       }

}

function getGridRowId(entityId){
	entityId = entityId+'';
	if(!Ext.isEmpty(entityId)){
		var index = entityId.indexOf('_',0);
		if(index==-1){
			return entityId;
		}
		else{
			return entityId.substr(index+1,entityId.length);
		}
	}
	return entityId;
}
function cellClick(title,entityId,entityTypeId,findObjectUrl){
	if(sideInfoBarEnable){
		var sideBar = findCriteriaGridSideBar();
	    if(sideBar.collapsed){
	        sideBar.expand();
	    }
	    var params = {};
	    params.entityId = getGridRowId(entityId);
	    params.entityTypeId = entityTypeId;
	    sideBar.setSource({});
	    if(Ext.isEmpty(findObjectUrl)){
	        findObjectUrl = 'inventoryHomePage!findEntitySidebarInfo.html'
	    }
	    ajaxRequest(findObjectUrl,params,function(obj){
	        sideBar.setTitle(title);
	        sideBar.setSource(obj);
	    });
	}else{
		
	}
   
}

function getTabTitle(grid,rowIndex,columnIndex,clickType){
    var title = ''
   switch(clickType){
       case 'row':
           var record = grid.getStore().getAt(rowIndex);
           title = record.get('name');
           break;
       case 'cell':
           var record = grid.getStore().getAt(rowIndex);
           var dataIndex =  grid.getColumnModel().getDataIndex(columnIndex);
           title = record.get(dataIndex);
           break;
   }
    if(Ext.isEmpty(title)){
        return '';
    }else{
        return title;
    }
}
 
function celldblClick(tabTitle,entityId,entityTypeId){
	var cancelClick = Ext.isEmpty(Ext.getDom('cancelClick'))?'':Ext.getDom('cancelClick').value;
	if(cancelClick=='true'){
		return;
	}
    if(entityTypeId>0){
        //alert(fieldName+'='+data+'|entityId='+entityId+'|entityTypeId='+entityTypeId);
    	entityId = getGridRowId(entityId);
        var tabId =createTabId({modelId:entityId,entityTypeId:entityTypeId});
        var conentPanel = null;
        
        try{
        	var openerWindow = getBottomOpener(window);
        	if(!Ext.isEmpty(openerWindow)){
        		if(typeof(top.getContentPanel)!='undefined'){
        			conentPanel = top.getContentPanel();
        		}else{
        			if(typeof(openerWindow.getContentPanel)!='undefined'){
        				conentPanel = openerWindow.getContentPanel();
        			}
        		}
        	}else{
        		conentPanel = top.getContentPanel();
        	}
        }catch(e){
        	show(Ext.Msg.ERROR,'未找到TabPanel!');
        	return;
        }
        if(Ext.isEmpty(conentPanel)){
        	show(Ext.Msg.ERROR,'未找到TabPanel!');
        	return;
        }
        var son = conentPanel.findById(tabId);
        if(!Ext.isEmpty(son)){
            conentPanel.activate(tabId);
            return;
        }
        var params = {};
        params.entityTypeId=entityTypeId;
        params.entityId = entityId;
        ajaxRequest('inventoryHomepageDispatch!findTabsByEntityTypeId.html',params,function(obj){
            var items = [];
            for(var i=0;i<obj.length;i++){
                var title = obj[i].tabName;
                var tabCode = obj[i].tabCode;
                var url = obj[i].actionName+'&entityId='+entityId+'&entityTypeId='+entityTypeId+'&tabCode='+tabCode+'&userId='+ctx.user.id+'&tabId='+tabId;
                var item = {
                    title:title,
                    xtype:'panel',
                    id:tabCode,
                    closable:false,
                    bodyStyle: 'padding:0px',
                    html : '<IFRAME name="_'+tabCode+'" id="_'+tabCode+'" width="100%" height="100%" frameborder="0" scrolling="yes" src="'+url+'"></IFRAME>'
                };
                items = items.concat([item]);
            }
            conentPanel.add({
                id:tabId,
                xtype:'tabpanel',
                autoScroll:false,
                closable:true,
                title:tabTitle,
                items:[items],
                activeTab:0
            });
           if(sideInfoBarEnable){
	           var sideBar = findCriteriaGridSideBar();
	            sideBar.collapse();
           }else{
           	
           }
           conentPanel.activate(tabId);
        });
    }
}

//标准grid单双击事件(clickType(all,row,cell,none))//根据clickType接受所有点击，行点击，单元格点击
function addGridClickListener(grid,fireClickType){
	if(fireClickType == 'none'){
		return ;
	}
    var checkClick = false; 
    var dblclick = false; 
    grid.addListener('cellclick' ,function(grid,rowIndex,columnIndex,e){ 
		if(!checkClick){ 
	        dblclick = false; 
	        var clickType = findClickType(grid,rowIndex,columnIndex,fireClickType);
	        if('false'!=clickType){
	        	var task = new Ext.util.DelayedTask(function(){
	        		if(!dblclick){
			            var record = grid.getStore().getAt(rowIndex);
			            var title= getTabTitle(grid,rowIndex,columnIndex,clickType);
			            cellClick(title,getColumnEntityId(grid,rowIndex,columnIndex,clickType),getColumnEntityTypeId(grid,rowIndex,columnIndex,clickType),'inventoryHomePage!findEntitySidebarInfo.html');
                    } 
                 }); 
                 task.delay(300); 
            }
		}else{ 
		    checkClick = false; 
		} 
    });
    
    grid.addListener('celldblclick',function(grid,rowIndex,columnIndex,e){
        var clickType = findClickType(grid,rowIndex,columnIndex,fireClickType);
        if('false'!=clickType){
            if(!checkClick){
                var tabTitle = '查看'+getTabTitle(grid,rowIndex,columnIndex,clickType);
                celldblClick(tabTitle,getColumnEntityId(grid,rowIndex,columnIndex,clickType),getColumnEntityTypeId(grid,rowIndex,columnIndex,clickType));
                dblclick = true; 
            }else{ 
                 checkClick = false; 
             } 
        } 
    }); 
}

//标准grid的单双击事件
function addCriteriaGridClickListener(grid){
	addGridClickListener(grid,'all');
}



function viewDetail(position,entityId,entityTypeId,title){
	var tabPanel = null;
	if(position=='top'){
		tabPanel = top.getContentPanel();
	}else if(position=='parent'){
		tabPanel = parent.getContentPanel();
	}else if(position=='self'){
		tabPanel = getContentPanel();
	}
	if(Ext.isEmpty(tabPanel)){
		show(Ext.Msg.ERROR,'TabPanel is null');
	}else{
		var url = 'inventoryHomepageDispatch!viewDeviceDetail.html?entityId='+entityId+'&entityTypeId='+entityTypeId;
		addPanelToTab(tabPanel,'查看'+title,url,true);
	}
}

/**
 * 用于转换store中的Object对象，显示对象的名字
 */
function portRenderer(v){
    if(!Ext.isEmpty(v)){
        var usingWhichName = v.usingWhichName;
        if (usingWhichName <= 0 || usingWhichName == '1') {
            return v.name;
        }else{
            return v.assembleName;
        }
    }else{
        return '';
    }
}


