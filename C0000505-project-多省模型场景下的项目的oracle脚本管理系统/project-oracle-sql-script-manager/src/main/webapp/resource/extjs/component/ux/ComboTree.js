Ext.ns('Ext.ux.form');

/**
 * 
 * 用于判断选中节点是否允许被选择(默认所有值都可以被选中)
 * @param comboTree
 * @param node
 * @return
 */
function comboxTreeEmptyCallBack(comboTree,node){
	return true;
}

/**
 * 用于回调选中值(默认只会返回text,id)(测试无效getValue,一直为空,form getFixValue再取想要的参数,以后需要改进开放getValue, getFieldValue方法)
 */
function setComboxTreeFixValue(comboTree,node){
	comboTree.setValue(node.text,node.id);
}

Ext.ux.form.ComboTree = Ext.extend(Ext.form.ComboBox, {
    nodeSelectedAble : comboxTreeEmptyCallBack,
    store : new Ext.data.SimpleStore({
                fields : [{name: 'label', type: 'string'},{name: 'value', type: 'string'}],
                data : [[]]
            }),
    editable : this.editable||false,
    mode : 'local',
    fieldLabel:this.fieldLabel||"",
    emptyText : this.emptyText||"请选择",
    allowBlank : this.allowBlank||true,
    blankText : this.blankText||"必须输入!",
    triggerAction : 'all',
    maxHeight : 200,
    treeDivId : Ext.id(),
    tpl : null,
    selectedClass : '',
    onSelect : Ext.emptyFn,
    treePanel:this.treePanel,
    treeUrl:this.treeUrl,
    tree : null,
    fieldValue:null,
    selectNode:null,
    getValue:function(){
		return this.fieldValue;
	},
	getFieldValue:function(){
		return this.fieldValue;
	},
	getFixValue:function(){
		return this.selectNode;
	},
	returnFixValue : setComboxTreeFixValue,
	onViewClick : function(doFocus){
		
	},
	setValue : function(value,fieldValue){
		Ext.ux.form.ComboTree.superclass.setValue.call(this,value);
		this.fieldValue = fieldValue;
	},
    initComponent : function() {
		if(!this.tpl){
			this.tpl = "<tpl for='.'><div style='height:200px'><div id='"+this.treeDivId+"'></div></div></tpl>";
		}
		if(Ext.isEmpty(this.treePanel)){
			this.tree = new Ext.tree.TreePanel({
	            height : 200,
	            scope : this,
	            autoScroll : true,
	            split : true,
	            root : new Ext.tree.AsyncTreeNode({
	                        expanded : true,
	                        id:'-1',
	                        text : this.rootText
	                    }),

	            loader : new Ext.tree.TreeLoader({
	                        url : this.treeUrl
	                    }),
	            rootVisible : true
	            });
		}else{
			this.tree = this.treePanel;
		}
		
		 var c = this;
        /**
         * 点击选中节点并回调传值
         */
        this.tree.on('click', function(node) {
                    if (node.id != null && node.id != '') {
                        var isTrue = c.nodeSelectedAble.call(this,c,node);
                        if(isTrue){
                        	c.returnFixValue.call(this,c,node);
                        	c.selectNode = node;
                        	c.collapse();
                        }
                    }
                })
        var tdi = c.treeDivId;
        this.on('expand', function() {
          this.tree.render(tdi);
//          this.tree.expandAll();
                });
        Ext.ux.form.ComboTree.superclass.initComponent.call(this);
    }

});

//register xtype
Ext.reg('combotree', Ext.ux.form.ComboTree); 