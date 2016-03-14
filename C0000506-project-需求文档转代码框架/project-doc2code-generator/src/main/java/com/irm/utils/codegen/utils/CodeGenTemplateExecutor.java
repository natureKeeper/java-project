package com.irm.utils.codegen.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.templates.CodeGenerator;
import common.util.Detect;


/**
 * 用template模式实现的代码生成器
 * @author Administrator
 *
 */
public class CodeGenTemplateExecutor {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(CodeGenTemplateExecutor.class);
	
	private List<CodeGenerator> generators = new ArrayList<CodeGenerator>();
	
	public void addCodeGenerator(CodeGenerator codeGenerator) {
		generators.add(codeGenerator);
	}
	
	public void execute() throws Exception {
		InformationContainer infoContainer = new InformationContainer();
		MessageContainer msgContainer = new MessageContainer();
		
		for (CodeGenerator g : generators) {
			g.init();
			g.printUsage();
			g.inputInformation(infoContainer);
			g.execute(infoContainer, msgContainer);
		}
		
		System.out.println();
		System.out.println();
		System.out.println();		
		if (Detect.notEmpty(msgContainer.getMessages())) {
			for (String str : msgContainer.getMessages()) {
				System.out.println(str);
			}
		}
	}
}
