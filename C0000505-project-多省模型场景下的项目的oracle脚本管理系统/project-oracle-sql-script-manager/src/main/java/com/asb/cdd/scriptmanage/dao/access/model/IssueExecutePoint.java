package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

import common.enums.EnumUtil;
import common.enums.OptionedEnum;
 
@XmlRootElement
public enum IssueExecutePoint implements OptionedEnum {

	asSoonAsPossible((short) 1, "立即自动执行"), 
	
	beforeDawn((short) 2, "耗时脚本在深夜执行"), 
	
	manual((short) 3, "手工或开新分支时执行"), 
	
	noNeedExec((short) 4, "不用执行"); 
	
	private short value;

	private String text;

	private IssueExecutePoint(short value, String text) {
		this.value = value;
		this.text = text;
	}

	public static IssueExecutePoint get(short value) {
		return EnumUtil.get(IssueExecutePoint.class, value);
	}

	public static IssueExecutePoint get(String name) {
		return EnumUtil.get(IssueExecutePoint.class, name);
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
