package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

import com.irm.model.system.SystemModel;
@XmlRootElement
public class Script2 extends SystemModel {
	
	private static final long serialVersionUID = 1L;
	/*	private int id;
	private int version;
	private String name;*/
	private String originName;
	private String memo;
	private int status;
	private IssueTaskStatus issueTaskStatus;
	private IssueScriptStatus issueScriptStatus;
	private String scriptLocation;
	private int scriptType;
	private long taskId;
	private Task2 task;
	private String destinations;
	private String environmentRelations;
	private long executeSeq;
	private String userName;
	
	/**
	 * 保存到文件系统
	 */
	private String scriptContent;
	
	public String getOriginName() {
		return originName;
	}
	public void setOriginName(String originName) {
		this.originName = originName;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getScriptLocation() {
		return scriptLocation;
	}
	public void setScriptLocation(String scriptLocation) {
		this.scriptLocation = scriptLocation;
	}
	public int getScriptType() {
		return scriptType;
	}
	public void setScriptType(int scriptType) {
		this.scriptType = scriptType;
	}
	public String getScriptContent() {
		return scriptContent;
	}
	public void setScriptContent(String scriptContent) {
		this.scriptContent = scriptContent;
	}
	public long getTaskId() {
		return taskId;
	}
	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}
	public long getExecuteSeq() {
		return executeSeq;
	}
	public void setExecuteSeq(long executeSeq) {
		this.executeSeq = executeSeq;
	}	
	public Task2 getTask() {
		return task;
	}
	public void setTask(Task2 task) {
		this.task = task;
	}
	public String getDestinations() {
		return destinations;
	}
	public void setDestinations(String destinations) {
		this.destinations = destinations;
	}
	public String getEnvironmentRelations() {
		return environmentRelations;
	}
	public void setEnvironmentRelations(String environmentRelations) {
		this.environmentRelations = environmentRelations;
	}
	public IssueTaskStatus getIssueTaskStatus() {
		return issueTaskStatus;
	}
	public void setIssueTaskStatus(IssueTaskStatus issueTaskStatus) {
		this.issueTaskStatus = issueTaskStatus;
	}
	public IssueScriptStatus getIssueScriptStatus() {
		return issueScriptStatus;
	}
	public void setIssueScriptStatus(IssueScriptStatus issueScriptStatus) {
		this.issueScriptStatus = issueScriptStatus;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
}
