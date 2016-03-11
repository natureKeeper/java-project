<html>
<head>
<#include "/resource/extjs/include.ftl" />

</head>

<script>
//ctx是个object，主要用于记录页面之间传递的参数
//ctx初始化以后，可以在js代码中使用ctx.userName类似的方式取值
var ctx = {
	userName:'${(userName)?if_exists?js_string}',
	user:{
		id:'${(user.id)?if_exists?js_string}',
		dept:'${(user.dept)?if_exists?js_string}',
		group:'${(user.group)?if_exists?js_string}'
	}
};
</script>


<!-- body增加onload和onunload事件 -->
<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">
<!-- 以下table部分不是必须的，可以不加  -->
<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr>
<td class="x_banner_bar" ondblclick="">
 &nbsp; <font class="x_banner_font">新增 "${metaEntityType.name}" EntityType</font>
</td>
</tr>

<tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr>
</table>

<script>
//仅与对象相关方法，写到内部。需要公用的取出单独写在下面，或者其他文件中
//整个项目公用的方法写在resource\extjs\common\theme\default\script\public.js中
var ObjectNameXXX = function(){
    var grid,qryCondionPanel,str;
    var isInited = false;
    return {
    	//首先是初始化方法
        init:function(){
            this.createQryCondionPanel();
            this.createGird();
            str = '1233';
            isInited = true;
        },
        createQryCondionPanel :function(){
            
        },
        createGird :function(){
            
        },
        getPageSize :function(){//如果有gridPanel的话可以增加这个方法
            return 20;
        },
        isInited :function(){//初始化完成后该字段返回true，否则返回false
            return isInited;
        },
        getName :function(){
            return 'XXXX';
        },
        showStr :function(){//测试方法
            alert(str);
        }
    }
}();
//测试使用
//先判断对象是否初始化，若没有则先初始化
//初始化完了，就可以调用方法了。showStr为一个测试方法，实际使用时不需要增加
if(!ObjectNameXXX.isInited()){
    ObjectNameXXX.init();
}
ObjectNameXXX.showStr();

</script>


</body>
<script>
//默认只修改状态栏显示信息，也可以做一些其他的事情
function onLoad() {
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>
