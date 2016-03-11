function createMultiCombo(label,name,url,allowBlank){
	var entity = null;
    if(typeof(fields)=='undefined'){
        entity = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'},{name: 'memo',type: 'string'}]);
    }else{
        entity = fields;
    }
    var emptyEntity= new entity({
        name:'--请选择--',
        id:'  '
    });
    
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({url: url,method:'POST'}),
        reader: new Ext.data.JsonReader({},entity),
        listeners:{
            load : function(){
                if(allowBlank!=false){
                    store.insert(0,[emptyEntity]);
                }
            }
        }
    });
    
    var combo = new Ext.ux.form.LovCombo({
        fieldLabel: label,
        name:name,
        hiddenName:name,
        //tpl:'<tpl for="."><div class="x-combo-list-item" ext:qtitle="" ext:qtip="{name}">{name}</div></tpl>',
        allowBlank:allowBlank==undefined?true:allowBlank,
        store: store,
        valueField:'id',
        displayField:'name',
        editable:true,
        forceSelection:true,
        typeAhead: true,
        loadingText: '查询中...',
        labelWidth:60,
        hideTrigger:false,
        mode:'local',
        triggerAction:'all'
    });
    store.load();
    return combo;
}
/**
 * 私有的创建combo的方法
 * 当必填时不增加空选项
 * @param label
 * @param name
 * @param url
 * @return
 */
function createCombo(label,name,url,allowBlank){
	var combobox = createNoLoadCombo(label,name,url,allowBlank);
	combobox.getStore().load();
	return combobox;
}


function createNoLoadCombo(label,name,url,allowBlank,fields){
    var entity = null;
    if(typeof(fields)=='undefined'){
        entity = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'},{name: 'memo',type: 'string'}]);
    }else{
        entity = fields;
    }
    var emptyEntity= new entity({
        name:'--请选择--',
        id:'  '
    });
    
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({url: url,method:'POST'}),
        reader: new Ext.data.JsonReader({},entity),
        listeners:{
            load : function(){
                if(allowBlank!=false){
                    store.insert(0,[emptyEntity]);
                }
            }
        }
    });
    
    var combo = new Ext.form.ComboBox({
        fieldLabel: label,
        name:name,
        hiddenName:name,
        tpl:'<tpl for="."><div class="x-combo-list-item" ext:qtitle="" ext:qtip="{name}">{name}</div></tpl>',
        allowBlank:allowBlank==undefined?true:allowBlank,
        store: store,
        valueField:'id',
        displayField:'name',
        editable:true,
        forceSelection:true,
        typeAhead: true,
        loadingText: '查询中...',
        labelWidth:60,
        hideTrigger:false,
        mode:'local',
        triggerAction:'all'
    });
    return combo;
}
/**************************子典型下拉列表*******************************/
/**
 * 单双面
 * @param name
 * @return
 */
function createSidedcategoryCombo(name,allowBlank) {
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_SIDEDCATEGORY";
    return createCombo('单双面', name, url,allowBlank);
}
/**
 * 端口类型
 * @return
 */
function createPortCategoryCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=PORT_PORTCATEGORY";
    return createCombo('端口类型', name, url,allowBlank);
}
/**
 * 机架正反属性
 * @return
 */
function createRackInstallationSideCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_RACKINSTALLATIONSIDE";
    return createCombo('机架正反属性', name, url,allowBlank);
}
 /**
  * 逻辑端口类型
  * @return
  */
 function createLogircalPortTypeCombo(name,allowBlank){
     var url = "inventoryCombo!createDicComboByCode.html?dicCode=LOGICALPORT_LOGIRCALPORTTYPE";
     return createCombo('逻辑端口类型', name, url,allowBlank);
 }
/**
 * 端口连接状态
 * @param name
 * @param allowBlank
 * @return
 */
function createConnectStatusCombo(name, allowBlank) {
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=PORT_PORTCONNECTSTATUS";
    return createCombo('端口连接状态', name, url, allowBlank);
}
/**
 * 端口物理状态
 * @param name
 * @param allowBlank
 * @return
 */
function createPortPhysicalStatusCombo(name, allowBlank) {
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=PORT_PHYSICALSTATUS";
    return createCombo('端口物理状态', name, url, allowBlank);
}
 /**
  * 物理状态
  * @param name
  * @param allowBlank
  * @return
  */
 function createShelfPhysicalStatusCombo(name, allowBlank) {
     var url = "inventoryCombo!createDicComboByCode.html?dicCode=SHELF_PHYSICALSTATUS";
     return createCombo('物理状态', name, url, allowBlank);
 }
/**
 * 列号
 * @param name
 * @return
 */
function createDeviceColumnIndexCombo(name,allowBlank) {
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_COLUMNINDEX";
    return createCombo('列号', name, url,allowBlank);
} 

/**
* 行号
* @param name
* @return
*/
function createDeviceRowIndexCombo(name,allowBlank) {
   var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_ROWINDEX";
   return createCombo('行号', name, url,allowBlank);
}

/**
 * 机架类型
 * @param name
 * @return
 */
function createRackTypeCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=RACK_RACKTYPE";
    return createCombo('机架类型', name, url,allowBlank);
}
/**
 * 电源类型
 * @param name
 * @return
 */
function createPowerCategoryCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_POWERCATEGORY";
    return createCombo('电源类型', name, url,allowBlank);
}
/**
 * 设备安装方式
 * @param name
 * @param allowBlank
 * @return
 */
function createInstallModeCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_INSTALLATIONMETHOD";
    return createCombo('安装方式', name, url,allowBlank);
}
 /**
  * 生命周期状态
  * @param name
  * @param allowBlank
  * @return
  */
function createLifecycleStatusCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_LIFECYCLESTATUS";
    return createCombo('生命周期状态', name, url,allowBlank);
}
/**
 * 工程状态
 * @param name
 * @param allowBlank
 * @return
 */
function createProjectStatusCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_PROJECTSTATUS";
    return createCombo('工程状态', name, url,allowBlank);
}
/**
 * 所属机架正反面
 * @param name
 * @param allowBlank
 * @return
 */
function createShelfOrientationCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=SLOT_POSITIONSITE";
    return createCombo('所属机架正反面', name, url,allowBlank);
}

/**
 * 端口业务状态
 * @param name
 * @param allowBlank
 * @return
 */
function createPortServiceStatusCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=PORT_SERVINGSTATUS";
    return createCombo('业务状态', name, url,allowBlank);
}
/**
 * 资产产权性质
 * @param name
 * @param allowBlank
 * @return
 */
function createAssetPropertyCategoryCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_PROPERTYCATEGORY";
    return createCombo('产权性质', name, url,allowBlank);
}
/**
 * 资产用途
 * @param name
 * @param allowBlank
 * @return
 */
function createAssetUseCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=ASSET_ASSETUSE";
    return createCombo('资产用途', name, url,allowBlank);
}

/**
 * 资产状态
 * @param name
 * @param allowBlank
 * @return
 */
function createAssetStatusCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=ASSET_ASSETSTATUS";
    return createCombo('资产状态', name, url,allowBlank);
}

/**
 * 所有权人
 * @param name
 * @param allowBlank
 * @return
 */
function createDeviceOwnerCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_OWNER";
    return createCombo('产权单位', name, url,allowBlank);
}
/**
* 使用单位
* @param name
* @param allowBlank
* @return
*/
function createUseUnitCombo(name,allowBlank){
   var url = "inventoryCombo!createDicComboByCode.html?dicCode=DEVICE_USEUNIT";
   return createMultiCombo('使用单位', name, url,allowBlank);//
} 
/**
 * IP地址类型
 * @return
 */
function createIPAddressTypeCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=IPADDRESS_IPADDRESSTYPE";
    return createCombo('IP地址类型', name, url,allowBlank);
}
/**
 * 机框用途
 * @param name
 * @param allowBlank
 * @return
 */
function createShelfPurposeCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=SHELF_SHELFPURPOSE";
    return createCombo('机框用途', name, url,allowBlank);
}
/**
 * 资源配置操作类型
 * @returns
 */
function createRCOperateTypeCombo(name,allowBlank){
	var url = "inventoryCombo!createDicComboByCode.html?dicCode=RESOURCECONFIG_OPERATETYPE";
    return createCombo('操作类型', name, url,allowBlank);
}
/**
 * 中继类型
 * @param name
 * @param allowBlank
 * @returns
 */
function createRelayCategoryCombo(name,allowBlank){
    var url = "inventoryCombo!createDicComboByCode.html?dicCode=RELAY_RELAYCATEGORY";
    return createCombo('中继类型', name, url,allowBlank);
}
/**************************枚举型下拉列表*******************************/

/**
* 厂商名称
* @param name
* @return
*/                 
function createVendorCombo(name,allowBlank) {
   var url = "inventoryCombo!createEnumComboByCode.html?enumCode=EquipmentVendor";
   return createCombo('厂商名称', name, url,allowBlank);
}

/**
 * 带宽
 * @param name
 * @return
 */                 
function createBandwidthCombo(name,allowBlank) {
    var url = "inventoryCombo!createEnumComboByCode.html?enumCode=Bandwidth";
    return createCombo('带宽', name, url,allowBlank);
}
 
/**
* 规格型号
* @param name
* @return
*/                 
function createEquipmentModelCombo(name,allowBlank) {
   var url = "inventoryCombo!createEnumComboByCode.html?enumCode=EquipmentModel";
   return createCombo('规格型号', name, url,allowBlank);
}


 
 /**
 * 网络层次
 * @param name
 * @return
 */                 
 function createNetworkLayerCombo(name,allowBlank) {
    var url = "inventoryCombo!createEnumComboByCode.html?enumCode=NetworkLayer";
    return createCombo('网络层次', name, url,allowBlank);
 }
 
/***********************************自定义下拉列表*******************************************/
/**
 * 实体类型
 * @param name
 * @return
 */
function getMetaEntityTypeCombo(name,allowBlank) {
    var url ="inventoryCombo!createMetaEntityTypeCombo.html";
    return createCombo('实体类型',name,url,allowBlank);
}
/**
 * 实体列表
 * @param name
 * @return
 */
function getEntityTypeByMetaTypeIdCombo(name,allowBlank) {
    var url ="inventoryCombo!createEntityTypeCombo.html";
    return createCombo('实体列表',name,url,allowBlank);
}
/**
 * 实体列表
 * @param name
 * @return
 */
function getEntityTypeCombo(name,allowBlank) {
	var url ="inventoryCombo!createEntityTypeCombo.html";
	return createCombo('实体列表',name,url,allowBlank);
}
/**
 * 模板列表
 * @param name
 * @return
 */
function getEntityTemplateByEntityTypeCombo(name,allowBlank) {
    var url ="inventoryCombo!createEntityTemplateCombo.html";
    return createNoLoadCombo('模板列表',name,url,allowBlank);
}
// Jinhi(2011-04-12)日期天数（1，2，3，4...31），暂时做成本地
function createDateCombo(label,name,id,length){
	var dateStore = new Ext.data.SimpleStore({
        fields: ['name','value'],
        data  : [
                 ['1'  ,'1'], ['2'  ,'2'], ['3'  ,'3'],['4'  ,'4'],['5'  ,'5'],
                 ['6'  ,'6'], ['7'  ,'7'], ['8'  ,'8'],['9'  ,'9'],['10'  ,'10'],
                 ['11'  ,'11'], ['12'  ,'12'], ['13'  ,'13'],['14'  ,'14'],['15'  ,'15'],
                 ['16'  ,'16'],['17'  ,'17'],['18'  ,'18'],['19'  ,'19'],['20'  ,'20'],
                 ['21'  ,'21'],['22'  ,'22'],['23'  ,'23'],['24'  ,'24'],['25'  ,'25'],
                 ['26'  ,'26'],['27'  ,'27'],['28'  ,'28'],['29'  ,'29'],['30'  ,'30'],
                 ['31'  ,'31']]
	});
	return new Ext.form.ComboBox({
        fieldLabel: label,
        hiddenName:name,
        id: id,
        store: dateStore,
        valueField: 'value',
        displayField: 'name',
        editable: true,
        typeAhead: true,
        loadingText: 'Searching...',
        hideTrigger: false,
        mode: 'local',
        boxMaxWidth: length,
        triggerAction: 'all'
    });
}
/**
 * 机框配置模板
 * @param name
 * @param allowBlank
 * @return
 */
function createShelfConfigTemplateCombo(name,allowBlank){
    var url = "inventoryCombo!createShelfConfigTemplateCombo.html?";
    return createCombo('机框配置模板', name, url,allowBlank);
}
/**
* 机框类型配置模板
* @param name
* @param allowBlank
* @return
*/
function createShelfTypeTemplateCombo(name,allowBlank){
   var url = "inventoryCombo!createShelfTypeTemplateCombo.html?";
   return createCombo('机框类型', name, url,allowBlank);
}
/**
 * 机架规格型号模板
 * @param name
 * @param allowBlank
 * @return
 */
function createDeviceTypeTemplateCombo(name,allowBlank){
   var url = "inventoryCombo!createDeviceTypeTemplateCombo.html?entityTypeId="+entityTypeId;
   return createCombo('规格型号', name, url,allowBlank);
}
/**
 * 机架配置模板
 * @param allowBlank
 * @return
 */
function createRackConfigTemplateCombo(name,allowBlank){
    var url ="inventoryCombo!createRackTemplateCombo.html";
    return createCombo('机架配置模板',name,url,allowBlank);
}
 
function createRackTypeTemplateCombo(name,allowBlank){
   var url = "inventoryCombo!createRackTypeTemplateCombo.html?entityTypeCode=Rack&metaEntityTypeCode=Device";
   return createCombo('规格型号', name, url,allowBlank);
}
/**
 * 专业
 * @param name
 * @param allowBlank
 * @return
 */
function createSpecialtyTypeCombo(name,allowBlank){
    var url = "inventoryCombo!createSpecialtyTypeCombo.html";
    return createCombo('维护专业', name, url,allowBlank);
}
/**
 * 专业，包含公共资源
 * @param name
 * @param allowBlank
 * @return
 */
function createAllSpecialtyTypeCombo(name,allowBlank){
	var url = "inventoryCombo!createAllSpecialtyTypeCombo.html";
	return createCombo('维护专业', name, url,allowBlank);
}
function createDeviceTypeCombo(name,allowBlank){
	var url = "inventoryCombo!createDeviceTypeCombo.html";
	return createCombo('设备类型', name, url,allowBlank);
}


/**
 * 
 * @param name
 * @param allowBlank
 * @return
 */
function createFunctionCategoryCombo(name,allowBlank){
    //功能类型 1:载频 2:合路器3:主控板 4:腔体
    var dateStore = new Ext.data.SimpleStore({
        fields: ['value','name'],
        data  : [['1'  ,'载频'], ['2'  ,'合路器'], ['3'  ,'主控板'],['4'  ,'腔体']]
    });
    return new Ext.form.ComboBox({
        fieldLabel:'板卡功能类型',
        name:name,
        store: dateStore,
        valueField: 'value',
        displayField: 'name',
        editable: true,
        typeAhead: true,
        loadingText: '查询中...',
        hideTrigger: false,
        mode: 'local',
        triggerAction: 'all'
    });
}
/**********************************************字典和枚举类型的renderer****************************/
function changePortCategory(val){
    var returnVal = '';
    val += '';
    if(!Ext.isEmpty(val)){
        switch (val){
            case '1' : 
                returnVal = 'PON';
                break;
            case '2' :
                returnVal = 'POS';
                break;
            case '3' :
                returnVal = 'ATM';
                break;
            case '4' :
                returnVal = 'FE';
                break;
            case '5' :
                returnVal = 'ETH';
                break;
            case '6' :
                returnVal = 'GE';
                break;
            case '7' :
                returnVal = 'POTS';
                break;
            case '8' :
                returnVal = '电口';
                break;
            case '9' :
                returnVal = '光口';
                break;
            case '10' :
                returnVal = 'E1';
                break;
            case '11' :
                returnVal = '网口';
                break;
            case '12' :
                returnVal = '内部接口';
                break;
            case '13' :
                returnVal = 'IP端口';
                break;
            default :
                returnVal = val;
                break;
        }
    }
    return returnVal;
}
function changePortPhysicalStatus(val){
    var returnVal = '';
    if(!Ext.isEmpty(val)){
        switch (val){
            case 1 : 
                returnVal = '可用';
                break;
            case 2 : 
                returnVal = '损坏';
                break;
            case 3 : 
                returnVal = '废弃';
                break;
        }
    }
    return returnVal;
}
function changeConnectStatus(val){
    var returnVal = '';
    if(!Ext.isEmpty(val)){
        switch (val){
            case 1 : 
                returnVal = '已关联';
                break;
            case 2 : 
                returnVal = '未关联';
                break;
            case 3 : 
                returnVal = '已直连';
                break;
        }
    }
    return returnVal;
}

function changePortServiceStatus(val){
    var returnVal = '';
    if(!Ext.isEmpty(val)){
        switch (val*1){
            case 1 : 
                returnVal = '空闲';
                break;
            case 2 : 
                returnVal = '占用';
                break;
            case 3 : 
                returnVal = '保留';
                break;
        }
    }
    return returnVal;
}

/**
 * 命名模块的专业列表
 * @param label
 * @param name
 * @return
 */
function getNamingSpecialtyTypeCombo(label,name){
    var combobox = createNoLoadCombo(label,name,'namingRule!findAllSpecialtyType.html',true);
    combobox.mode='remote';
    return combobox;
}
/**
 * 命名模块查询资源类型
 * @param label
 * @param name
 * @return
 */
function createNamingResourceTypeCombo(label,name){
    var fields = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'},{name: 'type',type: 'string'}]);
    var combobox = createNoLoadCombo(label,name,'namingRule!findResouseTypes.html',true,fields);
    combobox.mode='remote';
    return combobox;
}
function createNamingFieldCombo(label,name){
    var fields = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'},{name: 'type',type: 'string'}]);
    var combobox = createNoLoadCombo(label,name,'namingRule!findNamingFields.html',true,fields);
    combobox.mode='remote';
    return combobox;
}
function createDicNamingFieldCombo(label,name){
    var fields = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'},{name: 'type',type: 'string'}]);
    var combobox = createNoLoadCombo(label,name,'namingDictionary!findNamingFields.html',true,fields);
    combobox.mode='remote';
    return combobox;
}
/**
 * 查询命名相关业务系统
 * @param label
 * @param name
 * @return
 */
function createNamingNetworkLayerCombo(label,name){
    var combobox = createNoLoadCombo(label,name,'namingRule!findAllNetworkLayer.html',true);
    combobox.mode='remote';
    return combobox;
}
 
/**
 * 查询字典复制可选的专业
 * @param label
 * @param name
 * @return
 */
function createDicSpecialtyTypeForCopyCombo(label,name){
    var combobox = createNoLoadCombo(label,name,'namingDictionary!findSpecialtyTypeForCopy.html',true);
    combobox.mode='remote';
    return combobox;
}
/**
 * 查询字典复制可选的实体类型
 * @param label
 * @param name
 * @return
 */
function createRuleSpecialtyTypeForCopyCombo(label,name){
    var combobox = createNoLoadCombo(label,name,'namingRule!findSpecialtyTypeForCopy.html',true);
    combobox.mode='remote';
    return combobox;
}
/**
 * 根据站点查机房
 * @param name
 * @param allowBlank
 * @returns
 */
function createRoomBySiteIdCombo(name,siteId,allowBlank){
    var url = "inventoryCombo!createRoomBySiteIdCombo.html?entityId="+siteId;
    return createCombo('机房', name, url,allowBlank);
}

function createAddressCombo(level,name){
    var emptyText = '';
    var url ='';
    switch(level){
        case 1 : 
            url = 'inventoryGridPage!queryData.html?entityType.code=Province&metaEntityTypeCode=Region&queryType=combo';
            emptyText = '省';
            break;
        case 2 : 
            url = 'inventoryGridPage!queryData.html?entityType.code=Prefecture&metaEntityTypeCode=Region&queryType=combo';
            emptyText = '地市';
            break;
        case 3 : 
            url = 'inventoryGridPage!queryData.html?entityType.code=County&metaEntityTypeCode=Region&queryType=combo';
            emptyText = '区县';
            break;
        case 4 : 
            url = 'inventoryGridPage!queryData.html?entityType.code=Township&metaEntityTypeCode=Region&queryType=combo';
            emptyText = '乡镇街道';
            break;
        case 5 : 
            emptyText = '路行政村';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
        case 6 : 
            emptyText = '小区弄自然村';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
        case 7 : 
            emptyText = '学校片区';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
        case 8 : 
            emptyText = '幢号楼';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
        case 9 : 
            emptyText = '单元';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
        case 10 : 
            emptyText = '楼层';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
        case 11 : 
            emptyText = '户号';
            url = 'inventoryCombo!createAddressCombo.html';
            break;
    }
    var store = new Ext.data.Store( {
        autoload : false,
        proxy : new Ext.data.HttpProxy(
        {
            url : url,
            timeout : 300000,
            method : 'POST'
        }),
        reader : new Ext.data.JsonReader( {
            idProperty : 'id',
            totalProperty : 'total'
        }, Ext.data.Record.create( [ {
            name : 'name',
            type : 'string'
        }, {
            name : 'id',
            type : 'string'
        } ]))
    });
    var mode = 'remote';
    if(level==2){
        mode = 'local';
    }
    var combo = new Ext.form.ComboBox(
    {
        allowBlank : true,
        loadingText : '查询中..',
        emptyText:emptyText,
        displayField : 'name',
        tpl : '<tpl for="."><div class="x-combo-list-item" ext:qtitle="" ext:qtip="{name}">{name}</div></tpl>',
        labelStyle : 'white-space: nowrap;text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow: hidden;',
        fieldLabel : '',
        name : (name+level),
        id : (name+level),
        store : store,
        forceSelection : true,
        valueField : 'id',
        minChars : 0,
        //anchor:'100%',
        typeAhead : false,
        triggerAction : 'all',
        readOnly : false,
        editable : true,
        disabled : false,
        selectOnFocus : true,
        mode : mode,
        hideLabel : false,
        listeners:{
            select : function(combo,record,index){
                var i=level+1;
                while(i<11){
                    Ext.getCmp(name+i).clearValue();
                    Ext.getCmp(name+i).getStore().removeAll();
                    delete Ext.getCmp(name+i).lastQuery;
                    Ext.getCmp(name+i).getStore().reload();
                    i++;
                }
            },
            blur:function(){
            	if(Ext.isEmpty(combo.getValue())||combo.getValue()==''){
	            	var i=level+1;
	                while(i<11){
	                    Ext.getCmp(name+i).clearValue();
	                    Ext.getCmp(name+i).getStore().removeAll();
	                    delete Ext.getCmp(name+i).lastQuery;
	                    Ext.getCmp(name+i).getStore().reload();
	                    i++;
	                }
            	}
            },
            /**
            change : function(){
                var i=level+1;
                while(i<11){
                    Ext.getCmp(name+i).clearValue();
                    Ext.getCmp(name+i).getStore().removeAll();
                    Ext.getCmp(name+i).getStore().reload();
                    i++;
                }
            },
            **/
            focus : function(combo){
                if(level>5){
                    combo.getStore().removeAll();
                    delete combo.lastQuery;
                    combo.getStore().reload();
                }
            }
        }
    });
    store.on('beforeload',function(store,options){
        /**
        if(level==2){
            options.params['field_name_Like']=combo.getRawValue();
            options.params['field_provinceId']=Ext.getCmp((name+1)).getValue();
        }**/
        if(level==3){
            if(Ext.getCmp((name+2)).getValue()>0){
                options.params['field_name_Like']=combo.getRawValue();
                options.params['field_prefectureId']=Ext.getCmp((name+2)).getValue();
            }else{
                return false;
            }
        }else if(level==4){
            if(Ext.getCmp((name+3)).getValue()>0){
                options.params['field_name_Like']=combo.getRawValue();
                options.params['field_countyId']=Ext.getCmp((name+3)).getValue();
            }else{
                return false;
            }
        }else if(level==5){
            if(Ext.getCmp((name+4)).getValue()>0){
                options.params['name_Like']=combo.getRawValue();
                options.params['townshipId']=Ext.getCmp((name+4)).getValue();
            }else{
                return false;
            }
        }else if(level>5){
            options.params['name_Like']=combo.getRawValue();
            options.params['addressLevel']=level-4;
            var parentAddressId = 0;
            var i=level-1;
            while(i<level){
                if(i==4){
                    break;
                }else{
                    if(Ext.getCmp(name+i).getValue()>0){
                        parentAddressId = Ext.getCmp(name+i).getValue();
                        break;
                    }else{
                        i--;
                        continue;
                    } 
                }
            }
            if(parentAddressId>0){
                options.params['parentAddressId']=parentAddressId;
            }else{
                return false;
            }
        }
    });
    store.on('load',function(store,options){
        if(level==2&&!combo.getValue()>0){
            var first = store.getAt(0);
            var id = first.get('id');
            combo.setValue(id);
        }
    });
    if(level==2){
        combo.getStore().load();
    }
    //addComboboxLikeQuery(combo);
    
    return combo;
}