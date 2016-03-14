package com.irm.utils.codegen.templates.ifc.tools;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.templates.GeneralGenerator;
import com.irm.utils.codegen.utils.Comment;
import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;

@Comment("*****************************************" + "\r\n任务" + "\r\n用途：测试irms作为客户端的接口生成模板" + "\r\n*****************************************")
public class TestIrmsClient2Generator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(TestIrmsClient2Generator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		Map map = infoContainer.getInformations();
		map.put(Const.INTERFACE_METHOD_CN_NAME_IN_T3DOC, "msn消息发送接口");
		map.put(Const.INTERFACE_METHOD_ENUM_CONST, "SEND_MSG_MSG");
		map.put(Const.REMOTE_SYSTEM_CODE_LOWERCASE, "demo");
		map.put(Const.INTEGRATION_FUNCTION_BUSINESS_TYPE, "im");
		map.put(Const.IRMS_PROVIDE_SERVICE, "N");
		map.put(Const.JAVA_SERVICE_CLASSNAME_WITHOUT_SYSTEM_CODE, "MessageSenderService");
		map.put(Const.SERVICE_DESCRIPTION, "这是一个消息服务类，提供qq，飞信，短信等消息发送的封装接口");
		map.put(Const.JAVA_SERVICE_METHODNAME, "sendMsnMessage");
		map.put(Const.METHOD_DESCRIPTION, "这是msn消息发送方法");
		map.put(Const.SERVICE_CLIENT_SYSTEM_CODE_UPPERCASE, "IRMS");
		map.put(Const.SERVICE_SERVER_SYSTEM_CODE_UPPERCASE, "DEMO");
		
		map.put(Const.INTERFACE_METHOD_EN_CODE_IN_T3DOC, "faSongMsnXiaoXi");
		map.put(Const.INTERFACE_PROTOCOL_TYPE, "WEBSERVICE_AXIS14");
		map.put(Const.INTERFACE_FUNCTION_DEPLOY_PROVINCE, "general");
		map.put(Const.AXI14_ENDPOINT_URL_KEY, "irms.integration.general.demo.im.webservice.endpoint");
	}
}
