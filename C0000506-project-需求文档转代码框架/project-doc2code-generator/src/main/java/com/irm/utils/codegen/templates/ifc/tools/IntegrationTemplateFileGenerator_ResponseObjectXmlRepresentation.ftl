<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<#noparse>
<#-- 把参数数组转化为java对象xml模型，如果参数里有xml字符串，则使用xmlModel访问，xmlModel是调用参数中xml部分
比如入参是
userInfos=<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<detail>...</detail>，则用userInfos_xmlModel.detail

如果发送的信息有字段的内容会包含&lt;这样的xml实体，请使用?xml让他保持原样，以免解析出错
 --></#noparse>
<xmlRoot>


<!--这是第一种风格的xml对应的映射-->
<#noparse>
<#if </#noparse>${classDef.messageClassName}_xmlModel.opDetail?exists>
	<#list fieldDefs as e>
		<#assign javaFieldLowerName = e.javaFieldName?substring(0,1)?lower_case + e.javaFieldName?substring(1)>
	<${javaFieldLowerName}><![CDATA[<#noparse>${</#noparse>${classDef.messageClassName}<#noparse>_xmlModel.opDetail.</#noparse>${e.fieldEnName}<#noparse>?if_exists</#noparse>}]]></${javaFieldLowerName}>
	</#list>
<#noparse>
</#if>
</#noparse>

<!--这是第二种风格的xml对应的映射-->
<#noparse>
<#if response_xmlModel.opDetail?exists>
<#if response_xmlModel.opDetail.recordInfo?exists>
<#list response_xmlModel.opDetail.recordInfo as recordInfo>
		<#if recordInfo.fieldInfo?exists>
		<#list recordInfo.fieldInfo as fieldInfo>
		</#noparse>
		
		<#list fieldDefs as e>
			<#assign javaFieldUpperName = e.javaFieldName?substring(0,1)?lower_case + e.javaFieldName?substring(1)>
			<#noparse><#elseif fieldInfo.fieldEnName = '</#noparse>${e.fieldEnName}<#noparse>'></#noparse>
	<${javaFieldUpperName}><#noparse><![CDATA[${</#noparse>fieldInfo.fieldContent<#noparse>!''}]]></#noparse></${javaFieldUpperName}>
		</#list>
<#noparse>
			</#if>
		</#list>
		</#if>
</#list>
</#if>
</#if>
</#noparse>


<!--这是list从对象的模板,主对象通过下面的include把从对象的模板包含进来-->
<#noparse>
<#if response_xmlModel.opDetail?exists>
<#if response_xmlModel.opDetail.recordInfo?exists>
<#list response_xmlModel.opDetail.recordInfo as recordInfo>
	<details>
		<#if recordInfo.fieldInfo?exists>
		<detail>
		<#list recordInfo.fieldInfo as fieldInfo>
		</#noparse>
		
		<#list fieldDefs as e>
			<#assign javaFieldUpperName = e.javaFieldName?substring(0,1)?lower_case + e.javaFieldName?substring(1)>
			<#noparse><#elseif fieldInfo.fieldEnName = '</#noparse>${e.fieldEnName}<#noparse>'></#noparse>
			<${javaFieldUpperName}><#noparse><![CDATA[${</#noparse>fieldInfo.fieldContent<#noparse>!''}]]></#noparse></${javaFieldUpperName}>
		</#list>
<#noparse>
			</#if>
		</#list>
		</detail>
		</#if>
	</details>
</#list>
</#if>
</#if>
</#noparse>

	<#list fieldDefs as e>
		<#if 'list' == e.javaFieldDataType>
			<#noparse><#include</#noparse> "${e.javaFieldName}模板.ftl" <#noparse>parse=true /></#noparse>
		</#if>
	</#list>
</xmlRoot>