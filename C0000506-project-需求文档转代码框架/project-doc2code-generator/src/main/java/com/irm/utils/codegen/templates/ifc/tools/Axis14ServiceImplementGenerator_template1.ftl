package com.irm.integration.webservice.${remoteSystemName}.service.impl;
<#assign remoteSystemUpperName = remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.integration.service.constant.IntegrationServiceDefinitionEnum;
import com.irm.integration.webservice.AbstractAxisWebServiceImpl;
<#if "Y" == irmsProvideService>
import com.irm.integration.webservice.${remoteSystemName}.service.Irms${interfaceUpperName};
<#else>
import com.irm.integration.webservice.${remoteSystemName}.service.${remoteSystemUpperName}${interfaceUpperName};
</#if>

/**
 * WebService服务端
 * 需求文档：${t3DocName}<br/>
 * 需求人：${t3DocWriter}<br/>
 * 服务描述：${serviceDescription}<br/>
 * @author wusuirong<br/>
 */
<#if "Y" == irmsProvideService>
public class Irms${interfaceUpperName}Impl extends AbstractAxisWebServiceImpl implements Irms${interfaceUpperName} {
<#else>
<#assign sysName=remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
public class ${remoteSystemUpperName}${interfaceUpperName}Impl extends AbstractAxisWebServiceImpl implements ${remoteSystemUpperName}${interfaceUpperName} {
</#if>

	@SuppressWarnings("unused")
	<#if "Y" == irmsProvideService>
	private static final transient Log log = LogFactory.getLog(Irms${interfaceUpperName}Impl.class);
	<#else>
	private static final transient Log log = LogFactory.getLog(${remoteSystemUpperName}${interfaceUpperName}Impl.class);
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
										){
		Map<String, Object> map = new HashMap<String, Object>();
		
		<#list msgClazzDefs as e>
			<#if e.requestMessage>
				<#if !e.fatherMessageName?exists>
					<#if 'xml' == e.messageStyle>
		map.put("${e.messageClassName}", ${e.messageClassName});
					<#elseif 'object' == e.messageStyle>
		map.put("${e.messageClassName}", ${e.messageClassName});
					<#elseif 'normal' == e.messageStyle>			
						<#list e.fieldInfos as f>
		map.put("${f.fieldEnName}", ${f.fieldEnName});
						</#list>
					</#if>
				</#if>
			</#if>
		</#list>

		map = integrationServiceDispatcher.doService(IntegrationServiceDefinitionEnum.${serviceEnName}, "${functionNameInT3Doc}", map);
		
		return (String)map.get("response");
	}
	
	@Override
	protected void init() {
		// TODO Auto-generated method stub
		
	}
}