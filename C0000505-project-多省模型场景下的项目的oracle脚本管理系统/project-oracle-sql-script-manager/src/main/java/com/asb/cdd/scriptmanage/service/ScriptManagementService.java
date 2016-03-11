package com.asb.cdd.scriptmanage.service;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.irm.system.authorization.vo.UserContext;

public interface ScriptManagementService {
	public void setScriptStatusIsNotExec(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsExecFail(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsExecuting(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsAllBranchExecSuccessfully(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsAllEnvExecSuccessfully(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsConfirmSuccessfully(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsReleasePartially(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsReleaseSuccessfully(Script script, UserContext uc) throws IllegalStateException;
	
	public void setScriptStatusIsDeprecated(Script script, UserContext uc) throws IllegalStateException;
	
	public Script queryScriptById(long id, UserContext uc);
	
	/**
	 * 查询所有的script状态列表
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<DictScriptStatus> queryAllScriptStatus(UserContext uc) throws Exception;
	
	/**
	 * 根据script状态查询符合条件的script
	 * @param status
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<Script> queryScriptsByStatus(int status, UserContext uc) throws Exception;
	
	
	/**
	 * 根据多个条件查询脚本
	 * @param taskStatus
	 * @param scriptStatus
	 * @param environmentStatus
	 * @param environmentCode
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<Script> findScriptsByConditions(String issueId, int taskStatus, int scriptStatus, int environmentStatus, String environmentCode, UserContext uc) throws Exception;
	
	/**
	 * 更新脚本内容
	 * @param script
	 * @param uc
	 * @throws Exception
	 */
	public void updateScriptContent(Script script, UserContext uc) throws Exception;
}
