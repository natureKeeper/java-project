package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class IssueDemo {
	
	public IssueDemo() {}
	
	//MR编号
	private String issueId;
	

	public String getIssueId() {
		return issueId;
	}

	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}

	
}
