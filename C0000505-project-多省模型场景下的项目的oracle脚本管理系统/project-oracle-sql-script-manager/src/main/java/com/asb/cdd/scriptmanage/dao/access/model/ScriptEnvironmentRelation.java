package com.asb.cdd.scriptmanage.dao.access.model;

import java.util.Date;

import com.irm.model.system.SystemModel;

public class ScriptEnvironmentRelation extends SystemModel {
	/*
	private int id;
	private int version;*/
	private long scriptId;
	private long environmentId;
	private int status;
	private int executePoint;
	private long latestLogId;
	private Date latestExecuteTime;
	private String latestElapsedTime;
	private long latestExecSeq;
	
	private Script script;
	private Environment environment;
	private ExecuteLog lastLog;
	
	public long getScriptId() {
		return scriptId;
	}
	public void setScriptId(long scriptId) {
		this.scriptId = scriptId;
	}
	public long getEnvironmentId() {
		return environmentId;
	}
	public void setEnvironmentId(long environmentId) {
		this.environmentId = environmentId;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}

	public Script getScript() {
		return script;
	}
	public void setScript(Script script) {
		this.script = script;
	}
	public Environment getEnvironment() {
		return environment;
	}
	public void setEnvironment(Environment environment) {
		this.environment = environment;
	}
	public ExecuteLog getLastLog() {
		return lastLog;
	}
	public void setLastLog(ExecuteLog lastLog) {
		this.lastLog = lastLog;
	}

	public long getLatestLogId() {
		return latestLogId;
	}
	public void setLatestLogId(long latestLogId) {
		this.latestLogId = latestLogId;
	}
	public Date getLatestExecuteTime() {
		return latestExecuteTime;
	}
	public void setLatestExecuteTime(Date latestExecuteTime) {
		this.latestExecuteTime = latestExecuteTime;
	}
	public String getLatestElapsedTime() {
		return latestElapsedTime;
	}
	public void setLatestElapsedTime(String latestElapsedTime) {
		this.latestElapsedTime = latestElapsedTime;
	}
	public int getExecutePoint() {
		return executePoint;
	}
	public void setExecutePoint(int executePoint) {
		this.executePoint = executePoint;
	}
	public long getLatestExecSeq() {
		return latestExecSeq;
	}
	public void setLatestExecSeq(long latestExecSeq) {
		this.latestExecSeq = latestExecSeq;
	}


}
