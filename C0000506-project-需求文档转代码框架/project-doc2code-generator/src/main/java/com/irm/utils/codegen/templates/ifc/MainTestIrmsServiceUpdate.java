package com.irm.utils.codegen.templates.ifc;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.templates.ifc.tools.Axis14ClientConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ClientGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ServiceImplementGenerator;
import com.irm.utils.codegen.templates.ifc.tools.Axis14ServiceInterfaceGenerator;
import com.irm.utils.codegen.templates.ifc.tools.BusinessClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.BusinessConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.InputInfoGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationConfigFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationConstantGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationInterfaceGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationMockClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationRouterClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationSecurityClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.IntegrationTemplateFileGenerator;
import com.irm.utils.codegen.templates.ifc.tools.MessageClassGenerator;
import com.irm.utils.codegen.templates.ifc.tools.TestIrmsService2Generator;
import com.irm.utils.codegen.utils.CodeGenTemplateExecutor;
import com.irm.utils.codegen.utils.Comment;

@Comment("hello")
public class MainTestIrmsServiceUpdate {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(MainTestIrmsServiceUpdate.class);

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		CodeGenTemplateExecutor executor = new CodeGenTemplateExecutor();
		
		InputInfoGenerator gen0 = new InputInfoGenerator();
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
		
		TestIrmsService2Generator genTest = new TestIrmsService2Generator();
		
		executor.addCodeGenerator(genTest);
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
		
		executor.execute();
	}

}
