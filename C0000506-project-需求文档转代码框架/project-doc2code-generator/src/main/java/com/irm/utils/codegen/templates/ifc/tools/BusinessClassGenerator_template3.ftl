package com.irm.integration.business.${remoteSystemName}.service.impl;
<#assign className = serviceImplementClassName?substring(0,1)?upper_case + serviceImplementClassName?substring(1)>
<#assign interfaceName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
<#assign upperMethodName = serviceInterfaceMethodName?substring(0,1)?upper_case + serviceInterfaceMethodName?substring(1)>

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.system.authorization.vo.UserContext;

import com.irm.integration.business.${remoteSystemName}.service.${interfaceName};
import com.irm.integration.service.${remoteSystemName}.service.Integration${interfaceName};

import com.irm.integration.business.${remoteSystemName}.message.${serviceInterfaceMethodName?substring(0,1)?upper_case}${serviceInterfaceMethodName?substring(1)}Request;
import com.irm.integration.business.${remoteSystemName}.message.${serviceInterfaceMethodName?substring(0,1)?upper_case}${serviceInterfaceMethodName?substring(1)}Response;

/**
 * 业务类实现
 * 需求文档：${t3DocName}<br/>
 * 需求人：${t3DocWriter}<br/>
 * 服务描述：${serviceDescription}<br/>
 * @author wusuirong
 */
public class ${className} implements ${interfaceName} {

	private static final transient Log log = LogFactory.getLog(${className}.class);

	<#if "N"==irmsProvideService>
	private Integration${interfaceName} integration${interfaceName};
	</#if>

	/**
	 * 需求文档：${t3DocName}<br/>
	 * 需求人：${t3DocWriter}<br/>
	 * 接口描述：${methodDescription}<br/>
	 * @param ${serviceInterfaceMethodName}Request
	 * @param userContext
	 * @return ${upperMethodName}Response
	 */
	public ${upperMethodName}Response ${serviceInterfaceMethodName}(${upperMethodName}Request ${serviceInterfaceMethodName}Request, UserContext userContext) throws Exception {
		//TODO 代码生成器
		<#if "N"==irmsProvideService>
		请编写实现		
		${upperMethodName}Response ${serviceInterfaceMethodName}Response = null;
		try {
			${serviceInterfaceMethodName}Response = integration${interfaceName}.${serviceInterfaceMethodName}(${serviceInterfaceMethodName}Request);
		} catch (Exception e) {
			log.error(e, e);
			${serviceInterfaceMethodName}Response = new ${upperMethodName}Response();
		}
		return ${serviceInterfaceMethodName}Response;
		<#else>
		请调用IRMS其他服务以完成对方系统的请求
		${upperMethodName}Response ${serviceInterfaceMethodName}Response = new ${upperMethodName}Response();
		do something
		return ${serviceInterfaceMethodName}Response;
		</#if>
	}
	<#if "N"==irmsProvideService>
	public void setIntegration${interfaceName}(Integration${interfaceName} integration${interfaceName}) {
		this.integration${interfaceName} = integration${interfaceName};
	}
	</#if>
}
