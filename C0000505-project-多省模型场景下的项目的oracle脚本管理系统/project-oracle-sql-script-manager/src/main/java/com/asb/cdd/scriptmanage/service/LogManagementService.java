package com.asb.cdd.scriptmanage.service;

import com.asb.cdd.scriptmanage.dao.access.model.ExecuteLog;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.LogCriteria;
import com.irm.system.authorization.vo.UserContext;

public interface LogManagementService {

	public ExecuteLog saveLog(ExecuteLog log, UserContext uc) throws Exception;
	
	public ExecuteLog loadLog(LogCriteria logCriteria, UserContext uc) throws Exception;
}
