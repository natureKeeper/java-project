package com.asb.cdd.scriptmanage.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.DictTaskStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.TaskCriteria;
import com.asb.cdd.scriptmanage.service.TaskManagementService;
import com.asb.cdd.scriptmanage.service.util.TaskStatusUtil;
import com.irm.system.authorization.vo.UserContext;

public class TaskManagementServiceImpl implements TaskManagementService {

	public void setTaskStatusIsAllConfirmed(Task task, UserContext uc)
			throws IllegalStateException {
		if (DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS == task.getStatus()
				|| DictTaskStatus.Status.EXEC_PARTIAL_SCRIPTS == task.getStatus()
				|| DictTaskStatus.Status.EXEC_ALL_SCRIPTS_SUCCESS == task.getStatus()) {
			task.setStatus(DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS);
			taskAccessService.update(task, uc);
		} else {
			throw new IllegalStateException("任务状态不允许转换到全部确认成功状态, taskName=" + task.getName() + ", taskStatus=" + TaskStatusUtil.unmarshal(task.getStatus()));
		}		
	}

	public void setTaskStatusIsAllExecuted(Task task, UserContext uc)
			throws IllegalStateException {
		if (DictTaskStatus.Status.WAIT_EXEC == task.getStatus()
				|| DictTaskStatus.Status.EXEC_PARTIAL_SCRIPTS == task.getStatus()
				|| DictTaskStatus.Status.EXEC_ALL_SCRIPTS_SUCCESS == task.getStatus()) {
			task.setStatus(DictTaskStatus.Status.EXEC_ALL_SCRIPTS_SUCCESS);
			taskAccessService.update(task, uc);
		} else {
			throw new IllegalStateException("任务状态不允许转换到全部执行成功状态, taskName=" + task.getName() + ", taskStatus=" + TaskStatusUtil.unmarshal(task.getStatus()));
		}
	}

	public void setTaskStatusIsNotExec(Task task, UserContext uc)
			throws IllegalStateException {
		if (DictTaskStatus.Status.WAIT_EXEC != task.getStatus()) {
			task.setStatus(DictTaskStatus.Status.WAIT_EXEC);
			taskAccessService.update(task, uc);
		}
	}

	public void setTaskStatusIsPartiallyExecuted(Task task, UserContext uc)
			throws IllegalStateException {
		if (DictTaskStatus.Status.WAIT_EXEC == task.getStatus()
				|| DictTaskStatus.Status.EXEC_PARTIAL_SCRIPTS == task.getStatus()) {
			task.setStatus(DictTaskStatus.Status.EXEC_PARTIAL_SCRIPTS);
			taskAccessService.update(task, uc);
		} else {
			throw new IllegalStateException("任务状态不允许转换到部分执行状态, taskName=" + task.getName() + ", taskStatus=" + TaskStatusUtil.unmarshal(task.getStatus()));
		}
	}
	
	public void setTaskStatusIsReleasePartially(Task task, UserContext uc)
		throws IllegalStateException {
		if (DictTaskStatus.Status.RELEASE_SUCCESSFUL == task.getStatus()) {
			task.setStatus(DictTaskStatus.Status.RELEASE_PARTIAL_DESTINATION);
			taskAccessService.update(task, uc);
		} else {
			throw new IllegalStateException("任务状态不允许转换到部分发布状态, taskName=" + task.getName() + ", taskStatus=" + TaskStatusUtil.unmarshal(task.getStatus()));
		}
	}
	
	public void setTaskStatusIsReleaseSuccessfully(Task task, UserContext uc)
		throws IllegalStateException {
		if (DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS == task.getStatus()
				|| DictTaskStatus.Status.RELEASE_PARTIAL_DESTINATION == task.getStatus()
				|| DictTaskStatus.Status.RELEASE_SUCCESSFUL == task.getStatus()) {
			task.setStatus(DictTaskStatus.Status.RELEASE_SUCCESSFUL);
			taskAccessService.update(task, uc);
		} else {
			throw new IllegalStateException("任务状态不允许转换到已发布状态, taskName=" + task.getName() + ", taskStatus=" + TaskStatusUtil.unmarshal(task.getStatus()));
		}
	}
	
	private TaskAccessService taskAccessService;

	public void setTaskAccessService(TaskAccessService taskAccessService) {
		this.taskAccessService = taskAccessService;
	}

	private DictTaskStatusAccessService dictTaskStatusAccessService;
	public List<DictTaskStatus> queryAllTaskStatus(UserContext uc)
			throws Exception {
		return dictTaskStatusAccessService.findAll(uc);
	}

	public void setDictTaskStatusAccessService(
			DictTaskStatusAccessService dictTaskStatusAccessService) {
		this.dictTaskStatusAccessService = dictTaskStatusAccessService;
	}

	public List<Task> queryTaskByStatus(int status, UserContext uc)
			throws Exception {
		if (0 < status) {
			TaskCriteria criteria = new TaskCriteria();
			criteria.setStatus(status);
			return taskAccessService.find(criteria, uc);
		} else {
			return new ArrayList<Task>();
		}
	}

	public List<Task> queryTasksByIssueIds(String[] issueIds, UserContext uc) throws Exception {
		return taskAccessService.findByIssueIds(issueIds, uc);
	}
	
	public void setTaskStatusIsDeprecated(Task task, UserContext uc) throws Exception {
		task.setStatus(DictTaskStatus.Status.DEPRECATED);
		taskAccessService.update(task, uc);
	}

}
