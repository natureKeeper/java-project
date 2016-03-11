<table class="x_form" border="0" cellspacing="1" cellpadding="0">
<tr>
<td class="x_form_label" style="width:25%;">id 标识</td>
<td class="x_form_field">${(metaEntityType.id)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">name 名称</td>
<td class="x_form_field">${(metaEntityType.name)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">code 编码 </td>
<td class="x_form_field">${(metaEntityType.code)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">enable 激活</td>
<td class="x_form_field">${(metaEntityType.enable??)?if_exists?string("true", "false")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">className 代码类名</td>
<td class="x_form_field">${(metaEntityType.className)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">coreSequence 核心序列</td>
<td class="x_form_field">${(metaEntityType.coreSequence)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">typeTable 类型表名</td>
<td class="x_form_field">${(metaEntityType.typeTable)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">coreTable 核心表名</td>
<td class="x_form_field">${(metaEntityType.coreTable)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">spatialTable 空间表名</td>
<td class="x_form_field">${(metaEntityType.spatialTable)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">backupTable 备份表名</td>
<td class="x_form_field">${(metaEntityType.backupTable)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">metaRelationshipTypeId 是中间表</td>
<td class="x_form_field"><#if metaEntityType.metaRelationshipType ? exists>${(metaEntityType.metaRelationshipType.name)?if_exists}</#if>&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">createDate 新增时间</td>
<td class="x_form_field">${(metaEntityType.createDate)?if_exists?string("yyyy-MM-dd HH:mm:ss")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">creator 新增人</td>
<td class="x_form_field">${(metaEntityType.creator)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">updateDate 更新时间</td>
<td class="x_form_field">${(metaEntityType.updateDate)?if_exists?string("yyyy-MM-dd HH:mm:ss")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">updater 更新人</td>
<td class="x_form_field">${(metaEntityType.updater)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">memo 备注</td>
<td class="x_form_field">${(metaEntityType.memo)?if_exists}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">version 乐观锁</td>
<td class="x_form_field">${(metaEntityType.version)?if_exists?js_string}&nbsp;</td>
</tr>
</table>

<script>
$('tabTitle').innerHTML = '${(metaEntityType.code)?if_exists?js_string} ${(metaEntityType.name)?if_exists?js_string}';
</script>