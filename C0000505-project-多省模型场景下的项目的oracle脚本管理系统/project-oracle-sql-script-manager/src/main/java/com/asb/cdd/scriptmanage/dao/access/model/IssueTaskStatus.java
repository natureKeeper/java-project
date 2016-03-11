package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

import common.enums.EnumUtil;
import common.enums.OptionedEnum;
 
@XmlRootElement
public enum IssueTaskStatus implements OptionedEnum {

	noExist((short) 0, "不存在"), 
	
	waitExec((short) 1, "等待执行"), 
	
	execPartialScripts((short) 2, "部分脚本执行"), 
	
	execAllScriptsSuccess((short) 3, "所有脚本执行成功"), 
	
	confirmedAllScriptsSuccess((short) 4, "所有脚本确认成功"), 
	
	releasePartialDestination((short) 5, "部分省份发布"), 
	
	releaseSuccessful((short) 6, "已发布"), 
	
	deprecated((short) 7, "已废弃"); 
	
	private short value;

	private String text;

	private IssueTaskStatus(short value, String text) {
		this.value = value;
		this.text = text;
	}

	public static IssueTaskStatus get(short value) {
		return EnumUtil.get(IssueTaskStatus.class, value);
	}

	public static IssueTaskStatus get(String name) {
		return EnumUtil.get(IssueTaskStatus.class, name);
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
