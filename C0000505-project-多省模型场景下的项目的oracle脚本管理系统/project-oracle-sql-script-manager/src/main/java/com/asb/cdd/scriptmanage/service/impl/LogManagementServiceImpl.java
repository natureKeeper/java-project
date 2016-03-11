package com.asb.cdd.scriptmanage.service.impl;

import com.asb.cdd.scriptmanage.dao.access.LogAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.ExecuteLog;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.LogCriteria;
import com.asb.cdd.scriptmanage.service.LogManagementService;
import com.asb.cdd.scriptmanage.service.entity.BigDataFsLocator;
import com.irm.system.authorization.vo.UserContext;
import com.irm.system.bigdata.service.BigDataAccessService;

public class LogManagementServiceImpl implements LogManagementService {
	
	private LogAccessService logAccessService;
	private BigDataAccessService<BigDataFsLocator> logBigDataAccessService;
	private String fileContentEncoding = "gbk";

	public void setLogAccessService(LogAccessService logAccessService) {
		this.logAccessService = logAccessService;
	}

	public void setLogBigDataAccessService(
			BigDataAccessService<BigDataFsLocator> logBigDataAccessService) {
		this.logBigDataAccessService = logBigDataAccessService;
	}

	public ExecuteLog loadLog(LogCriteria logCriteria, UserContext uc)
			throws Exception {
		ExecuteLog log = logAccessService.findOne(logCriteria, uc);
		if (null != log) {
			BigDataFsLocator locator = new BigDataFsLocator();
			locator.setPath(log.getLogFileLocation().replaceAll("\\\\", "\\\\"));
			String msg = logBigDataAccessService.loadAsString(locator, fileContentEncoding);
			log.setMessage(msg);
		}
		return log;
	}

	public ExecuteLog saveLog(ExecuteLog log, UserContext uc) throws Exception {
		String fileName = "taskId" + log.getTaskId() + "-scriptId" + log.getScriptId() + "-envId" + log.getEnvironmentId() + ".log";
		BigDataFsLocator locator = logBigDataAccessService.save(fileName, log.getMessage());
		log.setLogFileLocation(locator.getPath());
		return logAccessService.save(log, uc);
	}

	public String getFileContentEncoding() {
		return fileContentEncoding;
	}

	public void setFileContentEncoding(String fileContentEncoding) {
		this.fileContentEncoding = fileContentEncoding;
	}

}
