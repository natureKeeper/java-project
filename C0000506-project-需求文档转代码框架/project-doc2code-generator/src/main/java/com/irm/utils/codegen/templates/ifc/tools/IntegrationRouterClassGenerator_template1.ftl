package com.irm.integration.service.${remoteSystemName}.service.impl;
<#assign interfaceName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
<#assign upperMethodName = serviceInterfaceMethodName?substring(0,1)?upper_case + serviceInterfaceMethodName?substring(1)>

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.integration.core.service.impl.AbstractIntegrationExternalServiceImpl;
import com.irm.integration.core.context.vo.IntegrationServiceContext;
import com.irm.integration.service.constant.IntegrationServiceDefinitionEnum;
import com.irm.integration.service.${remoteSystemName}.service.Integration${interfaceName};

import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Request;
import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Response;

public class Integration${interfaceName}Impl extends AbstractIntegrationExternalServiceImpl implements Integration${interfaceName} {

	private static final transient Log log = LogFactory.getLog(Integration${interfaceName}Impl.class);

	public ${upperMethodName}Response ${serviceInterfaceMethodName}(${upperMethodName}Request ${serviceInterfaceMethodName}Request) throws Exception {
		IntegrationServiceContext integrationServiceContext = new IntegrationServiceContext();
		integrationServiceContext.setIntegrationServiceDefinitionKey(IntegrationServiceDefinitionEnum.${serviceEnName});
		integrationServiceContext.setRequestMessage(${serviceInterfaceMethodName}Request);
		integrationServiceContext.setServiceKey(${serviceInterfaceMethodName}Request.getXxx() /** 接口调用标志，记录在日志表的serviceKey */);
		super.invoke(integrationServiceContext);
		return (${upperMethodName}Response)integrationServiceContext.getResponseMessage();
	}
}
