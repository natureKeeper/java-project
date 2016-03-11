/**
 * 1.Ext.form.Field
 * 增加html的title属性
 * 增加setValue()方法触发change事件
 */
Ext.form.Field.prototype.title = '';
Ext.form.Field.prototype.initTitle = function(){
    if(this.title !== undefined){
        this.el.dom.title = this.title;
    }
}
Ext.form.Field.prototype.afterRender = function(){
    Ext.form.Field.superclass.afterRender.call(this);
    this.initEvents();
    this.initValue();
    this.initTitle();
}
Ext.form.Field.prototype.setValue = function(v){
    this.fireEvent('change', this, v,this.value);
    
    this.value = v;
    if(this.rendered){
        this.el.dom.value = (Ext.isEmpty(v) ? '' : v);
        this.validate();
    }
    return this;
}
/**
 * 2.Ext.grid.PropertyColumnModel
 * 解决name,value 2列的宽度设置
 * nameSortable name列是否排序
 */
Ext.grid.PropertyColumnModel.prototype.nameWidth=50;
Ext.grid.PropertyColumnModel.prototype.valueWidth=50;
Ext.grid.PropertyColumnModel.prototype.nameSortable=true;
Ext.grid.PropertyColumnModel.prototype.constructor = function(grid, store){
    var g = Ext.grid,
    f = Ext.form;
    
    this.grid = grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:this.nameWidth, sortable: this.nameSortable, dataIndex:'name', id: 'name', menuDisabled:true},
        {header: this.valueText, width:this.valueWidth, resizable:false, dataIndex: 'value', id: 'value', menuDisabled:true}
    ]);
    this.store = store;
    
    var bfield = new f.Field({
        autoCreate: {tag: 'select', children: [
            {tag: 'option', value: 'true', html: this.trueText},
            {tag: 'option', value: 'false', html: this.falseText}
        ]},
        getValue : function(){
            return this.el.dom.value == 'true';
        }
    });
    this.editors = {
        'date' : new g.GridEditor(new f.DateField({selectOnFocus:true})),
        'string' : new g.GridEditor(new f.TextField({selectOnFocus:true})),
        'number' : new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;'})),
        'boolean' : new g.GridEditor(bfield, {
            autoSize: 'both'
        })
    };
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
}
/**
 * 3.Ext.grid.PropertyGrid
 * 注释掉store.store.sort('name', 'ASC');
 * 解决默认不排序
 */
Ext.grid.PropertyGrid.prototype.initComponent = function(){
    this.customRenderers = this.customRenderers || {};
    this.customEditors = this.customEditors || {};
    this.lastEditRow = null;
    var store = new Ext.grid.PropertyStore(this);
    this.propStore = store;
    var cm = new Ext.grid.PropertyColumnModel(this, store);
    //store.store.sort('name', 'ASC');
    this.addEvents(
        
        'beforepropertychange',
        
        'propertychange'
    );
    this.cm = cm;
    this.ds = store.store;
    Ext.grid.PropertyGrid.superclass.initComponent.call(this);

    this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
        if(colIndex === 0){
            this.startEditing.defer(200, this, [rowIndex, 1]);
            return false;
        }
    }, this);
}
/**
 * 4.
 * 超时更改30000-->300000
 * timeout:300000
 */
Ext.data.Connection.prototype.timeout = 300000;
Ext.data.ScriptTagProxy.prototype.timeout = 300000;

/**
 * 5.Ext.tree.DefaultSelectionModel select方法
 * 增加：node.ui!=null&&!Ext.isEmpty(node.ui.wrap)
 */
Ext.tree.DefaultSelectionModel.prototype.select = function(node,  selectNextNode){
    if (node.ui!=null&&!Ext.isEmpty(node.ui.wrap)&&!Ext.fly(node.ui.wrap).isVisible() && selectNextNode) {
        return selectNextNode.call(this, node);
    }
    var last = this.selNode;
    if(node.ui!=null&&!Ext.isEmpty(node.ui.wrap)){
        if(node == last){
            node.ui.onSelectedChange(true);
        }else if(this.fireEvent('beforeselect', this, node, last) !== false){
            if(last && last.ui){
                last.ui.onSelectedChange(false);
            }
            this.selNode = node;
            node.ui.onSelectedChange(true);
            this.fireEvent('selectionchange', this, node, last);
        }
    }
    return node;
}