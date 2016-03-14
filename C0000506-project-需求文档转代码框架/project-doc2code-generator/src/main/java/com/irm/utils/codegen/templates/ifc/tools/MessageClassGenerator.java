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
public class MessageClassGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(MessageClassGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();

		String t3DocName = infos.get(Const.T3_DOC_NAME);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String serviceInterfaceMethodName = infos.get(Const.JAVA_SERVICE_METHODNAME);
		
		String serverProjectSrcPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);
		String serverPackagePath = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
		serverPackagePath = serverPackagePath + "." + remoteSystemName + ".message";
		
		List<MessageClassDefinition> msgClazzDefs = infoContainer.getMessageClassDefinitions();
		
		for (MessageClassDefinition msgClazzDef : msgClazzDefs) {
			String msgClazzName = msgClazzDef.getMessageClassName();
			String msgClazzDescription = msgClazzDef.getMessageClassDescription();
			
			//计算message类的命名，应该是${ServiceInterfaceMethodName}Request${MsgClazzName}的形式
			serviceInterfaceMethodName = serviceInterfaceMethodName.substring(0, 1).toUpperCase() + serviceInterfaceMethodName.substring(1);
			msgClazzName = msgClazzName.substring(0, 1).toUpperCase() + msgClazzName.substring(1);
			String msgClazzReviseName = null;
			if (msgClazzDef.isRequestMessage()) {
				if (Detect.notEmpty(msgClazzDef.getFatherMessageName())) {
					msgClazzReviseName = serviceInterfaceMethodName + "Request" + msgClazzName;
				} else {
					msgClazzReviseName = serviceInterfaceMethodName + "Request";
				}				
			} else {
				if (Detect.notEmpty(msgClazzDef.getFatherMessageName())) {
					msgClazzReviseName = serviceInterfaceMethodName + "Response" + msgClazzName;
				} else {
					msgClazzReviseName = serviceInterfaceMethodName + "Response";
				}
				
			}
			
			String clazzFullPackagePath = serverPackagePath + "." + msgClazzReviseName;
			
			List<FieldInfo> fieldInfos = msgClazzDef.getFieldInfos();
			
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("t3DocName", t3DocName);
			map.put("fieldGroupDescription", msgClazzDescription);
			map.put("fieldDefs", fieldInfos);			
			map.put("remoteSystemName", remoteSystemName);
			map.put("serviceInterfaceMethodName", serviceInterfaceMethodName);
			map.put("msgClazzReviseName", msgClazzReviseName);
			map.put("msgClazzDef", msgClazzDef);
			
			String classFullPath = serverProjectSrcPath + clazzFullPackagePath.replace(".", File.separator) + ".java";
			
			if (msgClazzDef.isRequestMessage()) {
//				createOrUpdateFile(classFullPath, "template1", "template2", "}", map, msgContainer);
				createFile(classFullPath, "template1", map, msgContainer);
			} else {
//				createOrUpdateFile(classFullPath, "template3", "template4", "}", map, msgContainer);
				createFile(classFullPath, "template3", map, msgContainer);
			}
			
			
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
