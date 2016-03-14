package com.irm.integration.webservice.${remoteSystemName}.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.integration.core.definition.annotation.IntegrationClientAnnotation;
import com.irm.integration.service.constant.IntegrationServiceDefinitionEnum;
import com.irm.integration.webservice.AbstractAxisWebServiceClient;
import common.exception.WrapperException;

/**
 * WebService客户端
 * 需求文档：${t3DocName}<br/>
 * 需求人：${t3DocWriter}<br/>
 * 服务描述：${serviceDescription}<br/>
 * @author wusuirong<br/>
 */
public class ${serviceInterfaceClassUpperName} extends AbstractAxisWebServiceClient {

	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(${serviceInterfaceClassUpperName}.class);

	/**
	 * 文档: ${t3DocName}<br/>
	 * 需求人: ${t3DocWriter}<br/>
	 * 方法描述：${methodDescription}<br/>
	 * @param externalServiceName
	 * @param map
	 * @return Map<String, Object>
	 */
	@IntegrationClientAnnotation(IntegrationServiceDefinitionEnum.${serviceEnName})
	public Map<String, Object> ${serviceInterfaceMethodName}(String externalServiceName, Map<String, Object> map) throws Exception {
		
		注意这里Object[]是对象数组，需要根据对应的服务类接口定义看是否要把参数转换为对应类型，否则调用会报错
		<#list msgClazzDefs as e>
			<#if e.requestMessage>
				<#if !e.fatherMessageName?exists>
					<#if 'xml' == e.messageStyle>
		Object[] objs = new Object[n];
					<#elseif 'object' == e.messageStyle>
		Object[] objs = new Object[n];
					<#elseif 'normal' == e.messageStyle>
		Object[] objs = new Object[${e.fieldInfos.size()}];
					</#if>
				</#if>
			</#if>
		</#list>
		
		
		
		<#list msgClazzDefs as e>
			<#if e.requestMessage>
				<#if !e.fatherMessageName?exists>
					<#if 'xml' == e.messageStyle>
		objs[i] = map.get("${e.messageClassName}");
					<#elseif 'object' == e.messageStyle>
		objs[i] = map.get("${e.messageClassName}");
					<#elseif 'normal' == e.messageStyle>
						<#list e.fieldInfos as f>
		objs[${f_index}] = map.get("${f.fieldEnName}");
						</#list>
					</#if>
				</#if>
			</#if>
		</#list>

		String response = null;
		try {
			response = this.doService(externalServiceName, objs);
		} catch (Exception e) {
			response = "调用对方接口异常: " + this.serviceEndpoint + "\r\n" + WrapperException.getStackTrace(e);
		}
		
		Map<String, Object> requestMap = new HashMap<String, Object>();
		requestMap.put("response", response);
		return requestMap;
	}
}