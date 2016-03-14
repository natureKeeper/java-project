package com.irm.utils.codegen.templates.ifc.tools;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.templates.GeneralGenerator;
import com.irm.utils.codegen.utils.Comment;
import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;
import com.irm.utils.codegen.utils.PropertiesLoader;

@Comment(
		"*****************************************"
		+ "\r\n任务：Axis14ServerConfigFileGenerator"
		+ "\r\n用途：在services-config.wsdd中生成webservice服务的声明"
		+ "\r\n*****************************************")
public class Axis14ServerConfigFileGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(Axis14ServerConfigFileGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String serviceInterfaceClassName = infos.get(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
		String endpointUrlKey = infos.get(Const.AXI14_ENDPOINT_URL_KEY);
		String irmsProvideService = infos.get(Const.IRMS_PROVIDE_SERVICE);
		String functionNameInT3Doc = infos.get(Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC);
		
		//axis14端配置
		String axis14ProjectPath = PropertiesLoader.get(PropertyName.AXIS14_PROJECT_PATH);
		String axis14ServerConfigFullPath = axis14ProjectPath + "server-config.wsdd";
		String axis14ServerPropertiesFullPath = axis14ProjectPath + "applicationContext.properties";
		
		serviceInterfaceClassName = serviceInterfaceClassName.substring(0,1).toUpperCase() + serviceInterfaceClassName.substring(1);
		String webserviceBeanSuffixName = serviceInterfaceClassName.replace("Service", "WebService");
		

		String remoteSystemNameWithFirstLetterUpperCase = remoteSystemName.substring(0,1).toUpperCase() + remoteSystemName.substring(1);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("remoteSystemNameWithFirstLetterUpperCase", remoteSystemNameWithFirstLetterUpperCase);
		map.put("functionNameInT3Doc", functionNameInT3Doc);
		map.put("remoteSystemName", remoteSystemName);
		map.put("endpointUrlKey", endpointUrlKey);
		map.put("serviceDescription", serviceDescription);
		map.put("irmsProvideService", irmsProvideService);
		map.put("webserviceBeanSuffixName", webserviceBeanSuffixName);
		
		this.createFile(axis14ServerConfigFullPath, "template1", map, msgContainer);
		this.createFile(axis14ServerPropertiesFullPath, "template2", map, msgContainer);
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		inputInfoWithEmptyCheck("输入axis14工程中applicationContext.properties的webservice端口服务key(ex:irms.integration.shanghai.irmsponnetwork.webservice.endpoint)", infoContainer, Const.AXI14_ENDPOINT_URL_KEY);		
	}
}
