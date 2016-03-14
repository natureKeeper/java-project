package com.irm.integration.webservice.${remoteSystemName}.service;

/**
 * WebService客户端
 * 需求文档：${t3DocName}<br/>
 * 需求人：${t3DocWriter}<br/>
 * 服务描述：${serviceDescription}<br/>
 * @author wusuirong<br/>
 */
<#if "Y" == irmsProvideService>
public interface Irms${interfaceName} {
<#else>
<#assign sysName=remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
public interface ${sysName}${interfaceName} {
</#if>
	
	/**
	 * 文档: ${t3DocName}
	 * 需求人: ${t3DocWriter}
	 * ${methodDescription}
<#list msgClazzDefs as e>
	<#if e.requestMessage><#--表示这是请求消息-->
		<#if !e.fatherMessageName?exists><#--表示这是请求消息的根-->
			<#if 'xml' == e.messageStyle>
String ${e.messageClassName},
			<#elseif 'object' == e.messageStyle>
String ${e.messageClassName},
			<#elseif 'normal' == e.messageStyle>
				<#list e.fieldInfos as f>
	 * @param ${f.fieldEnName} ${f.fieldCnName} ${f.fieldDescription}
				</#list>

			</#if>
		</#if>
	</#if>
</#list>
	 */
	public String ${functionNameInT3Doc}(<#list msgClazzDefs as e>
											<#if e.requestMessage><#--表示这是请求消息-->
												<#if !e.fatherMessageName?exists><#--表示这是请求消息的根-->
													<#if 'xml' == e.messageStyle>
										String ${e.messageClassName},
													<#elseif 'object' == e.messageStyle>
										String ${e.messageClassName},
													<#elseif 'normal' == e.messageStyle>
														<#list e.fieldInfos as f>
										${f.fieldDataType} ${f.fieldEnName},
														</#list>
										
													</#if>
												</#if>
											</#if>
										</#list>
										);

}