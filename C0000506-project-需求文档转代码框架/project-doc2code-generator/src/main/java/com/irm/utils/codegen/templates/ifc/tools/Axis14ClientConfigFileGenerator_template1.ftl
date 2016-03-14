<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="
       http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<#assign remoteSystemUpperName = remoteSystemName?substring(0,1)?upper_case + remoteSystemName.substring(1)>
	<bean id="integrationClients" class="org.springframework.beans.factory.config.ListFactoryBean">
	  <property name="sourceList">
		<list>
			<#if "Y" == irmsProvideService>
			<ref bean="irms${clientClassUpperName}" />
			<#else>
			<ref bean="${remoteSystemName}${clientClassUpperName}" />
			</#if>
		</list>
	  </property>
	</bean>
	
	<!-- ${serviceDescription} BEGIN -->
	<#if "Y" == irmsProvideService>
	<bean id="irms${clientClassUpperName}" class="com.irm.integration.webservice.${remoteSystemName}.service.impl.Irms${clientClassUpperName}">
	<#else>
	<bean id="${remoteSystemName}${clientClassUpperName}" class="com.irm.integration.webservice.${remoteSystemName}.service.impl.${remoteSystemUpperName}${clientClassUpperName}">
	</#if>
		<property name="serviceEndpoint" value="<#noparse>${</#noparse>${endpointUrlKey}<#noparse>}</#noparse>" />
	</bean>
	<!-- ${serviceDescription} END -->
</beans>