package com.asb.cdd.scriptmanage.service.impl;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.EnvironmentAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.EnvironmentCriteria;
import com.asb.cdd.scriptmanage.service.EnvironmentManagementService;
import com.irm.system.authorization.vo.UserContext;

public class EnvironmentManagementServiceImpl implements
		EnvironmentManagementService {

	public List<Environment> queryAllEnvironments(UserContext uc)
			throws Exception {
		return environmentAccessService.findAll(uc);
	}

	private EnvironmentAccessService environmentAccessService;

	public void setEnvironmentAccessService(
			EnvironmentAccessService environmentAccessService) {
		this.environmentAccessService = environmentAccessService;
	}

	public Environment queryEnvironmentByCode(String code, UserContext uc)
			throws Exception {
		EnvironmentCriteria criteria = new EnvironmentCriteria();
		criteria.setCode(code);
		return environmentAccessService.findOne(criteria, uc);
	}
}
