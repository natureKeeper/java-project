<html>
<body>
<form action="scriptCreateAction!resubmitScript.html" method="post" enctype="multipart/form-data" name="form1" id="form1">
	<textarea name="contents" cols="100" rows="20" wrap="off" readonly="true">
	<#if script?exists>
	${script.scriptContent!""}
	</#if>
	</textarea>
	<#if scriptCanModify>
	<table id="table" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td>重新上传文件<input type="hidden" name="scriptId" id="scriptId" value="${script.id}"></td>
			<td><input type="file" name="files" id="files" /></td>
		</tr>
	</table>
	<font color="red">上传后需要自己手工执行</font><p>
    <input type="submit" name="button" id="commitScript" value="提交" onclick="return validateInput();"/>
    <#else>
    <p>此脚本已经成功在所有环境执行或被废弃，不能再提交了
    </#if>
</form>
</body>

<script>
function validateInput() {
	var result = true;
	
	var files = document.getElementsByName("files");
	for(var i=0; i<files.length; i++) {
		var file = files[i];
		if (file.type == "file") {
			if ('' == file.value) {
				alert('请选择文件上传');
				return false;
			}
		}
	}	
	
	return result;
}
</script>
</html>