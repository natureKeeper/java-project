package com.irm.integration.service.${remoteSystemName}.service;
<#assign interfaceName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
<#assign upperMethodName = serviceInterfaceMethodName?substring(0,1)?upper_case + serviceInterfaceMethodName?substring(1)>

import com.irm.integration.core.service.IntegrationService;

import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Request;
import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Response;
/**
 * 接口层的接口定义<br/>
 * ${serviceDescription}<br/>
 * @author wusuirong
 */
public interface Integration${interfaceName} extends IntegrationService {
	/**
	 * 文档: ${t3DocName}<br/>
	 * 需求人: ${t3DocWriter}<br/>
	 * 方法描述：${methodDescription}<br/>
	 * @param ${serviceInterfaceMethodName}Request
	 * @return ${upperMethodName}Response
	 */
	public ${upperMethodName}Response ${serviceInterfaceMethodName}(${upperMethodName}Request ${serviceInterfaceMethodName}Request) throws Exception;
}
