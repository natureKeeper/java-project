<#if 'xml' == classDef.messageStyle>
${classDef.messageClassName}=<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<opDetail>
	<!--这是第一种风格的xml格式 begin-->
	<#list fieldDefs as e>
		<#if e.javaFieldDataType?starts_with('enum')>
	<${e.fieldEnName}><#noparse>${</#noparse>${e.fieldEnName}<#noparse>?if_exists}</#noparse></${e.fieldEnName}><!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"select","defaultValue":"=>空|MAN=>男人|WOMAN=>女人"} -->
		<#elseif 'date' == e.javaFieldDataType>
	<${e.fieldEnName}><#noparse>${</#noparse>${e.fieldEnName}<#noparse>?if_exists}</#noparse></${e.fieldEnName}><!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"input","defaultValue":"2015-05-01 12:34:56"} -->
		<#else>
	<${e.fieldEnName}><#noparse>${</#noparse>${e.fieldEnName}<#noparse>?if_exists}</#noparse></${e.fieldEnName}><!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"input","defaultValue":"${e.fieldCnName}"} -->
		</#if>	
	</#list>
	<!--这是第一种风格的xml格式 end-->
	
	<!--这是第二种风格的xml格式 begin-->
	<recordInfo>
	<#list fieldDefs as e>
		<#if e.javaFieldDataType?starts_with('enum')>
		<fieldInfo>
			<fieldChName>${e.fieldCnName}</fieldChName>
			<fieldEnName>${e.fieldEnName}</fieldEnName>
			<fieldContent><#noparse>${</#noparse>${e.fieldEnName}<#noparse>?if_exists}</#noparse></fieldContent><!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"select","defaultValue":"=>空|MAN=>男人|WOMAN=>女人"} -->
		</fieldInfo>
		<#elseif 'date' == e.javaFieldDataType>
		<fieldInfo>
			<fieldChName>${e.fieldCnName}</fieldChName>
			<fieldEnName>${e.fieldEnName}</fieldEnName>
			<fieldContent><#noparse>${</#noparse>${e.fieldEnName}<#noparse>?if_exists}</#noparse></fieldContent><!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"input","defaultValue":"2015-05-01 12:34:56"} -->
		</fieldInfo>
		<#else>
		<fieldInfo>
			<fieldChName>${e.fieldCnName}</fieldChName>
			<fieldEnName>${e.fieldEnName}</fieldEnName>
			<fieldContent><#noparse>${</#noparse>${e.fieldEnName}<#noparse>?if_exists}</#noparse></fieldContent><!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"input","defaultValue":"${e.fieldCnName}"} -->
		</fieldInfo>
		</#if>
	</#list>
	</recordInfo>
	<!--这是第二种风格的xml格式 end-->
</opDetail>
<#elseif 'object' == classDef.messageStyle>
<#else>
${classDef.messageClassName}=<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<opDetail>
	<!--这是入参不是xml形式的风格，但因为模拟页面渲染的需要，放在xml里 begin-->
	<#list fieldDefs as e>
		<#if e.javaFieldDataType?starts_with('enum')>
<!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"select","defaultValue":"=>空|MAN=>男人|WOMAN=>女人"} -->
		<#elseif 'date' == e.javaFieldDataType>
<!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"input","defaultValue":"2015-05-01 12:34:56"} -->
		<#else>
<!-- {"name":"${e.fieldCnName}, ${e.fieldDescription!''?chop_linebreak}","key":"${e.fieldEnName}","type":"input","defaultValue":"${e.fieldCnName}"} -->
		</#if>
	</#list>
	<!--这是入参不是xml形式的风格，但因为模拟页面渲染的需要，放在xml里 end-->
</opDetail>
</#if>
##############arguments spliter#################
