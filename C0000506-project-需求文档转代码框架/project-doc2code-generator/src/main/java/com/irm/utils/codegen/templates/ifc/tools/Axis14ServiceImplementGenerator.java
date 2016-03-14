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

@Comment(
		"*****************************************"
		+ "\r\n任务：Axis14ServiceImplementGenerator"
		+ "\r\n用途：生成axis14接口类的服务端实现"
		+ "\r\n*****************************************")
public class Axis14ServiceImplementGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(Axis14ServiceImplementGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String serviceInterfaceClassName = infos.get(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		String functionNameInT3Doc = infos.get(Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String integrationFunctionBusinessType = infos.get(Const.INTEGRATION_FUNCTION_BUSINESS_TYPE);
		String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
		String methodDescription = infos.get(Const.METHOD_DESCRIPTION);
		String irmsProvideService = infos.get(Const.IRMS_PROVIDE_SERVICE);
		String serviceEnName = infos.get(Const.INTERFACE_METHOD_ENUM_CONST);
		
		String t3DocName = infos.get(Const.T3_DOC_NAME);
		String t3DocWriter = infos.get(Const.T3_WRITER);
		
		List<MessageClassDefinition> msgClazzDefs = infoContainer.getMessageClassDefinitions();

		//axis14端配置
		String axis14ProjectSrcPath = PropertiesLoader.get(PropertyName.AXIS14_PROJECT_SRC_PATH);
		String axis14PackagePath = PropertiesLoader.get(PropertyName.AXIS14_PACKAGE_PATH);
		axis14PackagePath = axis14PackagePath + "." + remoteSystemName + ".service.impl";
		
		String serviceInterfaceClassUpperName = serviceInterfaceClassName.substring(0,1).toUpperCase() + serviceInterfaceClassName.substring(1);
		String interfaceUpperName = serviceInterfaceClassUpperName.replace("Service", "WebService");
		String remoteSystemUpperName = remoteSystemName.substring(0,1).toUpperCase() + remoteSystemName.substring(1);
		String axis14InterfaceClassFullName = null;
		if ("Y".equals(irmsProvideService)) {
			axis14InterfaceClassFullName = axis14PackagePath + ".Irms" + interfaceUpperName;
		} else {
			axis14InterfaceClassFullName = axis14PackagePath + "." + remoteSystemUpperName + interfaceUpperName;
		}

		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("axis14InterfaceClassFullName", axis14InterfaceClassFullName);
		map.put("remoteSystemName", remoteSystemName);
		map.put("serviceDescription", serviceDescription);
		map.put("irmsProvideService", irmsProvideService);
		map.put("methodDescription", methodDescription);
		map.put("integrationFunctionBusinessType", integrationFunctionBusinessType);
		map.put("functionNameInT3Doc", functionNameInT3Doc);
		map.put("serviceEnName", serviceEnName);
		map.put("interfaceUpperName", interfaceUpperName);
		map.put("t3DocName", t3DocName);
		map.put("t3DocWriter", t3DocWriter);
		
		map.put("msgClazzDefs", msgClazzDefs);
		
		String axis14InterfaceClassFullPath = axis14ProjectSrcPath + axis14InterfaceClassFullName.replace(".", File.separator) + "Impl.java";
		createFile(axis14InterfaceClassFullPath, "template1", map, msgContainer);
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {

	}
}
