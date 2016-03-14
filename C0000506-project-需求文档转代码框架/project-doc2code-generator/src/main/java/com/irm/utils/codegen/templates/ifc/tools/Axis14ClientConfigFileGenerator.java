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
		+ "\r\n任务：Axis14ClientConfigFileGenerator"
		+ "\r\n用途：在applicationContext-integration-soap-client.xml中生成webservice接口层类的bean声明"
		+ "\r\n*****************************************")
public class Axis14ClientConfigFileGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(Axis14ClientConfigFileGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String serviceInterfaceClassName = infos.get(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
		String endpointUrlKey = infos.get(Const.AXI14_ENDPOINT_URL_KEY);
		String irmsProvideService = infos.get(Const.IRMS_PROVIDE_SERVICE);
		
		//axis14端配置
		String axis14ProjectPath = PropertiesLoader.get(PropertyName.AXIS14_PROJECT_PATH);
		String axis14ClientConfigFullPath = axis14ProjectPath + "applicationContext-integration-soap-client.xml";
		String axis14ClientPropertiesFullPath = axis14ProjectPath + "applicationContext.properties";
		
		if (!serviceInterfaceClassName.endsWith("Service")) {
			serviceInterfaceClassName += "Service";
		}
		serviceInterfaceClassName = serviceInterfaceClassName.substring(0,1).toLowerCase() + serviceInterfaceClassName.substring(1);
		serviceInterfaceClassName = serviceInterfaceClassName.replace("Service", "WebService");
		String clientClassName = serviceInterfaceClassName + "Client";
		String clientClassUpperName = clientClassName.substring(0,1).toUpperCase() + clientClassName.substring(1);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("clientClassName", clientClassName);
		map.put("clientClassUpperName", clientClassUpperName);
		map.put("remoteSystemName", remoteSystemName);
		map.put("endpointUrlKey", endpointUrlKey);
		map.put("serviceDescription", serviceDescription);
		map.put("irmsProvideService", irmsProvideService);
		
		createFile(axis14ClientConfigFullPath, "template1", map, msgContainer);
		createFile(axis14ClientConfigFullPath, "template1", map, msgContainer);

	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		inputInfoWithEmptyCheck("输入axis14工程中applicationContext.properties的webservice端口服务key(ex:irms.integration.shanghai.irmsponnetwork.webservice.endpoint)", infoContainer, Const.AXI14_ENDPOINT_URL_KEY);		
	}
}
