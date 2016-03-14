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
		+ "\r\n任务：IntegrationSecurityClassGenerator"
		+ "\r\n用途：生成接口登录类实现"
		+ "\r\n当其他系统调用IRMS的接口时必须经过这层登录获取UserSession"
		+ "\r\n*****************************************")
public class IntegrationSecurityClassGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(IntegrationSecurityClassGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String serviceInterfaceClassName = infos.get(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		String serviceInterfaceMethodName = infos.get(Const.JAVA_SERVICE_METHODNAME);
		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		String serviceDescription = infos.get(Const.SERVICE_DESCRIPTION);
		String methodDescription = infos.get(Const.METHOD_DESCRIPTION);
		String irmsProvideService = infos.get(Const.IRMS_PROVIDE_SERVICE);
		String serviceEnName = infos.get(Const.INTERFACE_METHOD_ENUM_CONST);
		
		String serviceClientEnName = infos.get(Const.SERVICE_CLIENT_SYSTEM_CODE_UPPERCASE);
		String serviceServerEnName = infos.get(Const.SERVICE_SERVER_SYSTEM_CODE_UPPERCASE);
		String functionNameInT3Doc = infos.get(Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC);
		String integrationProtocolType = infos.get(Const.INTERFACE_PROTOCOL_TYPE);
		String deployProvince = infos.get(Const.INTERFACE_FUNCTION_DEPLOY_PROVINCE);
		String businessType = infos.get(Const.INTEGRATION_FUNCTION_BUSINESS_TYPE);
		
		String t3DocName = infos.get(Const.T3_DOC_NAME);
		String t3DocWriter = infos.get(Const.T3_WRITER);
		
		if ("Y".equals(irmsProvideService)) {
			serviceInterfaceClassName = "Irms" + serviceInterfaceClassName;
		} else {
			serviceInterfaceClassName = remoteSystemName + serviceInterfaceClassName;
		}
		
		if ("Y".equalsIgnoreCase(irmsProvideService)) {
			//integration端配置
			String integrationProjectSrcPath = PropertiesLoader.get(PropertyName.INTEGRATION_PROJECT_SRC_PATH);
			String integrationInterfacePackagePath = PropertiesLoader.get(PropertyName.INTEGRATION_PACKAGE_PATH);
			integrationInterfacePackagePath = integrationInterfacePackagePath + "." + remoteSystemName + ".service";
			
			String classUpperName = serviceInterfaceClassName.substring(0,1).toUpperCase() + serviceInterfaceClassName.substring(1);
			String integrationSecurityClassFullName = integrationInterfacePackagePath + ".usersession.Integration" + classUpperName + "Impl";

			Map<String, Object> map = new HashMap<String, Object>();
			map.put("serviceInterfaceClassName", serviceInterfaceClassName);
			map.put("serviceInterfaceMethodName", serviceInterfaceMethodName);
			map.put("remoteSystemName", remoteSystemName);
			map.put("serviceDescription", serviceDescription);
			map.put("irmsProvideService", irmsProvideService);
			map.put("methodDescription", methodDescription);
			map.put("serviceClientEnName", serviceClientEnName);
			map.put("serviceServerEnName", serviceServerEnName);
			map.put("functionNameInT3Doc", functionNameInT3Doc);
			map.put("integrationProtocolType", integrationProtocolType);
			map.put("serviceEnName", serviceEnName);
			map.put("deployProvince", deployProvince);
			map.put("businessType", businessType);
			
			map.put("t3DocName", t3DocName);
			map.put("t3DocWriter", t3DocWriter);
			
			String integrationSecurityClassFullPath = integrationProjectSrcPath + integrationSecurityClassFullName.replace(".", File.separator) + ".java";
//			createOrUpdateFile(integrationSecurityClassFullPath, "template1", "template2", "}", map, msgContainer);
			createFile(integrationSecurityClassFullPath, "template1", map, msgContainer);
		} else {
			System.out.println("此接口调用方向为IRMS使用其他系统，不需要生成接口登录类");
		}
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		inputInfo("业务接口是否是IRMS提供服务(Y/N):", infoContainer, Const.IRMS_PROVIDE_SERVICE, new String[]{"Y","N"});

		inputInfoWithEmptyCheck("输入业务接口类名称(ex:TencentQqMessageService):", infoContainer, Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		
		inputInfoWithMultiLines("输入业务接口描述,以END$结束(ex:这是代码生成器的样例,一个qq消息发送服务END$):", infoContainer, Const.SERVICE_DESCRIPTION, "END$");
		
		inputInfoWithEmptyCheck("输入接口调用方的英文大写编号，供模拟界面显示(ex:IRMS):", infoContainer, Const.SERVICE_CLIENT_SYSTEM_CODE_UPPERCASE);
		inputInfoWithEmptyCheck("输入接口提供方的英文大写编号，供模拟界面显示(ex:EOMS):", infoContainer, Const.SERVICE_SERVER_SYSTEM_CODE_UPPERCASE);
		inputInfoWithEmptyCheck("输入T3需求文档中定义的接口方法英文名:", infoContainer, Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC);
		
		inputInfo("输入接口使用的传输协议:", infoContainer, Const.INTERFACE_PROTOCOL_TYPE, new String[]{"WEBSERVICE_AXIS14","WEBSERVICE_CXF","MQ_WEBSPHERE"});
		
		inputInfo("接口发布省份拼音(ex:zhejiang):", infoContainer, Const.INTERFACE_FUNCTION_DEPLOY_PROVINCE, new String[]{"general","zhejiang","shanghai","jiangxi","gansu","shanxi"});
	}
}
