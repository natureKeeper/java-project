package com.asb.cdd.scriptmanage.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.irm.model.meta.constant.DictionaryConst;
import com.irm.model.system.User;
import com.irm.system.authorization.vo.UserContext;
import com.irm.system.usersession.service.UserSessionManagementService;
import com.irm.system.usersession.vo.UserSessionContext;
import common.util.Detect;

/**
 * 检查未执行，执行失败等异常的task和script，并通知管理员
 * @author Administrator
 *
 */
public class CheckAbnormalScriptTask extends TimerTask {

	private static final transient Log log = LogFactory.getLog(CheckAbnormalScriptTask.class);
	
	private TaskScriptManagementService taskScriptManagementService;
	private UserSessionManagementService userSessionManagementService;
	private MessageNotifyService messageNotifyService;
	
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
		
		Map<String, List<Script>> waitToExecMap = new HashMap<String, List<Script>>();
		Map<String, List<Script>> execFailMap = new HashMap<String, List<Script>>();
		
		StringBuffer sb = new StringBuffer();

		tasks = taskScriptManagementService.queryTasksNeedToExec(uc);
		if (Detect.notEmpty(tasks)) {
			sb.append("目前存在" + tasks.size() + "个任务需要执行\r");
		}
		
		{
			scripts = taskScriptManagementService.queryScriptsAnyEnvWaitingExec(uc);
			if (Detect.notEmpty(scripts)) {
				sb.append("目前存在" + scripts.size() + "个脚本等待执行\r");
				
				for (Script s : scripts) {
					String username = s.getTask().getUser().getUsername();
					List<Script> list = waitToExecMap.get(username);
					if (null == list) {
						list = new ArrayList<Script>();						
					}
					list.add(s);
					waitToExecMap.put(username, list);
				}
			}
			
			/*for (Map.Entry<String, List<Script>> entry : waitToExecMap.entrySet()) {
				String username = entry.getKey();
				List<Script> list = entry.getValue();
				Set<String> issueIds = new HashSet<String>();
				for (Script s : list) {
					issueIds.add(s.getTask().getIssueId());
				}
				StringBuffer sb1 = new StringBuffer();
				for (String s : issueIds) {
					sb1.append(s).append(",");
				}
				User user = userSessionManagementService.findUserByUsername(username);
				messageNotifyService.notify(user, "脚本系统定时汇报，你尚有以下MR的脚本没执行完毕\r" + sb1.toString(), uc);
			}*/
		}
		
		{
			scripts = taskScriptManagementService.queryScriptsAnyEnvExecFail(uc);
			for (Iterator<Script> it = scripts.iterator(); it.hasNext();) {
				Script s = it.next();
				if (DictScriptStatus.Status.DEPRECATED == s.getStatus()) {
					it.remove();
				}
			}
			if (Detect.notEmpty(scripts)) {
				sb.append("目前存在" + scripts.size() + "个脚本执行失败\r");

				for (Script s : scripts) {
					String username = s.getTask().getUser().getUsername();
					List<Script> list = execFailMap.get(username);
					if (null == list) {
						list = new ArrayList<Script>();						
					}
					list.add(s);
					execFailMap.put(username, list);
				}
			}
			
			for (Map.Entry<String, List<Script>> entry : execFailMap.entrySet()) {
				String username = entry.getKey();
				List<Script> list = entry.getValue();
				Set<String> issueIds = new HashSet<String>();
				for (Script s : list) {
					issueIds.add(s.getTask().getIssueId());
				}
				StringBuffer sb1 = new StringBuffer();
				for (String s : issueIds) {
					sb1.append(s).append(",");
				}
				User user = userSessionManagementService.findUserByUsername(username);
				messageNotifyService.notify(user, "脚本系统定时汇报，你有以下MR的脚本执行失败\r" + sb1.toString(), uc);
			}
		}
		
		scripts = taskScriptManagementService.queryScriptsAllEnvExecSuccess(uc);
		if (Detect.notEmpty(scripts)) {
			sb.append("目前存在" + scripts.size() + "个脚本等待确认成功\r");
		}
		if (0 < sb.length()) {
			messageNotifyService.notifyAdministrators(uc.getUser(), "脚本系统定时汇报\r" + sb.toString(), uc);
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

	public void setMessageNotifyService(MessageNotifyService messageNotifyService) {
		this.messageNotifyService = messageNotifyService;
	}

}
