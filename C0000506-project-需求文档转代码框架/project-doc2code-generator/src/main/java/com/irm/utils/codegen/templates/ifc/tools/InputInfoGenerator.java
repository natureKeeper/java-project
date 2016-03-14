package com.irm.utils.codegen.templates.ifc.tools;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.templates.GeneralGenerator;
import com.irm.utils.codegen.utils.Comment;
import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;
import com.irm.utils.codegen.utils.PropertiesLoader;

@Comment("*****************************************" + "\r\n任务" + "\r\n用途：收集信息" + "\r\n*****************************************")
public class InputInfoGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(InputInfoGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		String serverProjectPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);
		System.out.println("server端工程路径: " + serverProjectPath);

		String packagePathInServerSide = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
		System.out.println("server端代码的接口包路径: " + packagePathInServerSide);
		
		inputInfoWithEmptyCheck("输入业务接口方法的中文简述以生成常量类(ex:qq消息发送接口):", infoContainer, Const.INTERFACE_METHOD_CN_NAME_IN_T3DOC);
		inputInfoWithEmptyCheck("输入业务接口方法的英文常量名以生成常量类(ex:SEND_QQ_MSG):", infoContainer, Const.INTERFACE_METHOD_ENUM_CONST);
		
		// 对方系统名列表
		String systemNames = PropertiesLoader.get(PropertyName.INTEGRATION_SYSTEM_NAMES);
		inputInfo("输入对方系统名以生成包路径和类名:", infoContainer, Const.REMOTE_SYSTEM_CODE_LOWERCASE, systemNames.split(";"));

		// 接口种类列表
		String functionTypes = PropertiesLoader.get(PropertyName.INTEGRATION_FUNCTION_TYPES);
		System.out.println("业务接口功能种类例子列表: " + functionTypes);
		inputInfoWithEmptyCheck("输入业务接口功能种类以生成包路径,功能种类指:工单类,单点登录类,光路配置类等(ex:im):", infoContainer, Const.INTEGRATION_FUNCTION_BUSINESS_TYPE);

		inputInfo("业务接口是否是IRMS提供服务(Y/N)，以生成类名:", infoContainer, Const.IRMS_PROVIDE_SERVICE, new String[] { "Y", "N" });

		inputInfoWithEmptyCheck("输入业务接口类名称，不要在前面加系统名大写(ex:MessageSenderService):", infoContainer, Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE);
		inputInfoWithMultiLines("输入业务类详细描述,以END$结束(ex:这是一个消息服务类，提供qq，飞信，短信等消息发送的封装接口END$):", infoContainer, Const.SERVICE_DESCRIPTION, "END$");

		inputInfoWithEmptyCheck("输入业务方法名以生成业务类的方法(ex:sendQqMessage):", infoContainer, Const.JAVA_SERVICE_METHODNAME);
		inputInfoWithMultiLines("输入业务接口方法详细描述,以END$结束(ex:这是qq消息发送方法END$):", infoContainer, Const.METHOD_DESCRIPTION, "END$");

		inputInfoWithEmptyCheck("输入接口调用方的英文大写编号，供模拟界面显示(ex:IRMS):", infoContainer, Const.SERVICE_CLIENT_SYSTEM_CODE_UPPERCASE);
		inputInfoWithEmptyCheck("输入接口提供方的英文大写编号，供模拟界面显示(ex:DEMO):", infoContainer, Const.SERVICE_SERVER_SYSTEM_CODE_UPPERCASE);
		inputInfoWithEmptyCheck("输入T3需求文档中定义的接口方法英文名以生成接口类(ex:faSongQqXiaoXi):", infoContainer, Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC);

		inputInfo("输入接口使用的传输协议:", infoContainer, Const.INTERFACE_PROTOCOL_TYPE, new String[] { "WEBSERVICE_AXIS14", "WEBSERVICE_CXF", "MQ_WEBSPHERE" });

		inputInfo("接口发布省份拼音以生成包路径(ex:general):", infoContainer, Const.INTERFACE_FUNCTION_DEPLOY_PROVINCE, new String[] { "general", "zhejiang", "shanghai", "jiangxi", "gansu", "shanxi" });
		inputInfoWithEmptyCheck("输入axis14工程中applicationContext.properties的webservice端口服务key(ex:irms.integration.sso.statistics.shanghai.webservice.endpoint)", infoContainer, Const.AXI14_ENDPOINT_URL_KEY);

	}
}
