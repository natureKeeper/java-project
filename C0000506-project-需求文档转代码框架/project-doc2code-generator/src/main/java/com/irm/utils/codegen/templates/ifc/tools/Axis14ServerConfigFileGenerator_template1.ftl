	<!-- ${serviceDescription}  BEGIN-->
<#if "Y" == irmsProvideService>
	<service name="irms${webserviceBeanSuffixName}" provider="java:RPC" style="wrapped">
		<parameter name="className" value="com.irm.integration.webservice.${remoteSystemName}.service.impl.Irms${webserviceBeanSuffixName}Impl"/>
		<parameter name="allowedMethods" value="${functionNameInT3Doc}"/>
	</service>
<#else>
	<service name="${remoteSystemNameWithFirstLetterUpperCase}${webserviceBeanSuffixName}" provider="java:RPC" style="wrapped">
		<parameter name="className" value="com.irm.integration.webservice.${remoteSystemName}.service.impl.${remoteSystemNameWithFirstLetterUpperCase}${webserviceBeanSuffixName}Impl"/>
		<parameter name="allowedMethods" value="${functionNameInT3Doc}"/>
	</service>
</#if>
	<!-- ${serviceDescription} END-->
	
	在server-config.wsdd中找到这句，在前面添加服务定义
	<!-- 业务接口 end -->