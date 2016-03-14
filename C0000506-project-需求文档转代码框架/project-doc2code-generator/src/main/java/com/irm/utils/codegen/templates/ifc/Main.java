package com.irm.utils.codegen.templates.ifc;

import java.io.File;
import java.util.Scanner;

import com.irm.utils.codegen.templates.ifc.tools.Axis14ClientConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ClientGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ServerConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ServiceImplementGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ServiceInterfaceGenerator;
import com.irm.utils.codegen.templates.ifc.tools.BusinessClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.BusinessConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationConstantGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationInterfaceGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationMockClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationRouterClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationSecurityClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationTemplateFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.MessageClassEnumFieldGenerator;
import com.irm.utils.codegen.templates.ifc.tools.MessageClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.MsWordInfoParser;
import com.irm.utils.codegen.utils.CodeGenTemplateExecutor;
import common.util.Detect;

public class Main {

	public static void main(String[] args) throws Exception {
		String inputDirString = "d:/workspace/tmp/input";
		String outputDirString = "d:/workspace/tmp/output";
		
		File inputDir = new File(inputDirString);
		File outputDir = new File(outputDirString);

		outputDir.mkdirs();

		System.err.println("注意：运行此程序需要系统安装微软的office，并且把jcom.dll放在jdk的bin目录里");
		System.err.println("请清空输出目录的内容：" + outputDir);
		System.err.println("请在输入目录中放入接口开发设计文档：" + inputDir);

		Scanner scaner = new Scanner(System.in);
		String value = scaner.nextLine();
		
		File[] inputFiles = inputDir.listFiles();
		if (!Detect.notEmpty(inputFiles)) {
			System.out.println("输入目录录中没有文档：" + inputDir);
			System.exit(0);
		}
		if (1 < inputFiles.length) {
			System.out.println("输入目录中不止一份文档：" + inputDir);
			System.exit(0);
		}
		
		File wordDoc = inputFiles[0];
		
		if (!wordDoc.isFile()) {
			throw new Exception("接口开发设计文档不是文件，请检查");
		}

		Main main = new Main();
		main.generateIfcFrameworkCode(wordDoc);

		System.out.println("执行完毕");
	}
	
	public void generateIfcFrameworkCode(File wordFile) throws Exception {
		CodeGenTemplateExecutor executor = new CodeGenTemplateExecutor();
		
		MsWordInfoParser gen0 = new MsWordInfoParser(wordFile);
		IntegrationConstantGenerator gen1 = new IntegrationConstantGenerator();
		MessageClassGenerator gen2 = new MessageClassGenerator();
		BusinessClassGenerator gen3 = new BusinessClassGenerator();
		BusinessConfigFileGenerator gen4 = new BusinessConfigFileGenerator();
		IntegrationInterfaceGenerator gen5 = new IntegrationInterfaceGenerator();
		IntegrationSecurityClassGenerator gen6 = new IntegrationSecurityClassGenerator();
		IntegrationRouterClassGenerator gen7 = new IntegrationRouterClassGenerator();
		IntegrationMockClassGenerator gen8 = new IntegrationMockClassGenerator();
		IntegrationConfigFileGenerator gen9 = new IntegrationConfigFileGenerator();
		Axis14ServiceInterfaceGenerator gen10 = new Axis14ServiceInterfaceGenerator();
		Axis14ServiceImplementGenerator gen11 = new Axis14ServiceImplementGenerator();
		Axis14ClientGenerator gen12 = new Axis14ClientGenerator();
		Axis14ClientConfigFileGenerator gen13 = new Axis14ClientConfigFileGenerator();
		IntegrationTemplateFileGenerator gen14 = new IntegrationTemplateFileGenerator();
		
		Axis14ServerConfigFileGenerator gen15 = new Axis14ServerConfigFileGenerator();
		MessageClassEnumFieldGenerator gen16 = new MessageClassEnumFieldGenerator();
		
		executor.addCodeGenerator(gen0);
		executor.addCodeGenerator(gen1);
		executor.addCodeGenerator(gen2);
		executor.addCodeGenerator(gen3);
		executor.addCodeGenerator(gen4);
		executor.addCodeGenerator(gen5);
		executor.addCodeGenerator(gen6);
		executor.addCodeGenerator(gen7);
		executor.addCodeGenerator(gen8);
		executor.addCodeGenerator(gen9);
		executor.addCodeGenerator(gen10);
		executor.addCodeGenerator(gen11);
		executor.addCodeGenerator(gen12);
		executor.addCodeGenerator(gen13);
		executor.addCodeGenerator(gen14);
		executor.addCodeGenerator(gen15);
		executor.addCodeGenerator(gen16);
		
		executor.execute();
	}

}
