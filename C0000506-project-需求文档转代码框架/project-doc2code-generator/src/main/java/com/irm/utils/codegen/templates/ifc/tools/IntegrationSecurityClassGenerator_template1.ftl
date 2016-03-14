package com.irm.integration.service.${remoteSystemName}.service.usersession;
<#assign interfaceName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
<#assign upperMethodName = serviceInterfaceMethodName?substring(0,1)?upper_case + serviceInterfaceMethodName?substring(1)>

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.integration.business.${remoteSystemName}.service.${interfaceName};
import com.irm.integration.core.authorization.support.AbstractIntegrationUserSessionProxyServiceImpl;
import com.irm.integration.core.definition.annotation.IntegrationServiceAnnotation;
import com.irm.integration.core.definition.constant.IntegrationProtocolTypeEnum;
import com.irm.integration.service.constant.IntegrationServiceDefinitionEnum;
import com.irm.integration.service.${remoteSystemName}.service.Integration${interfaceName};
import com.irm.system.authorization.vo.UserContext;
import com.irm.system.usersession.support.UserSessionCallback;
import com.irm.system.usersession.vo.UserCredential;

import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Request;
import com.irm.integration.business.${remoteSystemName}.message.${upperMethodName}Response;

public class Integration${interfaceName}Impl extends AbstractIntegrationUserSessionProxyServiceImpl<${interfaceName}> implements Integration${interfaceName} {
	
	private static final transient Log log = LogFactory.getLog(Integration${interfaceName}Impl.class);

	@IntegrationServiceAnnotation(clientName = "${serviceClientEnName}", 
			supplierName = "${serviceServerEnName}", 
			discription = "功能描述: ${methodDescription}"
							+ "\r\n文档: ${t3DocName}"
							+ "\r\n需求人: ${t3DocWriter}"
							+ "\r\n方向：${remoteSystemName?upper_case}->IRMS",
			externalServiceName = "${functionNameInT3Doc}", 
			key = IntegrationServiceDefinitionEnum.${serviceEnName}, 
			protocolType = IntegrationProtocolTypeEnum.${integrationProtocolType}, 			
			templatePathPrefix = "templates/${remoteSystemName}/${businessType}/${deployProvince}/${functionNameInT3Doc?lower_case}/${functionNameInT3Doc}")
	public ${upperMethodName}Response ${serviceInterfaceMethodName}(final ${upperMethodName}Request ${serviceInterfaceMethodName}Request) throws Exception {
		${upperMethodName}Response ${serviceInterfaceMethodName}Response = this.invoke(new UserSessionCallback() {

			public UserCredential getUserCredential() {
				UserCredential userCredential = new UserCredential();
				userCredential.setUsername(登录用户名，没特殊需求就用下面的defaultUsername);
				userCredential.setPassword(登录密码，没特殊需求就用下面的defaultPassword);
				return userCredential;
			}

		}, ${serviceInterfaceMethodName}Request.getXxx()/*内容存放在接口日志表tm_integrationlog的servicekey*/).${serviceInterfaceMethodName}(${serviceInterfaceMethodName}Request, UserContext.getUserContext());

		return ${serviceInterfaceMethodName}Response;
	}
	
	private String defaultUsername;
	private String defaultPassword;

	public void setDefaultUsername(String defaultUsername) {
		this.defaultUsername = defaultUsername;
	}

	public void setDefaultPassword(String defaultPassword) {
		this.defaultPassword = defaultPassword;
	}
}
