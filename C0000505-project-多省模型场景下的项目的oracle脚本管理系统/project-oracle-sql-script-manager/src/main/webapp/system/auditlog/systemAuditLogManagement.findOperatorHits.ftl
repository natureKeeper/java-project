<table class="x_list_container" border="0" cellspacing="0" cellpadding="0">
<tr class="x_list_head_row_fixed">
<td class="x_list_head_cell" style="width:100;" align="right"># &nbsp; </td>
<td class="x_list_head_cell" style="width:150;">Operator</td>
<td class="x_list_head_cell" style="width:100;">TOTAL</td>
<td class="x_list_head_cell" style="width:100;">TOTAL%</td>
<td class="x_list_head_cell" style="width:100;">ERROR</td>
<td class="x_list_head_cell" style="width:100;">WARN</td>
<td class="x_list_head_cell" style="width:100;">DEBUG</td>
</tr>
<#if operatorHits ??>
	<#list operatorHits as t>
	<tr style="background-color:<#if t_index%2==1>#F4F9FB<#else>#FFFFFF</#if>;">
	<td class="x_list_body_cell" align="right">${t_index+1} &nbsp; </td>
	<td class="x_list_body_cell"> &nbsp; ${t['OPERATOR_']}</td>
	<td class="x_list_body_cell" style="font-weight:bold;">${t['TOTAL_']}</td>
	<td class="x_list_body_cell">${t['TOTAL_PRECENT']}%</td>
	<td class="x_list_body_cell" style="color:red;">${t['ERROR_']}</td>
	<td class="x_list_body_cell">${t['WARN_']}</td>
	<td class="x_list_body_cell">${t['DEBUG_']}</td>
	</tr>
	</#list>
</#if>
</table>