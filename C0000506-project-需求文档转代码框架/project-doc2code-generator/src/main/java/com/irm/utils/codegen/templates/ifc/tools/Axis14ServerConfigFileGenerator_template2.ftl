#${serviceDescription}
<#if "Y" == irmsProvideService>
${endpointUrlKey}=http://127.0.0.1:8010/irm/services/irms${webserviceBeanSuffixName}
<#else>
${endpointUrlKey}=http://127.0.0.1:8010/irm/services/${remoteSystemNameWithFirstLetterUpperCase}${webserviceBeanSuffixName}
</#if>
