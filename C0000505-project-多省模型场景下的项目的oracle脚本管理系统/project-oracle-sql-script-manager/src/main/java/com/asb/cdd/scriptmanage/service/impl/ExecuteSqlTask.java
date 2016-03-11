package com.asb.cdd.scriptmanage.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.irm.model.meta.constant.DictionaryConst;
import com.irm.system.authorization.vo.UserContext;
import com.irm.system.usersession.service.UserSessionManagementService;
import com.irm.system.usersession.vo.UserSessionContext;
import common.util.Detect;

public class ExecuteSqlTask extends TimerTask {

	private static final transient Log log = LogFactory.getLog(ExecuteSqlTask.class);
	
	private TaskScriptManagementService taskScriptManagementService;
	private UserSessionManagementService userSessionManagementService;
	
	
	private String username;
	private String password;

	protected UserContext login() throws Exception {
		UserSessionContext userSessionContext = userSessionManagementService.login(username, password, null, null, DictionaryConst.USERSESSION_ACCESSTYPE.WEB);
		return userSessionContext.getUserContext();
	}
	
	protected void service() throws Exception {
		List<Task> tasks = null;
		List<Script> scripts = null;
		UserContext uc = login();
		
		/*
		 * 扫描任务
		 * 锁住提交权限
		 * 扫描未执行和部分脚本执行的任务
		 * 加载这些任务下未执行，执行中的脚本
		 * 开放提交权限
		 */
		boolean allow = taskScriptManagementService.isAllowSubmitScript();
		taskScriptManagementService.setAllowSubmitScript(false);
		tasks = taskScriptManagementService.queryTasksNeedToExec(uc);
		if (null == tasks) {
			taskScriptManagementService.setAllowSubmitScript(allow);
			return;
		}
		scripts = taskScriptManagementService.queryScriptsNeedToExec(tasks, uc);
		
		taskScriptManagementService.setAllowSubmitScript(allow);

		if (Detect.notEmpty(scripts)) {
			List<String> logs = new ArrayList<String>();
			taskScriptManagementService.executeScriptNormally(scripts, logs, uc);
		}
	}
	
	@Override
	public void run() {
		log.error(DateUtil.getCurrentDate() + " running");
		try {
			service();
		} catch (Exception e) {
			log.error(e, e);
		}
	}

	public void setTaskScriptManagementService(TaskScriptManagementService taskScriptManagementService) {
		this.taskScriptManagementService = taskScriptManagementService;
	}

	public void setUserSessionManagementService(UserSessionManagementService userSessionManagementService) {
		this.userSessionManagementService = userSessionManagementService;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
