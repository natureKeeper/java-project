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
		+ "\r\n任务：IntegrationConfigFileGenerator"
		+ "\r\n用途：在applicationContext-integration-service.xml中生成接口层类的bean声明"
		+ "\r\n*****************************************")
public class IntegrationConfigFileGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(IntegrationConfigFileGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String serviceInterfaceClassName = infos.get(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
		String irmsProvideService = infos.get(Const.IRMS_PROVIDE_SERVICE);
		
		//frontend端配置
		String frontendProjectPath = PropertiesLoader.get(PropertyName.FRONTEND_PROJECT_PATH);
		String frontendIntegrationConfigPath = PropertiesLoader.get(PropertyName.FRONTEND_INTEGRATION_CONFIG_PATH);
		String frontendIntegrationConfigFullPath = frontendProjectPath + /*frontendIntegrationConfigPath +*/ "applicationContext-integration-service.xml";
		
		if (!serviceInterfaceClassName.endsWith("Service")) {
			serviceInterfaceClassName += "Service";
		}
		String serviceInterfaceUpperClassName = serviceInterfaceClassName.substring(0,1).toUpperCase() + serviceInterfaceClassName.substring(1);

		String serviceImplementClassName = serviceInterfaceUpperClassName + "Impl";
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("serviceInterfaceClassName", serviceInterfaceClassName);
		map.put("serviceInterfaceUpperClassName", serviceInterfaceUpperClassName);
		map.put("remoteSystemName", remoteSystemName);
		map.put("irmsProvideService", irmsProvideService);
		map.put("serviceDescription", serviceDescription);
		
		this.createFile(frontendIntegrationConfigFullPath, "template1", map, msgContainer);
//		createOrUpdateFile(frontendIntegrationConfigFullPath, "template1", "template2", "</beans>", map, msgContainer);
//		createOrUpdateFile(frontendIntegrationConfigFullPath, "template1", "template3", "</list>", map, msgContainer);
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
	}
}
