<table class="x_form" border="0" cellspacing="1" cellpadding="0">
<tr>
<td class="x_form_field" style="background-color:#EEEEEE;border-bottom:1px solid #ECECEC;padding:2px;">
	48*48<img src="${base}/context/assets/business/${(entityType.icon)?if_exists?js_string}.48.png" alt="${(entityType.icon)?if_exists?js_string}" />&nbsp;
	32*32<img src="${base}/context/assets/business/${(entityType.icon)?if_exists?js_string}.32.png" alt="${(entityType.icon)?if_exists?js_string}" />&nbsp;
	16*16<img src="${base}/context/assets/business/${(entityType.icon)?if_exists?js_string}.16.png" alt="${(entityType.icon)?if_exists?js_string}" />&nbsp;
</td>
</tr>
</table>

<table class="x_form" border="0" cellspacing="1" cellpadding="0">
<tr>
<td class="x_form_label" style="width:25%;">id 标识</td>
<td class="x_form_field">${(entityType.id)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">name 名称</td>
<td class="x_form_field">${(entityType.name)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">code 编码</td>
<td class="x_form_field">${(entityType.code)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">enable 激活</td>
<td class="x_form_field">${(entityType.enable)?if_exists?string("true", "false")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">spatial 是否空间</td>
<td class="x_form_field">${(entityType.spatial)?if_exists?string("true", "false")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">icon 图标</td>
<td class="x_form_field"><img width="16" height="16" src="${base}/context/assets/business/${(entityType.icon)?if_exists?js_string}.16.png" alt="${(entityType.icon)?if_exists?js_string}" />&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">extensionTable 卫星表名</td>
<td class="x_form_field">${(entityType.extensionTable)?if_exists?js_string}&nbsp;</td>
</tr>
<#if entityTypeAttributes ? exists><#list entityTypeAttributes as t><tr style="background-color:#00FF00;">
<td class="x_form_label"><strong>${(t.key)?default("&nbsp;")}</strong></td>
<td class="x_form_field"><strong>${(t.value)?if_exists}&nbsp;</strong></td>
</tr></#list></#if>
<tr>
<td class="x_form_label">creator 新增人</td>
<td class="x_form_field">${(entityType.creator)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">createDate 新增时间</td>
<td class="x_form_field">${(entityType.createDate)?if_exists?string("yyyy-MM-dd HH:mm:ss")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">updater 更新人</td>
<td class="x_form_field">${(entityType.updater)?if_exists?js_string}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">updateDate 更新时间</td>
<td class="x_form_field">${(entityType.updateDate)?if_exists?string("yyyy-MM-dd HH:mm:ss")}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">memo 备注</td>
<td class="x_form_field">${(entityType.memo)?if_exists}&nbsp;</td>
</tr>
<tr>
<td class="x_form_label">version 乐观锁</td>
<td class="x_form_field">${(entityType.version)?if_exists?js_string}&nbsp;</td>
</tr>
</table>

<script>
$('tabTitle').innerHTML = '<img style="margin-bottom:-4px;" width="16" height="16" src="${base}/context/assets/business/${(entityType.icon)?if_exists?js_string}.16.png" alt="${(entityType.icon)?if_exists?js_string}" /> ${(entityType.code)?if_exists?js_string} ${(entityType.name)?if_exists?js_string}';
</script>