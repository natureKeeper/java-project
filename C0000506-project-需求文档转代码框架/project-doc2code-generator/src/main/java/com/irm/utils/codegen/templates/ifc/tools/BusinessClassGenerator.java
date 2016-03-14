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
		+ "\r\n任务：BusinessClassGenerator"
		+ "\r\n用途：生成业务类接口与实现"
		+ "\r\n*****************************************")
public class BusinessClassGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(BusinessClassGenerator.class);

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
		
		//server端配置
		String serverProjectSrcPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);
		String serverPackagePath = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
		serverPackagePath = serverPackagePath + "." + remoteSystemName + ".service";
		
		if (!serviceInterfaceClassName.endsWith("Service")) {
			serviceInterfaceClassName += "Service";
		}
		if ("Y".equals(irmsProvideService)) {
			serviceInterfaceClassName = "Irms" + serviceInterfaceClassName;
		} else {
			serviceInterfaceClassName = remoteSystemName + serviceInterfaceClassName;
		}
		serviceInterfaceClassName = serviceInterfaceClassName.substring(0,1).toUpperCase() + serviceInterfaceClassName.substring(1);
		String serviceInterfaceClassFullName = serverPackagePath + "." + serviceInterfaceClassName;
		
		//integration端配置
		String integrationProjectSrcPath = PropertiesLoader.get(PropertyName.INTEGRATION_PROJECT_SRC_PATH);
		String serverImplPackagePath = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
		serverImplPackagePath = serverImplPackagePath + "." + remoteSystemName + ".service.impl";
		
		String serviceImplementClassName = serviceInterfaceClassName + "Impl";

		String serviceImplementClassFullName = serverImplPackagePath + "." + serviceImplementClassName;
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("serviceInterfaceClassName", serviceInterfaceClassName);
		map.put("serviceInterfaceMethodName", serviceInterfaceMethodName);
		map.put("serviceImplementClassName", serviceImplementClassName);
		map.put("remoteSystemName", remoteSystemName);
		map.put("serviceDescription", serviceDescription);
		map.put("irmsProvideService", irmsProvideService);
		map.put("methodDescription", methodDescription);
		
		map.put("t3DocName", t3DocName);
		map.put("t3DocWriter", t3DocWriter);
		
		String serviceInterfaceClassFullPath = serverProjectSrcPath + serviceInterfaceClassFullName.replace(".", File.separator) + ".java";
//		createOrUpdateFile(serviceInterfaceClassFullPath, "template1", "template2", "}", map, msgContainer);
		createFile(serviceInterfaceClassFullPath, "template1", map, msgContainer);
		
		String serviceImplementClassFullPath = integrationProjectSrcPath + serviceImplementClassFullName.replace(".", File.separator) + ".java";
//		createOrUpdateFile(serviceImplementClassFullPath, "template3", "template4", "}", map, msgContainer);
		createFile(serviceImplementClassFullPath, "template3", map, msgContainer);
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		String serverProjectPath = PropertiesLoader.get("integration.server.project.src.path");
		System.out.println("server端工程路径: " + serverProjectPath);
		
		String packagePathInServerSide = PropertiesLoader.get("integration.server.package.path");
		System.out.println("server端代码的接口包路径: " + packagePathInServerSide);
		
		inputInfo("业务接口是否是IRMS提供服务(Y/N):", infoContainer, Const.IRMS_PROVIDE_SERVICE, new String[]{"Y","N"});

		inputInfoWithEmptyCheck("输入业务接口类名称(ex:TencentQqMessageService):", infoContainer, Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);

		inputInfoWithMultiLines("输入业务类描述,以END$结束(ex:这是一个消息服务类，提供qq，飞信，短信等消息发送的封装接口END$):", infoContainer, 
				Const.SERVICE_DESCRIPTION, "END$");

		inputInfoWithMultiLines("输入接口方法描述,以END$结束(ex:这是qq消息发送方法END$):", infoContainer, 
				Const.METHOD_DESCRIPTION, "END$");
	}
}
