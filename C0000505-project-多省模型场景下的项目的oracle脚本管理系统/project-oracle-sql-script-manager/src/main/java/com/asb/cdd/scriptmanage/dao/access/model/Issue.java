package com.asb.cdd.scriptmanage.dao.access.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Issue {
	
	//MR编号
	private String issueId;
	
	private String reporter;
	
	private String assignee;
	
	private String title;
	
	private String description;
	
	private String status;
	
	
	//MR相关的所有的脚本批次
	private List<Task2> tasks = new ArrayList<Task2>();
	
	
	private List<Script2> scripts = new ArrayList<Script2>();

	public List<Script2> getScripts() {
		return scripts;
	}

	public void setScripts(List<Script2> scripts) {
		this.scripts = scripts;
	}

	private IssueTaskStatus issueTaskStatus;
	
	public String getIssueId() {
		return issueId;
	}

	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}

	public List<Task2> getTasks() {
		return tasks;
	}

	public void setTasks(List<Task2> tasks) {
		this.tasks = tasks;
	}

	public String getReporter() {
		return reporter;
	}

	public void setReporter(String reporter) {
		this.reporter = reporter;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setIssueTaskStatus(IssueTaskStatus issuseTaskStatus) {
		this.issueTaskStatus = issuseTaskStatus;
	}

	public IssueTaskStatus getIssueTaskStatus() {
		return issueTaskStatus;
	}
	
	
	
}
