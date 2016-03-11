package com.asb.cdd.scriptmanage.dao.access.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.irm.model.system.SystemModel;
import com.irm.model.system.User;

@XmlRootElement
public class Task extends SystemModel {
	/*
	private int id;
	private String name;*/
	private Date createTime;
	private long userId;
	private int status;
//	private int version;
	private List<Script> scripts = new ArrayList<Script>();
//	private String userName;
	
	private User user;
	/**
	 * MR编号，可以与MR系统做关联，比如MR系统中close MR时可以把任务和脚本变为验证通过状态
	 */
	private String issueId;
	
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
	public List<Script> getScripts() {
		return scripts;
	}
	public void setScripts(List<Script> scripts) {
		this.scripts = scripts;
	}
	public String getIssueId() {
		return issueId;
	}
	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

}
