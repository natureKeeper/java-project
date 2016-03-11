package com.asb.cdd.scriptmanage.dao.access.model;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.irm.model.system.SystemModel;
@XmlRootElement
public class Script extends SystemModel {
	
/*	private int id;
	private int version;
	private String name;*/
	private String originName;
	private String memo;
	private int status;
	private String scriptLocation;
	private int scriptType;
	private long taskId;
	
	private Task task;
	
	private List<Destination> destinations;
	private List<ScriptEnvironmentRelation> environmentRelations;
	private long executeSeq;
	
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
	public Task getTask() {
		return task;
	}
	public void setTask(Task task) {
		this.task = task;
	}
	public List<Destination> getDestinations() {
		return destinations;
	}
	public void setDestinations(List<Destination> destinations) {
		this.destinations = destinations;
	}
	public List<ScriptEnvironmentRelation> getEnvironmentRelations() {
		return environmentRelations;
	}
	public void setEnvironmentRelations(List<ScriptEnvironmentRelation> environmentRelations) {
		this.environmentRelations = environmentRelations;
	}
	public long getExecuteSeq() {
		return executeSeq;
	}
	public void setExecuteSeq(long executeSeq) {
		this.executeSeq = executeSeq;
	}	
}
