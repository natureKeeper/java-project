package com.irm.utils.codegen.templates.ifc.tools;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.templates.GeneralGenerator;
import com.irm.utils.codegen.utils.Comment;
import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;
import com.irm.utils.codegen.utils.PropertiesLoader;
import common.util.Detect;

@Comment(
		"*****************************************"
		+ "\r\n任务：MessageClassGenerator"
		+ "\r\n用途：生成Request和Response参数类"
		+ "\r\n*****************************************")
public class IntegrationTemplateFileGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(IntegrationTemplateFileGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		
		generateClassCode(infoContainer, msgContainer);
		
//		Map<String, String> infos = infoContainer.getInformations();
//		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
//		String serviceInterfaceMethodName = infos.get(Const.SERVICE_INTERFACE_METHODNAME);
//		serviceInterfaceMethodName = serviceInterfaceMethodName.substring(0,1).toUpperCase() + serviceInterfaceMethodName.substring(1);
//		Map<String, Object> map = new HashMap<String, Object>();
//		map.put("remoteSystemName", remoteSystemName);
//		map.put("serviceInterfaceMethodName", serviceInterfaceMethodName);
//		
//		String serverProjectSrcPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);
//		String serverPackagePath = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
//		serverPackagePath = serverPackagePath + "." + remoteSystemName + ".message";
//		String requestClassName = serverPackagePath + "." + serviceInterfaceMethodName + "Request";
//		String responseClassName = serverPackagePath + "." + serviceInterfaceMethodName + "Response";
//		
//		String requestClassFullPath = serverProjectSrcPath + requestClassName.replace(".", File.separator) + ".java";
//		createOrUpdateFile(requestClassFullPath, "template1", "template2", "}", map, msgContainer);
//		
//		String responseClassFullPath = serverProjectSrcPath + responseClassName.replace(".", File.separator) + ".java";
//		createOrUpdateFile(responseClassFullPath, "template3", "template4", "}", map, msgContainer);
	}
	
	
	
	
	
	
	public void generateClassCode(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		
//		String methodCnNameInT3 = infos.get(Const.INTERFACE_METHOD_CN_NAME_IN_T3DOC);//ifcDefinition.getInterfaceMethodCnNameInT3();
//		methodCnNameInT3 = methodCnNameInT3.replaceAll("[\\\\/:\\*\\?\"<>|]", "-");
		
		List<MessageClassDefinition> clazzDefs = infoContainer.getMessageClassDefinitions();
		
		for (MessageClassDefinition clazzDef : clazzDefs) {
			String t3DocName = infos.get(Const.T3_DOC_NAME);//ifcDefinition.getT3DocName();
			String messageName = clazzDef.getMessageClassName();
			String fieldGroupDescription = clazzDef.getMessageClassDescription();
//			messageName = messageName.substring(messageName.lastIndexOf(".") + 1);

			List<FieldInfo> fieldDefs = clazzDef.getFieldInfos();
			
			String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);

			String serverProjectSrcPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);
			String serverPackagePath = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
			serverPackagePath = serverPackagePath + "." + remoteSystemName + ".message";
			

			

			String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
			String methodDescription = infos.get(Const.METHOD_DESCRIPTION);
			String province = infos.get(Const.INTERFACE_FUNCTION_DEPLOY_PROVINCE);
			String functionNameInT3Doc = infos.get(Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC);
			String businessType = infos.get(Const.INTEGRATION_FUNCTION_BUSINESS_TYPE);
			
			String serviceInterfaceMethodName = infos.get(Const.JAVA_SERVICE_METHODNAME);
//			String methodName = infos.get(Const.JAVA_SERVICE_METHODNAME);
			//frontend端配置
			String frontendProjectResourcePath = PropertiesLoader.get(PropertyName.FRONTEND_PROJECT_RESOURCES_PATH);
			String frontendIntegrationConfigPath = PropertiesLoader.get(PropertyName.FRONTEND_INTEGRATION_CONFIG_PATH);
			String frontendIntegrationConfigFullPath = frontendProjectResourcePath + frontendIntegrationConfigPath + "templates/" 
										+ remoteSystemName + "/" + businessType + "/" + province + "/" + functionNameInT3Doc.toLowerCase();
			
			File dir = new File(frontendIntegrationConfigFullPath);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			
			
			String msgClazzReviseName = null;
			
			String msgClazzName = clazzDef.getMessageClassName();
			msgClazzName = msgClazzName.substring(0, 1).toUpperCase() + msgClazzName.substring(1);
			
			if (clazzDef.isRequestMessage()) {
				if (Detect.notEmpty(clazzDef.getFatherMessageName())) {
					msgClazzReviseName = serviceInterfaceMethodName + "Request" + msgClazzName;
				} else {
					msgClazzReviseName = serviceInterfaceMethodName + "Request";
				}				
			} else {
				if (Detect.notEmpty(clazzDef.getFatherMessageName())) {
					msgClazzReviseName = serviceInterfaceMethodName + "Response" + msgClazzName;
				} else {
					msgClazzReviseName = serviceInterfaceMethodName + "Response";
				}
				
			}
			
			String prefix = frontendIntegrationConfigFullPath + "/" + functionNameInT3Doc;
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("serviceDescription", serviceDescription);
			map.put("methodDescription", methodDescription);
			map.put("functionNameInT3Doc", functionNameInT3Doc);

			map.put("fieldDefs", fieldDefs);
			
			map.put("classDef", clazzDef);
			
			map.put("msgClazzReviseName", msgClazzReviseName);


			
			String suffix = "";
			if (Detect.notEmpty(clazzDef.getFatherMessageName())) {
				messageName = messageName.substring(0, 1).toUpperCase() + messageName.substring(1);
				suffix = messageName;
			}
			
			if (clazzDef.isRequestMessage()) {				
				this.createFile(prefix + "RequestObjectArgumentsRepresentation" + suffix + ".ftl", "RequestObjectArgumentsRepresentation", map, msgContainer);
				this.createFile(prefix + "RequestObjectXmlRepresentation" + suffix + ".ftl", "RequestObjectXmlRepresentation", map, msgContainer);
				this.createFile(prefix + "RequestXmlAnnotation" + suffix + ".xml", "RequestXmlAnnotation", map, msgContainer);
			} else {
				this.createFile(prefix + "ResponseObjectArgumentRepresentation" + suffix + ".ftl", "ResponseObjectArgumentRepresentation", map, msgContainer);
				this.createFile(prefix + "ResponseObjectXmlRepresentation" + suffix + ".ftl", "ResponseObjectXmlRepresentation", map, msgContainer);
			}

			this.createFile(prefix + "Readme" + suffix + ".txt", "template6", map, msgContainer);
			
//			String filePreffix = rootDirPath + clazzName;
//			File file = new File(filePreffix + "Clazz.java");
//			String result = TemplateUtil.process(this.getClass(), "template1", map);
//			FileUtil.save(result, file);
//
//			file = new File(filePreffix + "RequestXmlAnnotation.xml");
//			result = TemplateUtil.process(this.getClass(), "RequestXmlAnnotation", map);
//			FileUtil.save(result, file);
//
//			file = new File(filePreffix + "RequestObjectArgumentsRepresentation.ftl");
//			result = TemplateUtil.process(this.getClass(), "RequestObjectArgumentsRepresentation", map);
//			FileUtil.save(result, file);
//
//			file = new File(filePreffix + "RequestObjectXmlRepresentation.ftl");
//			result = TemplateUtil.process(this.getClass(), "RequestObjectXmlRepresentation", map);
//			FileUtil.save(result, file);
//
//			file = new File(filePreffix + "ResponseObjectArgumentRepresentation.ftl");
//			result = TemplateUtil.process(this.getClass(), "ResponseObjectArgumentRepresentation", map);
//			FileUtil.save(result, file);
//
//			file = new File(filePreffix + "ResponseObjectXmlRepresentation.ftl");
//			result = TemplateUtil.process(this.getClass(), "ResponseObjectXmlRepresentation", map);
//			FileUtil.save(result, file);
		}
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		String serverProjectPath = PropertiesLoader.get("integration.server.project.src.path");
		System.out.println("server端工程路径: " + serverProjectPath);
		
		String packagePathInServerSide = PropertiesLoader.get("integration.server.package.path");
		System.out.println("server端代码的接口包路径: " + packagePathInServerSide);

		//对方系统名列表
		String systemNames = PropertiesLoader.get("integration.system.names");
		inputInfo("输入对方系统名:", infoContainer, Const.REMOTE_SYSTEM_CODE_LOWERCASE, systemNames.split(";"));
		
		//接口种类列表
		String functionNames = PropertiesLoader.get("integration.function.names");
		System.out.println("业务接口功能种类列表: " + functionNames);		
		inputInfo("输入业务接口功能种类:", infoContainer, Const.INTEGRATION_FUNCTION_BUSINESS_TYPE);
		
		inputInfoWithEmptyCheck("输入业务方法名(ex:sendQqMessage):", infoContainer, Const.JAVA_SERVICE_METHODNAME);
	}

}
