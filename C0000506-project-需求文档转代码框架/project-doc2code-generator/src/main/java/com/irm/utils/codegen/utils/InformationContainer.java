package com.irm.utils.codegen.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.irm.utils.codegen.templates.ifc.tools.MessageClassDefinition;

/**
 * 输入信息收集容器
 * @author Administrator
 *
 */
public class InformationContainer {
	
	private Map<String, String> informations;
	
	private List<MessageClassDefinition> messageClassDefinitions;
	
	public InformationContainer() {
		informations = new HashMap<String, String>();
		messageClassDefinitions = new ArrayList<MessageClassDefinition>();
	}

	public Map<String, String> getInformations() {
		return informations;
	}

	public void setInformations(Map<String, String> informations) {
		this.informations = informations;
	}

	public List<MessageClassDefinition> getMessageClassDefinitions() {
		return messageClassDefinitions;
	}

	public void setMessageClassDefinitions(List<MessageClassDefinition> messageClassDefinitions) {
		this.messageClassDefinitions = messageClassDefinitions;
	}

}
