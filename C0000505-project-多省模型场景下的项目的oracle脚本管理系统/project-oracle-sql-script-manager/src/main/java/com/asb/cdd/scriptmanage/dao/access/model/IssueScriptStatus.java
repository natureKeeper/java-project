package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

import common.enums.EnumUtil;
import common.enums.OptionedEnum;

@XmlRootElement
public enum IssueScriptStatus implements OptionedEnum {

	noExist((short) 0, "不存在"), 
	
	waitExec((short) 1, "等待执行"), 
	
	executing((short) 2, "执行中"), 
	
	execFail((short) 3, "执行失败"), 
	
	allEnvExecSuccess((short) 4, "所有环境执行成功"), 
	
	noNeedExec((short) 5, "不用执行"), 
	
	confirmSuccess((short) 6, "确认成功"), 
	
	releasePartial((short) 7, "部分省份发布"), 
	
	releaseSuccessful((short) 8, "发布成功"), 
	
	allBranchEnvExecSuccess((short) 9, "所有分支环境执行成功"), 
	
	deprecated((short) 10, "已废弃"); // 已废弃
	
	
	
	private short value;

	private String text;

	private IssueScriptStatus(short value, String text) {
		this.value = value;
		this.text = text;
	}

	public static IssueScriptStatus get(short value) {
		return EnumUtil.get(IssueScriptStatus.class, value);
	}

	public static IssueScriptStatus get(String name) {
		return EnumUtil.get(IssueScriptStatus.class, name);
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
