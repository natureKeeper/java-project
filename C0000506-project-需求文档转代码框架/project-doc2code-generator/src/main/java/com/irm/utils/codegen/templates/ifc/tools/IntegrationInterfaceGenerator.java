package com.irm.utils.codegen.templates.ifc.tools;

import java.io.File;
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
		+ "\r\n任务：IntegrationInterfaceGenerator"
		+ "\r\n用途：生成接口类的接口"
		+ "\r\n*****************************************")
public class IntegrationInterfaceGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(IntegrationInterfaceGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String serviceInterfaceClassName = infos.get(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		String serviceInterfaceMethodName = infos.get(Const.JAVA_SERVICE_METHODNAME);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
		String methodDescription = infos.get(Const.METHOD_DESCRIPTION);
		String irmsProvideService = infos.get(Const.IRMS_PROVIDE_SERVICE);
		
		String t3DocName = infos.get(Const.T3_DOC_NAME);
		String t3DocWriter = infos.get(Const.T3_WRITER);

		//integration端配置
		String integrationProjectSrcPath = PropertiesLoader.get(PropertyName.INTEGRATION_PROJECT_SRC_PATH);
		String integrationInterfacePackagePath = PropertiesLoader.get(PropertyName.INTEGRATION_PACKAGE_PATH);
		integrationInterfacePackagePath = integrationInterfacePackagePath + "." + remoteSystemName + ".service";
		
		if ("Y".equals(irmsProvideService)) {
			serviceInterfaceClassName = "Irms" + serviceInterfaceClassName;
		} else {
			serviceInterfaceClassName = remoteSystemName + serviceInterfaceClassName;
		}
		String serviceInterfaceClassUpperName = serviceInterfaceClassName.substring(0,1).toUpperCase() + serviceInterfaceClassName.substring(1);
		String integrationInterfaceClassFullName = integrationInterfacePackagePath + ".Integration" + serviceInterfaceClassUpperName;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("serviceInterfaceClassName", serviceInterfaceClassName);
		map.put("serviceInterfaceMethodName", serviceInterfaceMethodName);
		map.put("remoteSystemName", remoteSystemName);
		map.put("serviceDescription", serviceDescription);
		map.put("irmsProvideService", irmsProvideService);
		map.put("methodDescription", methodDescription);
		
		map.put("t3DocName", t3DocName);
		map.put("t3DocWriter", t3DocWriter);
		
		String integrationInterfaceClassFullPath = integrationProjectSrcPath + integrationInterfaceClassFullName.replace(".", File.separator) + ".java";
//		createOrUpdateFile(integrationInterfaceClassFullPath, "template1", "template2", "}", map, msgContainer);
		createFile(integrationInterfaceClassFullPath, "template1", map, msgContainer);
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		inputInfo("业务接口是否是IRMS提供服务(Y/N):", infoContainer, Const.IRMS_PROVIDE_SERVICE, new String[]{"Y","N"});

		inputInfoWithEmptyCheck("输入业务接口类名称(ex:TencentQqMessageService):", infoContainer, Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		
		inputInfoWithMultiLines("输入业务接口描述,以END$结束(ex:这是代码生成器的样例,一个qq消息发送服务END$):", infoContainer, Const.SERVICE_DESCRIPTION, "END$");
	}
}
