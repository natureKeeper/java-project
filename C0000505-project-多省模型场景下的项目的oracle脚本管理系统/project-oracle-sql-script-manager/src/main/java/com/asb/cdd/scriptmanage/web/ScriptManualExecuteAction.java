package com.asb.cdd.scriptmanage.web;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.service.EnvironmentManagementService;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.ScriptEnvironmentRelationManagementService;
import com.asb.cdd.scriptmanage.service.ScriptManagementService;
import com.asb.cdd.scriptmanage.service.TaskManagementService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.asb.cdd.scriptmanage.service.util.EnvironmentStatusUtil;
import com.asb.cdd.scriptmanage.service.util.GlobalStatus;
import com.asb.cdd.scriptmanage.service.util.ScriptStatusUtil;
import com.asb.cdd.scriptmanage.web.util.DictionaryViewHelper;
import com.irm.web.system.common.action.AbstractAction;
import common.util.Detect;

/**
 * @author Administrator
 *
 */
public class ScriptManualExecuteAction extends AbstractAction {
	
	private static final transient Log log = LogFactory.getLog(ScriptManualExecuteAction.class);

	private TaskScriptManagementService taskScriptManagementService;
	private TaskManagementService taskManagementService;
	
	private DictionaryViewHelper dictionaryViewHelper;
	
	private ScriptManagementService scriptManagementService;
	
	private ScriptEnvironmentRelationManagementService scriptEnvironmentRelationManagementService;
	
	private EnvironmentManagementService environmentManagementService;
	
	private MessageNotifyService messageNotifyService;
	
	private List<Script> scripts;
	
	private List<Environment> environments;
	
	private List<DictTaskStatus> taskStatuses;
	private List<DictScriptStatus> scriptStatuses;
	private List<DictEnvironmentStatus> environmentStatuses;
	
	public static final String EXEC_SUCCESS = "executeSuccefully";
	
	/**
	 * 页面显示的报表名称
	 */
	private String reportTitle;
	
	private String errorMessage;
	
	private String memo;
	
	/**
	 * 返回查询脚本相关的MR列表，供QA去MR系统统计
	 */
	private Set<String> resultIssueIds;
	
	/**
	 * 脚本id，比如查询脚本内容时用的
	 */
	private long scriptId;
	private Script script;
	private boolean scriptCanModify;
	
	/**
	 * 脚本环境关系的id，查询脚本在某环境执行状态详情时用到
	 */
	private long scriptEnvironmentId;
	private ScriptEnvironmentRelation scriptEnvironmentRelation;
	
	/**
	 * 最近一次脚本执行状态
	 */
	private String latestExecutionStatus;
	
	private void initPage() throws Exception {
		environments = environmentManagementService.queryAllEnvironments(this.getUserContext());
		taskStatuses = taskManagementService.queryAllTaskStatus(this.getUserContext());
		dictionaryViewHelper.sortDictionaryByOrdinal(taskStatuses);
		scriptStatuses = scriptManagementService.queryAllScriptStatus(this.getUserContext());
		dictionaryViewHelper.sortDictionaryByOrdinal(scriptStatuses);
		environmentStatuses = scriptEnvironmentRelationManagementService.queryAllScriptEnvironmentStatus(this.getUserContext());
		dictionaryViewHelper.sortDictionaryByOrdinal(environmentStatuses);
		
		latestExecutionStatus = GlobalStatus.latestExecutionStatus;
		
		reportTitle = "";
	}

	/* 返回脚本管理页面
	 * @see com.irm.web.system.common.action.AbstractAction#execute()
	 */
	public String execute() throws Exception {
		initPage();
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
		reportTitle = "";
		return SUCCESS;
	}
	
	/**
	 * 查询所有脚本，仅用作调试用
	 * @return
	 * @throws Exception
	 */
	public String queryAllScripts() throws Exception {
		initPage();
		scripts = taskScriptManagementService.queryAllScripts(this.getUserContext());
		if (Detect.notEmpty(scripts)) {
			Collections.sort(scripts, new Comparator<Script>() {

				public int compare(Script o1, Script o2) {
					if (o1.getId() > o2.getId()) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		reportTitle = "所有脚本列表";
		resultIssueIds = collectIssueIdsFromScripts(scripts);
		return SUCCESS;
	}
	
	protected Set<String> collectIssueIdsFromScripts(List<Script> scripts) {
		Set<String> issueIds = new HashSet<String>();
		if (Detect.notEmpty(scripts)) {
			for (Script s : scripts) {
				issueIds.add(s.getTask().getIssueId());
			}
		}		
		return issueIds;
	}
	
	private String taskStatusToQuery;
	private String scriptStatusToQuery;
	private String environmentCodeToQuery;
	private String environmentStatusToQuery;
	private String issueIdToQuery;
	
	/**
	 * 根据条件查询脚本
	 * @return
	 * @throws Exception
	 */
	public String queryScriptsByConditions() throws Exception {
		initPage();
		issueIdToQuery = issueIdToQuery.toUpperCase();
		scripts = scriptManagementService.findScriptsByConditions(issueIdToQuery, Integer.parseInt(taskStatusToQuery),
				Integer.parseInt(scriptStatusToQuery), Integer.parseInt(environmentStatusToQuery), 
				environmentCodeToQuery, this.getUserContext());
		
		scripts = removeDeprecatedScripts(scripts);
		
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		reportTitle = "根据条件查询的脚本列表";
		resultIssueIds = collectIssueIdsFromScripts(scripts);
		return SUCCESS;
	}
	
	private List<Script> removeDeprecatedScripts(List<Script> scripts) {
		if (Detect.notEmpty(scripts)) {
			Iterator<Script> it = scripts.iterator();
			while (it.hasNext()) {
				Script script = it.next();
				if (DictScriptStatus.Status.DEPRECATED == script.getStatus()) {
					it.remove();
				}
			}
		}		
		return scripts;
	}
	
	/**
	 * 过滤掉没在任何分支上执行的脚本
	 * @param scripts
	 * @return
	 */
	private List<Script> removeNonBranchExecutedScripts(List<Script> scripts) {
		if (Detect.notEmpty(scripts)) {
			Iterator<Script> it = scripts.iterator();
			boolean finded = false;
			while (it.hasNext()) {
				Script script = it.next();
				finded = false;
				List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
				for (ScriptEnvironmentRelation relation : relations) {
					Environment env = relation.getEnvironment();
					if (env.isBranch()) {
						finded = true;
						break;
					}
				}
				if (!finded) {
					it.remove();
				}
			}
		}		
		return scripts;
	}
	
	/**
	 * 查询任一环境未执行的脚本,以便手工执行
	 * @return
	 * @throws Exception
	 */
	public String queryScriptsAnyEnvWaitingExec() throws Exception {
		initPage();
		scripts = taskScriptManagementService.queryScriptsAnyEnvWaitingExec(this.getUserContext());
		
		scripts = removeDeprecatedScripts(scripts);
		
		if (Detect.notEmpty(scripts)) {
			Collections.sort(scripts, new Comparator<Script>() {

				public int compare(Script o1, Script o2) {
					if (o1.getId() > o2.getId()) {
						return 1;
					} else {
						return -1;
					}
				}			
			});
		}
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		reportTitle = "待手工执行的脚本列表";
		resultIssueIds = collectIssueIdsFromScripts(scripts);
		return SUCCESS;
	}
	
	/**
	 * 查询所有环境执行成功的脚本,以便手工确认成功
	 * @return
	 * @throws Exception
	 */
	public String queryScriptsAllEnvExecSuccess() throws Exception {
		initPage();
		scripts = taskScriptManagementService.queryScriptsAllEnvExecSuccess(this.getUserContext());
		
		scripts = removeDeprecatedScripts(scripts);
		
		if (Detect.notEmpty(scripts)) {
			Collections.sort(scripts, new Comparator<Script>() {

				public int compare(Script o1, Script o2) {
					if (o1.getId() > o2.getId()) {
						return 1;
					} else {
						return -1;
					}
				}			
			});
		}
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		reportTitle = "待确认成功的脚本列表";
		resultIssueIds = collectIssueIdsFromScripts(scripts);
		return SUCCESS;
	}
	
	/**
	 * 查询确认成功或部分发布的脚本,以便发布
	 * @return
	 * @throws Exception
	 */
	public String queryScriptsConfirmSuccessOrPartiallyRelease() throws Exception {
		initPage();
		scripts = taskScriptManagementService.queryScriptsConfirmSuccessOrPartiallyRelease(this.getUserContext());
		
		scripts = removeDeprecatedScripts(scripts);
		
		scripts = removeNonBranchExecutedScripts(scripts);
		
		if (Detect.notEmpty(scripts)) {
			Collections.sort(scripts, new Comparator<Script>() {

				public int compare(Script o1, Script o2) {
					if (o1.getId() > o2.getId()) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		reportTitle = "待发布的脚本列表";
		resultIssueIds = collectIssueIdsFromScripts(scripts);
		return SUCCESS;
	}

	
	/**
	 * 查询任一环境执行失败的脚本,以便修正再执行
	 * @return
	 * @throws Exception
	 */
	public String queryScriptsAnyEnvExecFail() throws Exception {
		initPage();
		scripts = taskScriptManagementService.queryScriptsAnyEnvExecFail(this.getUserContext());
		
		scripts = removeDeprecatedScripts(scripts);
		
		if (Detect.notEmpty(scripts)) {
			Collections.sort(scripts, new Comparator<Script>() {

				public int compare(Script o1, Script o2) {
					if (o1.getId() > o2.getId()) {
						return 1;
					} else {
						return -1;
					}
				}			
			});
		}
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		reportTitle = "执行失败的脚本列表";
		resultIssueIds = collectIssueIdsFromScripts(scripts);
		return SUCCESS;
	}
	
	private String selectedScriptIds;
	
	/**
	 * 要执行脚本的环境的编码
	 */
	private String toBeExecEnvironmentCode;
	
	/**
	 * 把选中的环境未执行或执行失败的脚本执行，执行顺序为按脚本id排序
	 * @return
	 * @throws Exception
	 */
	public String executeScriptOnEnvironment() throws Exception {
		initPage();
		long[] scriptIds = this.convertSelectedScriptIds();
		if (!Detect.notEmpty(scriptIds)) {
			errorMessage = "没有选中脚本，无法执行";
			return ERROR;
		}
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(scriptIds, this.getUserContext());
		
		List<String> logs = new ArrayList<String>();
		taskScriptManagementService.executeScriptOnEnvironment(toBeExecEnvironmentCode, scripts, logs, this.getUserContext());
		reportTitle = "";
		
		StringBuffer sb = new StringBuffer();
		for (String log : logs) {
			sb.append(log).append("\r\n");
		}
		if (0 < sb.length()) {
			errorMessage = sb.toString();
		} else {
			errorMessage = "没有执行脚本";
		}
		
		return "executeSuccefully";
	}
	
	/**
	 * 查询用户选中的那些脚本所属的任务，如果用户没选中任务下所有脚本，则报错
	 * @return
	 * @throws Exception
	 */
	private List<Task> findTasksOfAllSelectedScripts() throws Exception {
		long[] scriptIds = this.convertSelectedScriptIds();
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(scriptIds, this.getUserContext());
		
		long[] taskIds = taskScriptManagementService.collectTaskIdsOfScripts(scripts);
		List<Task> tasks = taskScriptManagementService.cascadeQueryTasks(taskIds, this.getUserContext());
		long[] allScriptIdsInTasks = taskScriptManagementService.collectScriptIdsOfTasks(tasks);
		if (scriptIds.length != allScriptIdsInTasks.length) {
			throw new Exception("验证失败");
		}
		return tasks;
	}
	/**
	 * 把选中的整体执行成功的脚本和所属任务设置为验证成功状态
	 * （仅在要执行的分支都执行成功或不需要执行时才能把脚本设为验证成功，仅在所有脚本都验证成功才能把任务设为验证成功）
	 * 没选中任务下所有脚本则报错
	 * @return
	 * @throws Exception
	 */
	public String updateScriptStatusToConfirmSuccess() throws Exception {
		initPage();
		List<Task> tasks = null;
		try {
			tasks = findTasksOfAllSelectedScripts();
		} catch (Exception e) {
			errorMessage = "必须选中任务下所有脚本才能更新为确认成功状态";
			return ERROR;
		}
		
		StringBuffer sbErrorLog = new StringBuffer();
		taskScriptManagementService.updateScriptStatusToConfirmSuccess(tasks, sbErrorLog, this.getUserContext());
		
		if (0 < sbErrorLog.length()) {
			errorMessage = sbErrorLog.toString();
			return ERROR;
		}

		reportTitle = "";
		errorMessage = "执行成功";
		return ERROR;
	}
	
	private String environmentCodeForceToUpdate;
	private String environmentStatusForceToUpdate;
	/**
	 * 强制修改任务脚本的某个环境的执行状态
	 * @return
	 * @throws Exception
	 */
	public String forceUpdateEnvironmentStatus() throws Exception {
		initPage();
		long[] scriptIds = this.convertSelectedScriptIds();
		if (0 >= scriptIds.length) {
			errorMessage = "请选中一条记录进行强制修改";
			return ERROR;
		}
		if (1 < scriptIds.length) {
			errorMessage = "一次只能选中一条记录进行强制修改";
			return ERROR;
		}
		int status = Integer.parseInt(environmentStatusForceToUpdate);
		if (0 >= status) {
			errorMessage = "目标状态的字典值不对";
			return ERROR;
		}
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(scriptIds, this.getUserContext());
		if (0 >= scripts.size()) {
			errorMessage = "根据scriptId=" + scriptIds[0] + "查不到脚本，请检查数据";
			return ERROR;
		}
		if (1 < scripts.size()) {
			errorMessage = "根据scriptId=" + scriptIds[0] + "查出多条脚本，请检查数据";
			return ERROR;
		}
		
		boolean finded = false;
		Script s = scripts.get(0);
		for (ScriptEnvironmentRelation relation : s.getEnvironmentRelations()) {
			if (relation.getEnvironment().getCode().equals(environmentCodeForceToUpdate)) {
				scriptEnvironmentRelationManagementService.forceUpdateScriptEnvironmentRelationByStatus(relation, status, this.getUserContext());
				finded = true;
				break;
			}
		}

		if (finded) {
			long[] taskIds = taskScriptManagementService.collectTaskIdsOfScripts(scripts);
			List<Task> tasks = taskScriptManagementService.cascadeQueryTasks(taskIds, this.getUserContext());
			taskScriptManagementService.adjustTaskScriptEnvironmentStatus(tasks, this.getUserContext());
		} else {
			errorMessage = "脚本找不到要更新的环境，脚本名称=" + s.getName() + "，环境编码=" + environmentCodeForceToUpdate;
			return ERROR;
		}

		errorMessage = "执行成功";
		return ERROR;
	}
	
	/**
	 * 把选中脚本和任务设置为部分发布状态，同时要求更新备注（仅在脚本状态为已发布时）
	 * 没选中任务下所有脚本则报错
	 * @return
	 * @throws Exception
	 */
	public String updateScriptStatusToPartialRelease() throws Exception {
		initPage();
		List<Task> tasks = null;
		try {
			tasks = findTasksOfAllSelectedScripts();
		} catch (Exception e) {
			errorMessage = "必须选中任务下所有脚本才能更新为部分发布状态";
			return ERROR;
		}
		
		taskScriptManagementService.updateScriptStatusToPartialRelease(tasks, memo, this.getUserContext());
		
		reportTitle = "";
		return SUCCESS;
	}
	
	private String srcEnvironmentCode;
	private String destEnvironmentCode;
	/**
	 * 同步源环境到目的环境（比如在开新分支情况下或要先在主干验证再在分支执行情况下使用，把主干执行成功，分支未执行的执行）
	 * 没选中任务下所有脚本则报错
	 * @return
	 * @throws Exception
	 */
	public String synchronizeSrcEnvToDectEnv() throws Exception {
		initPage();
		if (srcEnvironmentCode.equals(destEnvironmentCode)) {
			errorMessage = "源环境" + srcEnvironmentCode + "和目的环境" + destEnvironmentCode + "不能相同";
			return ERROR;
		}
		
		try {
			List<Task> tasks = findTasksOfAllSelectedScripts();
		} catch (Exception e) {
			errorMessage = "必须选中任务下所有脚本才能开始同步" + srcEnvironmentCode + "到" + destEnvironmentCode;
			return ERROR;
		}
		
		long[] scriptIds = this.convertSelectedScriptIds();
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(scriptIds, this.getUserContext());
		
		List<List<String>> results = new ArrayList<List<String>>();
		taskScriptManagementService.synchronizeFromEnvToEnv(srcEnvironmentCode, destEnvironmentCode, scripts, results, this.getUserContext());
		
		StringBuffer sb = new StringBuffer();
		for (int i=0; i<3; i++) {
			List<String> result = results.get(i);
			switch (i) {
			case 0:
				sb.append("同步的MR列表\r\n");
				for (String str : result) {
					sb.append(str).append("\r\n");
				}	
				break;
			case 1:
				sb.append("出错的MR列表\r\n");
				for (String str : result) {
					sb.append(str).append("\r\n");
				}	
				break;
			case 2:
				sb.append("执行结果\r\n");
				for (String str : result) {
					sb.append(str).append("\r\n");
				}	
				break;
			}
		}
		errorMessage = sb.toString();
		return "executeSuccefully";
	}
	
	private String issueIds;
	private String successMessage;
	/**
	 * 根据issue的id列表把相关task和script置为确认成功状态，返回确认成功，确认失败，找不到task的issue情况
	 * @return
	 * @throws Exception
	 */
	public String confirmSuccessTasksByIssuesIds() throws Exception {
		initPage();
		String[] iids = issueIds.split("\r\n");
		if (!Detect.notEmpty(issueIds) || !Detect.notEmpty(iids)) {
			errorMessage = "输入mr列表不合法: \r\n" + issueIds;
			return ERROR;
		}
		
		List<Task> tasks = taskManagementService.queryTasksByIssueIds(iids, this.getUserContext());
		//是否找到task
		if (!Detect.notEmpty(tasks)) {
			errorMessage = "根据mr列表找不到任务记录: \r\n" + issueIds;
			return ERROR;
		}
		
		long[] taskIds = new long[tasks.size()];
		for (int i=0; i<tasks.size(); i++) {
			taskIds[i] = tasks.get(i).getId();
		}
		tasks = taskScriptManagementService.cascadeQueryTasks(taskIds, this.getUserContext());
		
		//检查找到的task和script是否都更改为确认成功的状态
		StringBuffer sb = new StringBuffer();
		StringBuffer sbSuccess = new StringBuffer();
		int countSuccess = 0;
		StringBuffer sbFail = new StringBuffer();
		int countFail = 0;
		
		StringBuffer sbErrorLog = new StringBuffer();
		taskScriptManagementService.updateScriptStatusToConfirmSuccess(tasks, sbErrorLog, this.getUserContext());
		
		if (0 < sbErrorLog.length()) {
			sb.append("错误报告\r\n").append(sbErrorLog).append("\r\n\r\n");
		}
		sb.append("执行完毕，一共输入" + iids.length + "个issue，列表如下\r\n").append(issueIds).append("\r\n");

		List<Task> checkedTasks = taskScriptManagementService.cascadeQueryTasks(taskIds, this.getUserContext());
		for (Task t : checkedTasks) {
			if (DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS != t.getStatus() 
					|| !ScriptStatusUtil.isAllScriptsConfirmSuccessfully(t)) {
				sbFail.append(t.getIssueId()).append("\r\n");
				countFail++;
			} else {
				sbSuccess.append(t.getIssueId()).append("\r\n");
				countSuccess++;
			}
		}
		sb.append("执行成功的任务共" + countSuccess + "个，相关MR编号列表如下\r\n").append(sbSuccess);		
		sb.append("执行完毕，没有确认成功的任务共" + countFail + "个，相关MR编号列表如下\r\n").append(sbFail);
		successMessage = sb.toString();
		return EXEC_SUCCESS;
	}
	
	/**
	 * 把选中的验证成功或部分发布的脚本发布，按脚本在分支上执行顺序排序
	 * 没选中任务下所有脚本则报错
	 * @return
	 * @throws Exception
	 */
	public String releaseScripts() throws Exception {
		initPage();
		List<Task> tasks = null;
		try {
			tasks = findTasksOfAllSelectedScripts();
		} catch (Exception e) {
			errorMessage = "必须选中任务下所有脚本才能发布";
			return ERROR;
		}
		
		try {
			taskScriptManagementService.preReleaseValidate(tasks, this.getUserContext());
		} catch (Exception e) {
			errorMessage = e.getMessage();
			return ERROR;
		}

		reportTitle = "";
		return "download";
	}
	
	private long[] convertSelectedScriptIds() {
		String[] idStrs = null;
		if (Detect.notEmpty(selectedScriptIds)) {
			idStrs = selectedScriptIds.split(", ");
			long[] ids = new long[idStrs.length];
			for (int i=0; i<idStrs.length; i++) {
				ids[i] = Long.parseLong(idStrs[i].trim());
			}
			return ids;
		} else {
			return new long[0];
		}
	}
	
	protected InputStream inputStream;
	protected String fileName;

	public String getFileName() {
		return fileName;
	}

	/**
	 * 返回下载流
	 * @return
	 * @throws Exception
	 */
	public InputStream getInputStream() throws Exception {
		initPage();
		long[] scriptIds = this.convertSelectedScriptIds();
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(scriptIds, this.getUserContext());
		long[] taskIds = taskScriptManagementService.collectTaskIdsOfScripts(scripts);
		List<Task> tasks = taskScriptManagementService.cascadeQueryTasks(taskIds, this.getUserContext());
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd-HHmmss");
		String timeStamp = sdf.format(DateUtil.getCurrentDate());
		fileName = "scripts-" + timeStamp + ".zip";
		
		inputStream = taskScriptManagementService.releaseScripts(fileName, tasks, timeStamp, this.getUserContext());		
		return inputStream;
	}
	
	public String queryScriptDetail() throws Exception {
//		initPage();
		scriptCanModify = false;
		script = scriptManagementService.queryScriptById(scriptId, this.getUserContext());
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(new long[]{script.getId()}, this.getUserContext());
		if (Detect.notEmpty(scripts)) {
			if (EnvironmentStatusUtil.isExistEnvironmentExecFail(scripts.get(0))) {
				scriptCanModify = true;
			}
			if (EnvironmentStatusUtil.isAllEnvironmentsNotExec(scripts.get(0))) {
				scriptCanModify = true;
			}
			if (DictScriptStatus.Status.DEPRECATED == scripts.get(0).getStatus()) {
				scriptCanModify = false;
			}
		}
		
		return "scriptDetail";
	}
	
	public String queryScriptEnvironmentDetail() throws Exception {
//		initPage();
		scriptEnvironmentRelation = scriptEnvironmentRelationManagementService.cascadeQueryById(scriptEnvironmentId, this.getUserContext());
		return "scriptEnvironmentDetail";
	}
	
	/**
	 * 把选中的脚本置为废弃状态，必须整个任务的脚本同时废弃，否则很难控制状态
	 * @return
	 * @throws Exception
	 */
	public String updateScriptStatusToDeprecated() throws Exception {
		initPage();
		List<Task> tasks = null;
		try {
			tasks = findTasksOfAllSelectedScripts();
		} catch (Exception e) {
			errorMessage = "必须选中任务下所有脚本才能更新为废弃状态";
			return ERROR;
		}
		
		for (Task t : tasks) {
			taskManagementService.setTaskStatusIsDeprecated(t, this.getUserContext());
			for (Script s : t.getScripts()) {
				scriptManagementService.setScriptStatusIsDeprecated(s, this.getUserContext());
			}
		}

		reportTitle = "";
		return SUCCESS;
	}
	
	
	
	
	
	
	

	public TaskScriptManagementService getTaskScriptManagementService() {
		return taskScriptManagementService;
	}

	public void setTaskScriptManagementService(TaskScriptManagementService taskScriptManagementService) {
		this.taskScriptManagementService = taskScriptManagementService;
	}

	public List<Script> getScripts() {
		return scripts;
	}

	public void setScripts(List<Script> scripts) {
		this.scripts = scripts;
	}

	public DictionaryViewHelper getDictionaryViewHelper() {
		return dictionaryViewHelper;
	}

	public void setDictionaryViewHelper(DictionaryViewHelper dictionaryViewHelper) {
		this.dictionaryViewHelper = dictionaryViewHelper;
	}

	public String getReportTitle() {
		return reportTitle;
	}

	public void setReportTitle(String reportTitle) {
		this.reportTitle = reportTitle;
	}

	public String getSelectedScriptIds() {
		return selectedScriptIds;
	}

	public void setSelectedScriptIds(String selectedScriptIds) {
		this.selectedScriptIds = selectedScriptIds;
	}

	public void setScriptId(long scriptId) {
		this.scriptId = scriptId;
	}

	public void setScriptManagementService(
			ScriptManagementService scriptManagementService) {
		this.scriptManagementService = scriptManagementService;
	}

	public Script getScript() {
		return script;
	}

	public void setScript(Script script) {
		this.script = script;
	}

	public long getScriptEnvironmentId() {
		return scriptEnvironmentId;
	}

	public void setScriptEnvironmentId(long scriptEnvironmentId) {
		this.scriptEnvironmentId = scriptEnvironmentId;
	}

	public ScriptEnvironmentRelation getScriptEnvironmentRelation() {
		return scriptEnvironmentRelation;
	}

	public void setScriptEnvironmentRelation(
			ScriptEnvironmentRelation scriptEnvironmentRelation) {
		this.scriptEnvironmentRelation = scriptEnvironmentRelation;
	}

	public void setScriptEnvironmentRelationManagementService(
			ScriptEnvironmentRelationManagementService scriptEnvironmentRelationManagementService) {
		this.scriptEnvironmentRelationManagementService = scriptEnvironmentRelationManagementService;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public void setMessageNotifyService(MessageNotifyService messageNotifyService) {
		this.messageNotifyService = messageNotifyService;
	}

	public void setToBeExecEnvironmentCode(String toBeExecEnvironmentCode) {
		this.toBeExecEnvironmentCode = toBeExecEnvironmentCode;
	}

	public void setSrcEnvironmentCode(String srcEnvironmentCode) {
		this.srcEnvironmentCode = srcEnvironmentCode;
	}

	public void setDestEnvironmentCode(String destEnvironmentCode) {
		this.destEnvironmentCode = destEnvironmentCode;
	}

	public void setEnvironmentManagementService(
			EnvironmentManagementService environmentManagementService) {
		this.environmentManagementService = environmentManagementService;
	}

	public List<Environment> getEnvironments() {
		return environments;
	}

	public void setEnvironments(List<Environment> environments) {
		this.environments = environments;
	}

	public String getToBeExecEnvironmentCode() {
		return toBeExecEnvironmentCode;
	}

	public String getSrcEnvironmentCode() {
		return srcEnvironmentCode;
	}

	public String getDestEnvironmentCode() {
		return destEnvironmentCode;
	}

	public List<DictTaskStatus> getTaskStatuses() {
		return taskStatuses;
	}

	public void setTaskStatuses(List<DictTaskStatus> taskStatuses) {
		this.taskStatuses = taskStatuses;
	}

	public List<DictScriptStatus> getScriptStatuses() {
		return scriptStatuses;
	}

	public void setScriptStatuses(List<DictScriptStatus> scriptStatuses) {
		this.scriptStatuses = scriptStatuses;
	}

	public List<DictEnvironmentStatus> getEnvironmentStatuses() {
		return environmentStatuses;
	}

	public void setEnvironmentStatuses(
			List<DictEnvironmentStatus> environmentStatuses) {
		this.environmentStatuses = environmentStatuses;
	}

	public void setTaskManagementService(TaskManagementService taskManagementService) {
		this.taskManagementService = taskManagementService;
	}

	public void setTaskStatusToQuery(String taskStatusToQuery) {
		this.taskStatusToQuery = taskStatusToQuery;
	}

	public void setScriptStatusToQuery(String scriptStatusToQuery) {
		this.scriptStatusToQuery = scriptStatusToQuery;
	}

	public void setEnvironmentCodeToQuery(String environmentCodeToQuery) {
		this.environmentCodeToQuery = environmentCodeToQuery;
	}

	public void setEnvironmentStatusToQuery(String environmentStatusToQuery) {
		this.environmentStatusToQuery = environmentStatusToQuery;
	}

	public String getIssueIds() {
		return issueIds;
	}

	public void setIssueIds(String issueIds) {
		this.issueIds = issueIds;
	}

	public String getSuccessMessage() {
		return successMessage;
	}

	public void setSuccessMessage(String successMessage) {
		this.successMessage = successMessage;
	}

	public String getIssueIdToQuery() {
		return issueIdToQuery;
	}

	public void setIssueIdToQuery(String issueIdToQuery) {
		this.issueIdToQuery = issueIdToQuery;
	}

	public boolean isScriptCanModify() {
		return scriptCanModify;
	}

	public void setScriptCanModify(boolean scriptCanModify) {
		this.scriptCanModify = scriptCanModify;
	}

	public void setEnvironmentCodeForceToUpdate(String environmentCodeForceToUpdate) {
		this.environmentCodeForceToUpdate = environmentCodeForceToUpdate;
	}

	public void setEnvironmentStatusForceToUpdate(
			String environmentStatusForceToUpdate) {
		this.environmentStatusForceToUpdate = environmentStatusForceToUpdate;
	}

	public Set<String> getResultIssueIds() {
		return resultIssueIds;
	}

	public String getLatestExecutionStatus() {
		return latestExecutionStatus;
	}



}
