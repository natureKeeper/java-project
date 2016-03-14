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
import common.util.StringUtil;

@Comment(
		"*****************************************"
		+ "\r\n任务：MessageClassEnumFieldGenerator"
		+ "\r\n用途：生成参数类中的枚举字段"
		+ "\r\n*****************************************")
public class MessageClassEnumFieldGenerator extends GeneralGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(MessageClassEnumFieldGenerator.class);

	@Override
	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		Map<String, String> infos = infoContainer.getInformations();

		String remoteSystemName = infos.get(Const.REMOTE_SYSTEM_CODE_LOWERCASE);
		
		String serverProjectSrcPath = PropertiesLoader.get(PropertyName.SERVER_PROJECT_SRC_PATH);
		String serverPackagePath = PropertiesLoader.get(PropertyName.SERVER_PACKAGE_PATH);
		serverPackagePath = serverPackagePath + "." + remoteSystemName + ".type";
		
		List<MessageClassDefinition> msgClazzDefs = infoContainer.getMessageClassDefinitions();
		
		for (MessageClassDefinition msgClazzDef : msgClazzDefs) {

			for (FieldInfo fi : msgClazzDef.getFieldInfos()) {
				if (fi.getJavaFieldDataType().startsWith("enum")) {
					String enumClassName = fi.getJavaFieldName().substring(0, 1).toUpperCase() + fi.getJavaFieldName().substring(1);
					//字典值和接口值映射表
					Map<String, String> dictKeyIfcCodePairs = new HashMap<String, String>();
					//字典值和接口值描述映射表
					Map<String, String> dictKeyIfcDescPairs = new HashMap<String, String>();
					
					String desc = fi.getJavaFieldDataType();
					String[] enumStrings = StringUtil.splitByLinebreak(desc);
					for (int i=1; i<enumStrings.length; i++) {
						String enumString = enumStrings[i];
						String[] enumInfo = enumString.split(":");
						dictKeyIfcCodePairs.put(enumInfo[0], enumInfo[1]);
						dictKeyIfcDescPairs.put(enumInfo[0], enumInfo[2]);
					}
					
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("serverPackagePath", serverPackagePath);
					map.put("enumClassName", enumClassName);
					map.put("dictKeyIfcCodePairs", dictKeyIfcCodePairs);			
					map.put("dictKeyIfcDescPairs", dictKeyIfcDescPairs);

					String typeClassFullPath = serverProjectSrcPath + (serverPackagePath + '.' + enumClassName).replace(".", File.separator) + "Type.java";
					String typeAdapterClassFullPath = serverProjectSrcPath + (serverPackagePath + '.' + enumClassName).replace(".", File.separator) + "TypeAdapter.java";
					
					createFile(typeClassFullPath, "template1", map, msgContainer);
					createFile(typeAdapterClassFullPath, "template2", map, msgContainer);
				}
			}
			
		}
	}


	@Override
	public void inputInformation(InformationContainer infoContainer) {

	}

}
