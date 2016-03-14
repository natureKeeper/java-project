<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="
       http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
	<#assign serviceUpperName = serviceInterfaceClassName?substring(0,1)?upper_case + serviceInterfaceClassName?substring(1)>
	<#assign remoteSystemUpperName = remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
	<!-- ${serviceDescription} BEGIN -->
	<#if "N"==irmsProvideService>
	<bean id="${remoteSystemName}${serviceUpperName}" class="com.irm.integration.business.${remoteSystemName}.service.impl.${remoteSystemUpperName}${serviceUpperName}Impl" >
		<property name="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}" ref="integration${remoteSystemUpperName}${serviceUpperName}" />
	</bean>
	<#else>
	<bean id="irms${serviceUpperName}" class="com.irm.integration.business.${remoteSystemName}.service.impl.Irms${serviceUpperName}Impl" >
	</bean>
	</#if>
	<!-- ${serviceDescription} END -->
</beans>