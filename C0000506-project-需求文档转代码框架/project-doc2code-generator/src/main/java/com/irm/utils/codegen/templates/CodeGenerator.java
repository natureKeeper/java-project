package com.irm.utils.codegen.templates;

import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;

public interface CodeGenerator {
	
	/**
	 * 初始化
	 */
	void init();

	/**
	 * 打印使用方法
	 */
	void printUsage();
	
	/**
	 * 输入信息，以便生成代码
	 */
	void inputInformation(InformationContainer infoContainer);
	
	/**
	 * 执行生成代码的过程
	 */
	void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception;
}
