package com.asb.cdd.scriptmanage.service;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.irm.system.authorization.vo.UserContext;

public interface TaskManagementService {
	public void setTaskStatusIsNotExec(Task task, UserContext uc) throws IllegalStateException;
	
	public void setTaskStatusIsPartiallyExecuted(Task task, UserContext uc) throws IllegalStateException;
	
	public void setTaskStatusIsAllExecuted(Task task, UserContext uc) throws IllegalStateException;
	
	public void setTaskStatusIsAllConfirmed(Task task, UserContext uc) throws IllegalStateException;
	
	public void setTaskStatusIsReleaseSuccessfully(Task task, UserContext uc) throws IllegalStateException;
	
	public void setTaskStatusIsReleasePartially(Task task, UserContext uc) throws IllegalStateException;
	
	/**
	 * 查询所有的task状态列表
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<DictTaskStatus> queryAllTaskStatus(UserContext uc) throws Exception;
	
	/**
	 * 根据task状态查询符合条件的task
	 * @param status
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<Task> queryTaskByStatus(int status, UserContext uc) throws Exception;
	
	/**
	 * 根据issue id列表查询task
	 * @param issueIds
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<Task> queryTasksByIssueIds(String[] issueIds, UserContext uc) throws Exception;
	
	/**
	 * 设置任务状态为废弃
	 * @param task
	 * @param uc
	 * @throws Exception
	 */
	public void setTaskStatusIsDeprecated(Task task, UserContext uc) throws Exception;
}