package com.irm.integration.business.${remoteSystemName}.service;
<#assign interfaceName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
<#assign upperMethodName = serviceInterfaceMethodName?substring(0,1)?upper_case + serviceInterfaceMethodName?substring(1)>

import com.irm.system.authorization.service.AuthorizationService;
import com.irm.system.authorization.vo.UserContext;

import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Request;
import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Response;
/**
 * 业务类接口
 * 需求文档：${t3DocName}<br/>
 * 需求人：${t3DocWriter}<br/>
 * 服务描述：${serviceDescription}<br/>
 * @author wusuirong<br/>
 */
public interface ${interfaceName} extends AuthorizationService {

	/**
	 * 需求文档：${t3DocName}<br/>
	 * 需求人：${t3DocWriter}<br/>
	 * 接口描述：${methodDescription}<br/>
	 * @param ${serviceInterfaceMethodName}Request
	 * @param userContext
	 * @return ${upperMethodName}Response
	 */
	public ${upperMethodName}Response ${serviceInterfaceMethodName}(${upperMethodName}Request ${serviceInterfaceMethodName}Request, UserContext userContext) throws Exception;

}
