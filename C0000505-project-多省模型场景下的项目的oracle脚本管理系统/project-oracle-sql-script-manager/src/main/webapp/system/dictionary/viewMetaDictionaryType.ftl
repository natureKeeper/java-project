<table class="x_form" border="0" cellspacing="1" cellpadding="0">
<tr>
<td class="x_form_label" style="width:25%;">id 标识</td>
<td class="x_form_field">${(metaDictionaryType.id)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">name 名称</td>
<td class="x_form_field">${(metaDictionaryType.name)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">code 编码 </td>
<td class="x_form_field">${(metaDictionaryType.code)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">enable 激活 </td>
<td class="x_form_field">${(metaDictionaryType.enable)?if_exists?string("true", "false")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">creator 新增人</td>
<td class="x_form_field">${(metaDictionaryType.creator)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">createDate 新增时间</td>
<td class="x_form_field">${(metaDictionaryType.createDate)?if_exists?string("yyyy-MM-dd HH:mm:ss")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">updater 更新人</td>
<td class="x_form_field">${(metaDictionaryType.updater)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">updateDate 更新时间</td>
<td class="x_form_field">${(metaDictionaryType.updateDate)?if_exists?string("yyyy-MM-dd HH:mm:ss")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">memo 备注</td>
<td class="x_form_field">${(metaDictionaryType.memo)?if_exists}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">version 乐观锁</td>
<td class="x_form_field">${(metaDictionaryType.version)?if_exists?js_string}&nbsp;</td>
</tr>
</table>

<script>
$('tabTitle').innerHTML = '${(metaDictionaryType.code)?if_exists?js_string} ${(metaDictionaryType.name)?if_exists?js_string}';
</script>