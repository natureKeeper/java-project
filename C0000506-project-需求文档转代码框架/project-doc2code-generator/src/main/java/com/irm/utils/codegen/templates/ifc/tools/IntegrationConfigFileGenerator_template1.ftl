<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="
       http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

	<#assign remoteSystemUpperName = remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
	<!-- 配置自身提供的服务 -->
	<bean id="integrationServiceDefinitionManagementService" class="com.irm.integration.core.definition.service.impl.IntegrationServiceDefinitionManagementServiceImpl" init-method="init" lazy-init="true">
		<property name="integrationServices">
			<list>
			<#if "Y"==irmsProvideService>
				<ref bean="integrationIrms${serviceInterfaceUpperClassName}" />
			<#else>
				<ref bean="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}" />
				<ref bean="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}Mocker" />
			</#if>
			</list>
		</property>
	</bean>
	
	<#if "Y"==irmsProvideService>
	<!-- ${serviceDescription} BEGIN -->
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
</beans>