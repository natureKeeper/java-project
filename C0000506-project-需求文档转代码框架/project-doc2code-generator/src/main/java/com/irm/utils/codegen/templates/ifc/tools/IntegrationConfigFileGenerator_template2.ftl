
	<#assign remoteSystemUpperName = remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
	<#if "Y"==irmsProvideService><!-- ${serviceDescription} BEGIN -->
	<bean id="integrationIrms${serviceInterfaceUpperClassName}" class="com.irm.integration.service.${remoteSystemName}.service.usersession.IntegrationIrms${serviceInterfaceUpperClassName}Impl"
		parent="abstractIntegrationUserSessionProxyService">
		<property name="targetService" ref="irms${serviceInterfaceClassName}" />
		<property name="defaultUsername" value="<#noparse>${integration.security.default.username}</#noparse>" />
		<property name="defaultPassword" value="<#noparse>${integration.security.default.password}</#noparse>" />
	</bean>
	<!-- ${serviceDescription} END -->
	<#else>
	<!-- ${serviceDescription} BEGIN -->
	<bean id="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}" class="com.irm.integration.service.${remoteSystemName}.service.impl.Integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}Impl"
		parent="abstractIntegrationExternalService">
	</bean>
	<bean id="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}Mocker" class="com.irm.integration.service.${remoteSystemName}.service.usersession.Integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}Mocker"
		parent="abstractIntegrationUserSessionProxyService">
	</bean>
	<!-- ${serviceDescription} END -->
	</#if>