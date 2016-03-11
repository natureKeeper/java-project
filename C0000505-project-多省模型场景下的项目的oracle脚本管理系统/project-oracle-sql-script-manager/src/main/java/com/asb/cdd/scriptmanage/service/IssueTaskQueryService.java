package com.asb.cdd.scriptmanage.service;

import java.io.InputStream;

import com.asb.cdd.scriptmanage.dao.access.model.Issue;

public interface IssueTaskQueryService {
	
	Issue getIssueStatus(Issue i);
	
	InputStream release(Issue i);
}
