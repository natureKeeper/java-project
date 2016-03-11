package com.asb.cdd.scriptmanage.service;

import com.asb.cdd.scriptmanage.dao.access.model.Issue;

public interface IssueTaskQueryService2 {
	
	Issue queryScriptsByIssueId(Issue issue);	
}
