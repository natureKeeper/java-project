package com.irm.integration.service.${remoteSystemName}.service.usersession;
<#assign interfaceName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
<#assign upperMethodName = serviceInterfaceMethodName?substring(0,1)?upper_case + serviceInterfaceMethodName?substring(1)>

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.integration.business.${remoteSystemName}.service.${interfaceName};
import com.irm.integration.core.authorization.support.AbstractIntegrationUserSessionProxyServiceImpl;
import com.irm.integration.core.definition.annotation.IntegrationServiceAnnotation;
import com.irm.integration.core.definition.constant.IntegrationProtocolTypeEnum;
import com.irm.integration.core.context.vo.IntegrationServiceContext;
import com.irm.integration.service.constant.IntegrationServiceDefinitionEnum;
import com.irm.integration.service.${remoteSystemName}.service.Integration${interfaceName};

import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Request;
import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Response;

public class Integration${interfaceName}Mocker extends AbstractIntegrationUserSessionProxyServiceImpl<${interfaceName}> implements Integration${interfaceName} {

	private static final transient Log log = LogFactory.getLog(Integration${interfaceName}Mocker.class);

	@IntegrationServiceAnnotation(clientName = "${serviceClientEnName}", 
			supplierName = "${serviceServerEnName}", 
			discription = "功能描述: ${methodDescription}"
							+ "\r\n文档: ${t3DocName}"
							+ "\r\n需求人: ${t3DocWriter}"
							+ "\r\n方向：IRMS->${remoteSystemName?upper_case}",
			externalServiceName = "${functionNameInT3Doc}", 
			key = IntegrationServiceDefinitionEnum.${serviceEnName}, 
			protocolType = IntegrationProtocolTypeEnum.${integrationProtocolType}, 			
			templatePathPrefix = "templates/${remoteSystemName}/${businessType}/${deployProvince}/${functionNameInT3Doc?lower_case}/${functionNameInT3Doc}")
	public ${upperMethodName}Response ${serviceInterfaceMethodName}(${upperMethodName}Request ${serviceInterfaceMethodName}Request) throws Exception {
		${upperMethodName}Response ${serviceInterfaceMethodName}Response = new ${upperMethodName}Response();
		这是模拟对方系统的代码，请提供模拟返回参数
		return ${serviceInterfaceMethodName}Response;
	}
}