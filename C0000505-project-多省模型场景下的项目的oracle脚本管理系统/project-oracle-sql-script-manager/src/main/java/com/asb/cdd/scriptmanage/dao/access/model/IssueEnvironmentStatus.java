package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

import common.enums.EnumUtil;
import common.enums.OptionedEnum;
 
@XmlRootElement
public enum IssueEnvironmentStatus implements OptionedEnum {

	waitExec((short) 1, "等待执行"), 
	
	executing((short) 2, "执行中"), 
	
	execFail((short) 3, "执行失败"), 
	
	execSuccess((short) 4, "执行成功"), 
	
	noNeedExec((short) 5, "不用执行");
	
	private short value;

	private String text;

	private IssueEnvironmentStatus(short value, String text) {
		this.value = value;
		this.text = text;
	}

	public static IssueEnvironmentStatus get(short value) {
		return EnumUtil.get(IssueEnvironmentStatus.class, value);
	}

	public static IssueEnvironmentStatus get(String name) {
		return EnumUtil.get(IssueEnvironmentStatus.class, name);
	}

	public String getText() {
		return text;
	}

	public String getName() {
		return name();
	}

	public short getValue() {
		return value;
	}

}
