<html>
<head>
<#include "/resource/extjs/include.ftl" />

</head>

<script>
//ctx是个object，主要用于记录页面之间传递的参数
var ctx = {
	userName:'${(userName)?if_exists?js_string}',
	user:{
		id:'${(user.id)?if_exists?js_string}',
		dept:'${(user.dept)?if_exists?js_string}',
		group:'${(user.group)?if_exists?js_string}'
	}
};
</script>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">

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
var ObjectNameXXX = function(){
    var grid,qryCondionPanel,str;
    var isInited = false;
    return {
        init:function(){
            this.createQryCondionPanel();
            this.createGird();

            isInited = true;
        },
        createQryCondionPanel :function(){
            
        },
        createGird :function(){
            
        },
        getPageSize :function(){
            return 20;
        },
        isInited :function(){
            return isInited;
        },
        getName :function(){
            return 'XXXX';
        },
        showStr :function(){
            alert(str);
        }
    }
}();
//测试使用
if(!ObjectNameXXX.isInited()){
    ObjectNameXXX.init();
}
ObjectNameXXX.showStr();

</script>


</body>
<script>
function onLoad() {
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>
