这里bean定义会重复，请注意只拷贝一个即可
				<#assign remoteSystemUpperName = remoteSystemName?substring(0,1)?upper_case + remoteSystemName?substring(1)>
				<#if "Y"==irmsProvideService>
				<ref bean="integrationIrms${serviceInterfaceUpperClassName}" />
			<#else>
				<ref bean="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}" />
				<ref bean="integration${remoteSystemUpperName}${serviceInterfaceUpperClassName}Mocker" />
			</#if>