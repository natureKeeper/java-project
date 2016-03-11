package com.asb.cdd.scriptmanage.service.impl;

import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Destination;
import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.Issue;
import com.asb.cdd.scriptmanage.dao.access.model.IssueEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.IssueExecutePoint;
import com.asb.cdd.scriptmanage.dao.access.model.IssueScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.IssueTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.Script2;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.dao.access.model.Task2;
import com.asb.cdd.scriptmanage.service.EnvironmentManagementService;
import com.asb.cdd.scriptmanage.service.IssueTaskQueryService2;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.ScriptEnvironmentRelationManagementService;
import com.asb.cdd.scriptmanage.service.ScriptManagementService;
import com.asb.cdd.scriptmanage.service.TaskManagementService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.GlobalStatus;
import com.asb.cdd.scriptmanage.web.ScriptManualExecuteAction;
import com.asb.cdd.scriptmanage.web.util.DictionaryViewHelper;
import com.irm.system.authorization.vo.UserContext;
import common.util.Detect;

//@Path("/ScriptManualExecuteAction")
@Path("/issueTaskQueryService2")
public class IssueTaskQueryServiceImpl2 implements IssueTaskQueryService2{
	
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
	public InputStream getInputStream() {
		return inputStream;
	}


	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}


	public TaskManagementService getTaskManagementService() {
		return taskManagementService;
	}


	public ScriptManagementService getScriptManagementService() {
		return scriptManagementService;
	}


	public ScriptEnvironmentRelationManagementService getScriptEnvironmentRelationManagementService() {
		return scriptEnvironmentRelationManagementService;
	}


	public EnvironmentManagementService getEnvironmentManagementService() {
		return environmentManagementService;
	}


	public MessageNotifyService getMessageNotifyService() {
		return messageNotifyService;
	}


	public long getScriptId() {
		return scriptId;
	}


	public String getTaskStatusToQuery() {
		return taskStatusToQuery;
	}


	public String getScriptStatusToQuery() {
		return scriptStatusToQuery;
	}


	public String getEnvironmentCodeToQuery() {
		return environmentCodeToQuery;
	}


	public String getEnvironmentStatusToQuery() {
		return environmentStatusToQuery;
	}


	public String getEnvironmentCodeForceToUpdate() {
		return environmentCodeForceToUpdate;
	}


	public String getEnvironmentStatusForceToUpdate() {
		return environmentStatusForceToUpdate;
	}


	public void setResultIssueIds(Set<String> resultIssueIds) {
		this.resultIssueIds = resultIssueIds;
	}


	public void setLatestExecutionStatus(String latestExecutionStatus) {
		this.latestExecutionStatus = latestExecutionStatus;
	}


	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	private ScriptEnvironmentRelation scriptEnvironmentRelation;
	
	/**
	 * 最近一次脚本执行状态
	 */
	private String latestExecutionStatus;
	
	private void initPage() throws Exception {
		environments = environmentManagementService.queryAllEnvironments(new UserContext());
		taskStatuses = taskManagementService.queryAllTaskStatus(new UserContext());
		dictionaryViewHelper.sortDictionaryByOrdinal(taskStatuses);
		scriptStatuses = scriptManagementService.queryAllScriptStatus(new UserContext());
		dictionaryViewHelper.sortDictionaryByOrdinal(scriptStatuses);
		environmentStatuses = scriptEnvironmentRelationManagementService.queryAllScriptEnvironmentStatus(new UserContext());
		dictionaryViewHelper.sortDictionaryByOrdinal(environmentStatuses);
		
		latestExecutionStatus = GlobalStatus.latestExecutionStatus;
		
		reportTitle = "";
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
	 
	@POST
	@Path("/queryScriptsByIssueId")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
    public Issue queryScriptsByIssueId(Issue issue){
		try {
			initPage();
		} catch (Exception e) {
			e.printStackTrace();
		}
		issueIdToQuery = issue.getIssueId();
		issueIdToQuery = issueIdToQuery.toUpperCase();
		try {
			scripts = scriptManagementService.findScriptsByConditions(issueIdToQuery, 0,
					0, 0, 
					null, new UserContext());
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		scripts = removeDeprecatedScripts(scripts);
		taskScriptManagementService.sortScriptsByCreateTime(scripts);
		 
		List<Script2> scripts2 = new ArrayList<Script2>();
		for(Script s0 : scripts){
			Script2 s = new Script2();
			s.setName(s0.getName());
			s.setMemo(s0.getMemo());
			s.setUserName(s0.getTask().getUser().getName());
			s.setIssueScriptStatus(IssueScriptStatus.get((short) s0.getStatus()));
			String destinations = "";
			for(Destination d : s0.getDestinations()){
				destinations = destinations + d.getName() +"";
			}
			s.setDestinations(destinations);
			//s0.getEnvironmentRelations();//试试数组保存记录
			String environmentRelations = " ";
			for(ScriptEnvironmentRelation ser : s0.getEnvironmentRelations()){
				//ser.getEnvironment().getName();
			    //IssueEnvironmentStatus.get((short)ser.getStatus());
				//IssueExecutePoint.get((short)ser.getExecutePoint());
				environmentRelations = environmentRelations +"<名-:"+ ser.getEnvironment().getName() +" --点-:"+ IssueEnvironmentStatus.get((short)ser.getStatus()).getText() 
				+"--状-:"+ IssueExecutePoint.get((short)ser.getExecutePoint()).getText() +">----";
			}
			s.setEnvironmentRelations(environmentRelations.substring(0, environmentRelations.length()-4));
			//涉及状态的改成枚举类
			Task2 task = new Task2();
			task.setCreateTime(s0.getTask().getCreateTime());
			task.setName(s0.getTask().getName());
		    task.setIssueTaskStatus(IssueTaskStatus.get((short)s0.getTask().getStatus()));
			task.setIssueId(s0.getTask().getIssueId());
			s.setTask(task);
			s.setIssueTaskStatus(IssueTaskStatus.get((short)s0.getTask().getStatus()));
			
			scripts2.add(s);
		}
		Issue i = new Issue();
	    i.setScripts(scripts2);
		return i;
		
	/*	Issue i = new Issue();
		i.setIssueId(issue.getIssueId());
		List<Script2> l = new ArrayList<Script2>();
		Script2 s21 = new Script2();
		s21.setName("1");
		s21.setStatus(1);
		Task2 t1 = new Task2();
		t1.setIssueId("IRM-1");
		t1.setName("s1");
		s21.setTask(t1);
		Script2 s22 = new Script2();
		s22.setName("2");
		s22.setStatus(2);
		Task2 t2 = new Task2();
		t2.setIssueId("IRM-2");
		t2.setName("s2");
		s22.setTask(t2);
		l.add(s21);
		l.add(s22);
		i.setScripts(l);
		return i;*/
		
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
 
	 
	private String selectedScriptIds;
	
	/**
	 * 要执行脚本的环境的编码
	 */
	private String toBeExecEnvironmentCode;
	
	 
	/**
	 * 查询用户选中的那些脚本所属的任务，如果用户没选中任务下所有脚本，则报错
	 * @return
	 * @throws Exception
	 */
	private List<Task> findTasksOfAllSelectedScripts() throws Exception {
		long[] scriptIds = this.convertSelectedScriptIds();
		List<Script> scripts = taskScriptManagementService.cascadeQueryScripts(scriptIds, null);
		
		long[] taskIds = taskScriptManagementService.collectTaskIdsOfScripts(scripts);
		List<Task> tasks = taskScriptManagementService.cascadeQueryTasks(taskIds, null);
		long[] allScriptIdsInTasks = taskScriptManagementService.collectScriptIdsOfTasks(tasks);
		if (scriptIds.length != allScriptIdsInTasks.length) {
			throw new Exception("验证失败");
		}
		return tasks;
	}
  
	
	private String environmentCodeForceToUpdate;
	private String environmentStatusForceToUpdate;
  
	private String srcEnvironmentCode;
	private String destEnvironmentCode;
	 
	private String issueIds;
	private String successMessage;
	 
	
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
