package com.asb.cdd.scriptmanage.service;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.irm.system.authorization.vo.UserContext;

public interface EnvironmentManagementService {

	/**
	 * 查询所有环境列表
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<Environment> queryAllEnvironments(UserContext uc) throws Exception;
	
	public Environment queryEnvironmentByCode(String code, UserContext uc) throws Exception;
}
