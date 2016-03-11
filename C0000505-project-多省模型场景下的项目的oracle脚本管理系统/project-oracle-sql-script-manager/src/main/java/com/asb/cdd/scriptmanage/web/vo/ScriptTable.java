package com.asb.cdd.scriptmanage.web.vo;

import java.io.File;

public class ScriptTable {

	private String name;
	private String scriptType;
	private String[] scriptDestination;
	private String[] scriptEnvironment;
	private String[] scriptEnvironmentExecutePoint;
	private int sequence;//提交时的顺序，以便服务器根据这个id顺序入库，执行时保证一个任务中的脚本按序执行
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getScriptType() {
		return scriptType;
	}
	public void setScriptType(String scriptType) {
		this.scriptType = scriptType;
	}
	public String[] getScriptDestination() {
		return scriptDestination;
	}
	public void setScriptDestination(String[] scriptDestination) {
		this.scriptDestination = scriptDestination;
	}
	public String[] getScriptEnvironment() {
		return scriptEnvironment;
	}
	public void setScriptEnvironment(String[] scriptEnvironment) {
		this.scriptEnvironment = scriptEnvironment;
	}
	public String[] getScriptEnvironmentExecutePoint() {
		return scriptEnvironmentExecutePoint;
	}
	public void setScriptEnvironmentExecutePoint(String[] scriptEnvironmentExecutePoint) {
		this.scriptEnvironmentExecutePoint = scriptEnvironmentExecutePoint;
	}
	public int getSequence() {
		return sequence;
	}
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
}
