package com.asb.cdd.scriptmanage.dao.access.model;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;
@XmlRootElement
public class Task2  {
	/**/
	private int id;
	private String name;
	private Date createTime;
	private long userId;
	private int status;
	private int version;
	//MR编号，可以与MR系统做关联，比如MR系统中close MR时可以把任务和脚本变为验证通过状态
	private String issueId;
//	private List<Script> scripts = new ArrayList<Script>();
//	private String userName;
	private IssueTaskStatus issueTaskStatus;
	
	public IssueTaskStatus getIssueTaskStatus() {
		return issueTaskStatus;
	}
	public void setIssueTaskStatus(IssueTaskStatus issueTaskStatus) {
		this.issueTaskStatus = issueTaskStatus;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public String getIssueId() {
		return issueId;
	}
	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}
}
