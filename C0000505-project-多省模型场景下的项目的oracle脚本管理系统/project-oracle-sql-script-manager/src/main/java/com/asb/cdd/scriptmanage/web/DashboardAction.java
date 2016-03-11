package com.asb.cdd.scriptmanage.web;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.service.BackgroundExecutor;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.GlobalStatus;
import com.irm.model.system.User;
import com.irm.web.system.common.action.AbstractAction;
import common.util.Detect;

public class DashboardAction extends AbstractAction {
	
	private static final transient Log log = LogFactory.getLog(DashboardAction.class);

	/**
	 * 
	 */
	private static final long serialVersionUID = -7956088208914284058L;
	
	private BackgroundExecutor backgroundExecutor;
	private TaskScriptManagementService taskScriptManagementService;
	
	private String autoExecThreadStatus;
	
	private String submitScriptPermission;
	
	private MessageNotifyService messageNotifyService;
	
	/**
	 * 最近一次脚本执行状态
	 */
	private String latestExecutionStatus;
	
	public String execute() throws Exception {
		initPage();
		return SUCCESS;
	}
	
	public String testQqMsg() throws Exception {
		initPage();

		user = getUserContext().getUser();
		messageNotifyService.notify(user, "这是脚本执行系统的qq消息测试\r谢谢", this.getUserContext());
//		messageNotifyService.notifyAdministrators(user, "这是脚本执行系统的qq消息测试\r谢谢", this.getUserContext());
		return SUCCESS;
	}
	
	public String manualExec() throws Exception {		
		initPage();

		/*
		 * 扫描任务
		 * 锁住提交权限
		 * 扫描未执行和部分脚本执行的任务
		 * 加载这些任务下未执行，执行中的脚本
		 * 开放提交权限
		 */
		boolean allow = taskScriptManagementService.isAllowSubmitScript();
		taskScriptManagementService.setAllowSubmitScript(false);
		List<Task> tasks = taskScriptManagementService.queryTasksNeedToExec(this.getUserContext());
		if (null == tasks) {
			taskScriptManagementService.setAllowSubmitScript(allow);
			return SUCCESS;
		}
		List<Script> scripts = taskScriptManagementService.queryScriptsNeedToExec(tasks, this.getUserContext());
		
		taskScriptManagementService.setAllowSubmitScript(allow);

		if (Detect.notEmpty(scripts)) {
			List<String> logs = new ArrayList<String>();
			taskScriptManagementService.executeScriptNormally(scripts, logs, this.getUserContext());
		}
		return SUCCESS;
	}
	
	/**
	 * 改变提交脚本的开关，禁止或允许
	 * @return
	 * @throws Exception
	 */
	public String alterSubmitScriptAuthority() throws Exception {
		initPage();
		taskScriptManagementService.setAllowSubmitScript(!taskScriptManagementService.isAllowSubmitScript());
		log.error("设置提交脚本权限为" + taskScriptManagementService.isAllowSubmitScript() + ", 操作人=" + getUserContext().getUser().getName());
		return SUCCESS;
	}
	
	public void setTaskScriptManagementService(
			TaskScriptManagementService taskScriptManagementService) {
		this.taskScriptManagementService = taskScriptManagementService;
	}

	public String switchExecThreadStatus() throws Exception {
		backgroundExecutor.setTurnOn(!backgroundExecutor.isTurnOn());
		initPage();
		return SUCCESS;
	}
	
	public String reflashThreadStatus() throws Exception {
		initPage();
		return SUCCESS;
	}
	
	protected void initPage() {
		if (backgroundExecutor.isTurnOn()) {
			if (backgroundExecutor.isRunning()) {
				autoExecThreadStatus = "正在执行脚本";
			} else {
				autoExecThreadStatus = "正常运行中，等待下一次自动扫描";
			}
		} else {
			if (backgroundExecutor.isRunning()) {
				autoExecThreadStatus = "已收到暂停信号，但还有脚本在执行，请稍候刷新";
			} else {
				autoExecThreadStatus = "已暂停";
			}
		}
		
		latestExecutionStatus = GlobalStatus.latestExecutionStatus;
	}
	
	protected void getSubmitScriptPermissionStatus() {
		if (taskScriptManagementService.isAllowSubmitScript()) {
			submitScriptPermission = "允许提交脚本";
		} else {
			submitScriptPermission = "禁止提交脚本";
		}
	}

	public BackgroundExecutor getBackgroundExecutor() {
		return backgroundExecutor;
	}

	public void setBackgroundExecutor(BackgroundExecutor backgroundExecutor) {
		this.backgroundExecutor = backgroundExecutor;
	}

	public String getAutoExecThreadStatus() {
		return autoExecThreadStatus;
	}

	public void setAutoExecThreadStatus(String autoExecThreadStatus) {
		this.autoExecThreadStatus = autoExecThreadStatus;
	}

	public String getSubmitScriptPermission() {
		return submitScriptPermission;
	}

	public void setSubmitScriptPermission(String submitScriptPermission) {
		this.submitScriptPermission = submitScriptPermission;
	}

	public void setMessageNotifyService(MessageNotifyService messageNotifyService) {
		this.messageNotifyService = messageNotifyService;
	}

	public TaskScriptManagementService getTaskScriptManagementService() {
		return taskScriptManagementService;
	}

	public String getLatestExecutionStatus() {
		return latestExecutionStatus;
	}
}
