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
		+ "\r\n任务：IntegrationConstantGenerator"
		+ "\r\n用途：增加接口名常量"
		+ "\r\n输入接口中文名，英文常量名"
		+ "\r\n如果存在目标文件，则追加，否则新建"
		+ "\r\n输出IntegrationServiceDefinitionEnum"
		+ "\r\n*****************************************")
public class IntegrationConstantGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(IntegrationConstantGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();
		String cnName = infos.get(Const.INTERFACE_METHOD_CN_NAME_IN_T3DOC);
		String enName = infos.get(Const.INTERFACE_METHOD_ENUM_CONST);
		
		String t3DocName = infos.get(Const.T3_DOC_NAME);
		String t3DocWriter = infos.get(Const.T3_WRITER);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("cnName", cnName);
		map.put("enName", enName);
		
		map.put("t3DocName", t3DocName);
		map.put("t3DocWriter", t3DocWriter);
		
		String serverProjectPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);		
		String constClassPath = PropertiesLoader.get(PropertyName.INTEGRATION_CONST_DEFINE_CLASS_PATH);
		String fileFullPath = serverProjectPath + constClassPath;
		System.out.println("接口常量class生成到: " + fileFullPath);
		
//		this.createOrUpdateFile(fileFullPath, "template1", "template2", "}", map, msgContainer);
		this.createFile(fileFullPath, "template1", map, msgContainer);
	}

	@Override
	public void inputInformation(InformationContainer infoContainer) {
		inputInfo("输入接口方法的中文名(ex:qq消息发送接口):", infoContainer, Const.INTERFACE_METHOD_CN_NAME_IN_T3DOC);
		inputInfo("输入接口方法的英文常量名(ex:SEND_QQ_MSG):", infoContainer, Const.INTERFACE_METHOD_ENUM_CONST);
	}

}
