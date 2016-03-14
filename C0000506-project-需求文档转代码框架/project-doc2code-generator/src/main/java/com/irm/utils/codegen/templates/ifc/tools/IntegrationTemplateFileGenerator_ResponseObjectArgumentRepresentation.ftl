<#noparse><#--把java对象（用valueObject表示）转化为接口用的参数数组，可通过converter转换内外值
这里的key要和客户端的map中存取的key一致
--></#noparse>
key=response;
type=xml;
value=<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<opDetail>
<#noparse><#if valueObject?exists></#noparse>
<!--这是第一种风格的xml-->
<#list fieldDefs as e>
	<#if 'date' == e.javaFieldDataType>
	<${e.fieldEnName}><![CDATA[<#noparse><#if valueObject.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?exists>${valueObject.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?string("yyyy-MM-dd HH:mm:ss")}</#if></#noparse>]]></${e.fieldEnName}>
	<#elseif e.javaFieldDataType?starts_with('enum')>
	<${e.fieldEnName}><![CDATA[<#noparse><#if valueObject.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?exists>${valueObject.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>getText()}</#if></#noparse>]]></${e.fieldEnName}>
	<#else>
	<${e.fieldEnName}><![CDATA[<#noparse>${valueObject.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?if_exists}</#noparse>]]></${e.fieldEnName}>
	</#if>
</#list>

<!--这是第二种风格的xml-->
<#noparse>
	<#if valueObject.</#noparse>${msgClazzReviseName}s<#noparse>?exists>
	<#list valueObject.</#noparse>${msgClazzReviseName}s<#noparse> as detail>
</#noparse>
	<recordInfo>
	<#list fieldDefs as e>
		<fieldInfo>
			<fieldChName>${e.fieldCnName}</fieldChName>
			<fieldEnName>${e.fieldEnName}</fieldEnName>
			<#if 'date' == e.javaFieldDataType>
			<fieldContent><![CDATA[<#noparse><#if detail.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?exists>${detail.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?string("yyyy-MM-dd HH:mm:ss")}</#if></#noparse>]]></fieldContent>
			<#elseif e.javaFieldDataType?starts_with('enum')>
			<fieldContent><![CDATA[<#noparse><#if detail.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?exists>${detail.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>.getText()}</#if></#noparse>]]></fieldContent>
			<#else>
			<fieldContent><![CDATA[<#noparse>${detail.</#noparse>${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)}<#noparse>?if_exists?xml}</#noparse>]]></fieldContent>
			</#if>
		</fieldInfo>
	</#list>
	</recordInfo>
<#noparse>
	</#list>
	</#if>
</#noparse>
	
	<#list fieldDefs as e>
		<#if 'list' == e.javaFieldDataType>
			<#noparse><#include</#noparse> "${e.javaFieldName}模板.ftl" <#noparse>parse=true /></#noparse>
		</#if>
	</#list>
	
<#noparse></#if></#noparse>
</opDetail>