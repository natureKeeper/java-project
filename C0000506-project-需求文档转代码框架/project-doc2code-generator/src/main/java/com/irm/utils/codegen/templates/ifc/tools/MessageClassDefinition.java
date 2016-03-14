package com.irm.utils.codegen.templates.ifc.tools;

import java.util.ArrayList;
import java.util.List;


public class MessageClassDefinition {

/*	@Deprecated
	private String t3DocName;//需求文档名称
*/	private String messageClassName;
	private String messageClassDescription;
	private List<FieldInfo> fieldInfos;
	
	private boolean requestMessage;
	
	/**
	 * 父参数名称，用于自动装配class层次和命名
	 */
	private String fatherMessageName;
	
	/**
	 * 消息参数风格<br/>
	 * 普通风格，就是内部各字段独立为接口的一个入参<br/>
	 * xml风格，就是内部各字段是xml上的节点名<br/>
	 * object风格，就是消息作为一个对象传送的<br/>
	 */
	private String messageStyle;
	
/*	private String t3DocWriter;//需求人
	private String serviceProviderName;//服务提供方名称
	private String serviceProviderCode;//服务提供方缩写
	private String serviceClientName;//服务使用方名称
	private String serviceClientCode;//服务使用方缩写
	
	private String serviceEntryCode;//接口服务入口
	private String serviceDescription;//接口服务说明
	
	private String methodEntryCode;//接口方法名称
	private String methodDescription;//接口方法说明
*/	
	
	public MessageClassDefinition() {
		fieldInfos = new ArrayList<FieldInfo>();
	}

	public String getMessageClassName() {
		return messageClassName;
	}
	public void setMessageClassName(String messageClassName) {
		this.messageClassName = messageClassName;
	}

	public List<FieldInfo> getFieldInfos() {
		return fieldInfos;
	}
	public void setFieldInfos(List<FieldInfo> fieldInfos) {
		this.fieldInfos = fieldInfos;
	}
	public String getMessageClassDescription() {
		return messageClassDescription;
	}
	public void setMessageClassDescription(String messageClassDescription) {
		this.messageClassDescription = messageClassDescription;
	}

	public boolean isRequestMessage() {
		return requestMessage;
	}

	public void setRequestMessage(boolean requestMessage) {
		this.requestMessage = requestMessage;
	}

	public String getFatherMessageName() {
		return fatherMessageName;
	}

	public void setFatherMessageName(String fatherMessageName) {
		this.fatherMessageName = fatherMessageName;
	}

	public String getMessageStyle() {
		return messageStyle;
	}

	public void setMessageStyle(String messageStyle) {
		this.messageStyle = messageStyle;
	}
}
