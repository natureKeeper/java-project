package com.asb.cdd.scriptmanage.service.impl;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.DictEnvironmentStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.EnvironmentAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptEnvironmentRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.ExecuteLog;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.LogCriteria;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.ScriptEnvironmentRelationCriteria;
import com.asb.cdd.scriptmanage.service.LogManagementService;
import com.asb.cdd.scriptmanage.service.ScriptEnvironmentRelationManagementService;
import com.irm.system.authorization.vo.UserContext;

public class ScriptEnvironmentRelationManagementServiceImpl implements
		ScriptEnvironmentRelationManagementService {
	
	private ScriptEnvironmentRelationAccessService scriptEnvironmentRelationAccessService;
	private LogManagementService logManagementService;
	private EnvironmentAccessService environmentAccessService;

	public ScriptEnvironmentRelation cascadeQueryById(long id, UserContext uc)
			throws Exception {
		ScriptEnvironmentRelation relation = scriptEnvironmentRelationAccessService.findById(id, uc);
		if (null != relation) {
			long logId = relation.getLatestLogId();
			if (0 < logId) {
				LogCriteria logCriteria = new LogCriteria();
				logCriteria.setId(logId);
				ExecuteLog log = logManagementService.loadLog(logCriteria, uc);				
				relation.setLastLog(log);
			}
			
			if (0 < relation.getEnvironmentId()) {
				Environment environment = environmentAccessService.findById(relation.getEnvironmentId(), uc);
				relation.setEnvironment(environment);
			}			
		}
		return relation;
	}

	public void setScriptEnvironmentRelationAccessService(
			ScriptEnvironmentRelationAccessService scriptEnvironmentRelationAccessService) {
		this.scriptEnvironmentRelationAccessService = scriptEnvironmentRelationAccessService;
	}

	public void setLogManagementService(LogManagementService logManagementService) {
		this.logManagementService = logManagementService;
	}

	public void setEnvironmentAccessService(
			EnvironmentAccessService environmentAccessService) {
		this.environmentAccessService = environmentAccessService;
	}

	private DictEnvironmentStatusAccessService dictEnvironmentStatusAccessService;
	public List<DictEnvironmentStatus> queryAllScriptEnvironmentStatus(
			UserContext uc) throws Exception {
		return dictEnvironmentStatusAccessService.findAll(uc);
	}

	public void setDictEnvironmentStatusAccessService(
			DictEnvironmentStatusAccessService dictEnvironmentStatusAccessService) {
		this.dictEnvironmentStatusAccessService = dictEnvironmentStatusAccessService;
	}

	public List<ScriptEnvironmentRelation> queryAllScriptEnvironmentRelationByStatus(
			int status, UserContext uc) throws Exception {
		ScriptEnvironmentRelationCriteria criteria = new ScriptEnvironmentRelationCriteria();
		criteria.setStatus(status);
		return scriptEnvironmentRelationAccessService.find(criteria, uc);
	}

	public void forceUpdateScriptEnvironmentRelationByStatus(
			ScriptEnvironmentRelation relation, int status, UserContext uc)
			throws Exception {
		relation.setStatus(status);
		scriptEnvironmentRelationAccessService.update(relation, uc);
	}

}
