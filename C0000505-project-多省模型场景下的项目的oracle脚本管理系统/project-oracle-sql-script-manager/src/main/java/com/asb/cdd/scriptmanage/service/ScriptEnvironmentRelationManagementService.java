package com.asb.cdd.scriptmanage.service;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.irm.system.authorization.vo.UserContext;

public interface ScriptEnvironmentRelationManagementService {
	
	/**
	 * 查询脚本某环境执行状态，递归带出关联的脚本，日志等信息
	 * @param taskIds
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public ScriptEnvironmentRelation cascadeQueryById(long id, UserContext uc) throws Exception;
	
	/**
	 * 查询所有的脚本环境执行状态列表
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<DictEnvironmentStatus> queryAllScriptEnvironmentStatus(UserContext uc) throws Exception;
	
	/**
	 * 根据状态查询
	 * @param status
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<ScriptEnvironmentRelation> queryAllScriptEnvironmentRelationByStatus(int status, UserContext uc) throws Exception;
	
	/**
	 * 强制更新脚本环境状态
	 * @param relation
	 * @param status
	 * @param uc
	 * @throws Exception
	 */
	public void forceUpdateScriptEnvironmentRelationByStatus(ScriptEnvironmentRelation relation, int status, UserContext uc) throws Exception;
}
