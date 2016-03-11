package com.asb.cdd.scriptmanage.dao.access.model;

import java.util.Date;

import com.irm.model.system.SystemModel;

public class ExecuteLog extends SystemModel {
	/*
	private int id;
	private int version;*/
	private Date createTime;
	private long taskId;
	private long scriptId;
	private long environmentId;
	private String title;
	/**
	 * message内容不会记录在数据库中，将以文件形式存放在磁盘上，通过logFileLocation引用
	 */
	private String message;
	private String logFileLocation;
	private String elapsedTime;
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
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
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getLogFileLocation() {
		return logFileLocation;
	}
	public void setLogFileLocation(String logFileLocation) {
		this.logFileLocation = logFileLocation;
	}
	public String getElapsedTime() {
		return elapsedTime;
	}
	public void setElapsedTime(String elapsedTime) {
		this.elapsedTime = elapsedTime;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}


}
