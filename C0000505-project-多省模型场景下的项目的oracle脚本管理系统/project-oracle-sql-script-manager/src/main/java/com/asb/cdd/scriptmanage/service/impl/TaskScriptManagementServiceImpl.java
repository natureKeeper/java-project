package com.asb.cdd.scriptmanage.service.impl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
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
import org.springframework.jdbc.core.JdbcTemplate;

import com.asb.cdd.scriptmanage.dao.access.DestinationAccessService;
import com.asb.cdd.scriptmanage.dao.access.EnvironmentAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptDestinationRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptEnvironmentRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Destination;
import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictExecutePoint;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.ExecuteLog;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptDestinationRelation;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.ScriptCriteria;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.ScriptEnvironmentRelationCriteria;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.TaskCriteria;
import com.asb.cdd.scriptmanage.service.LogManagementService;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.ScriptManagementService;
import com.asb.cdd.scriptmanage.service.TaskManagementService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.entity.BigDataFsLocator;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.asb.cdd.scriptmanage.service.util.EnvironmentStatusUtil;
import com.asb.cdd.scriptmanage.service.util.GlobalStatus;
import com.asb.cdd.scriptmanage.service.util.ScriptStatusUtil;
import com.irm.model.system.User;
import com.irm.system.access.namespace.service.UserAccessService;
import com.irm.system.authorization.vo.UserContext;
import com.irm.system.bigdata.service.BigDataAccessService;
import common.util.Assertion;
import common.util.Detect;
import common.util.ZipUtil;

public class TaskScriptManagementServiceImpl implements TaskScriptManagementService {

	private DestinationAccessService destinationAccessService;
	private EnvironmentAccessService environmentAccessService;
	private LogManagementService logManagementService;
	private MessageNotifyService messageNotifyService;
	private String scriptContentEncoding = "utf-8";
	private static final float sqlExecTimeShreshold = 60;
	
	private static final transient Log log = LogFactory.getLog(TaskScriptManagementServiceImpl.class);
	
	public void setLogManagementService(LogManagementService logManagementService) {
		this.logManagementService = logManagementService;
	}

	private ScriptAccessService scriptAccessService;
	private ScriptDestinationRelationAccessService scriptDestinationRelationAccessService;
	private ScriptEnvironmentRelationAccessService scriptEnvironmentRelationAccessService;
	private TaskAccessService taskAccessService;
	private BigDataAccessService<BigDataFsLocator> scriptBigDataAccessService;
	private JdbcTemplate jdbcTemplate;
	private UserAccessService userAccessService;
	private SqlScriptExecutor sqlScriptExecutor;
	private ScriptManagementService scriptManagementService;
	private TaskManagementService taskManagementService;
	
	private BigDataAccessService<BigDataFsLocator> releasePackageBigDataAccessService;
	
	/**
	 * 是否允许提交脚本
	 */
	private boolean allowSubmitScript = false;
	
	public Task saveTask(Task task, List<Script> scripts, List<ScriptDestinationRelation> scriptDestRelations, 
			List<ScriptEnvironmentRelation> scriptEnvRelations, UserContext userContext) throws Exception {
		/*
		 * 任务的状态：默认是未执行，但如果所有环境的时间点是不用执行，则设为“所有脚本确认成功”
		 * 脚本的状态：默认是未执行，但如果所有环境的时间点是不用执行，则设为“确认成功”
		 * 环境的状态：默认是未执行，但如果时间点是不用执行，则设为“执行成功”
		 */
		
		/*
		 * 保存任务记录
		 * 保存script文件
		 * 保存脚本记录
		 */
		task.setUserId(userContext.getUserId());
		taskAccessService.save(task, userContext);
		
		//按script提交顺序入库
		for (int i=0; i<scripts.size(); i++) {
			Script script = scripts.get(i);
			String content = script.getScriptContent();
			BigDataFsLocator bdl = scriptBigDataAccessService.save(script.getName(), content);
			script.setScriptLocation(bdl.getPath());
			
			script.setTaskId(task.getId());
			script.setTask(task);
			scriptAccessService.save(script, userContext);
		}

		task.setScripts(scripts);
		
		for (ScriptDestinationRelation relation : scriptDestRelations) {
			relation.setScriptId(relation.getScript().getId());
			relation.setDestinationId(relation.getDestination().getId());
		}
		scriptDestinationRelationAccessService.save(scriptDestRelations, userContext);
		
		for (ScriptEnvironmentRelation relation : scriptEnvRelations) {
			relation.setScriptId(relation.getScript().getId());
			relation.setEnvironmentId(relation.getEnvironment().getId());
		}
		scriptEnvironmentRelationAccessService.save(scriptEnvRelations, userContext);
		
		return task;
	}

	public void setDestinationAccessService(DestinationAccessService destinationAccessService) {
		this.destinationAccessService = destinationAccessService;
	}

	public void setEnvironmentAccessService(EnvironmentAccessService environmentAccessService) {
		this.environmentAccessService = environmentAccessService;
	}
	
	public void setScriptAccessService(ScriptAccessService scriptAccessService) {
		this.scriptAccessService = scriptAccessService;
	}

	public void setScriptDestinationRelationAccessService(ScriptDestinationRelationAccessService scriptDestinationRelationAccessService) {
		this.scriptDestinationRelationAccessService = scriptDestinationRelationAccessService;
	}

	public void setScriptEnvironmentRelationAccessService(ScriptEnvironmentRelationAccessService scriptEnvironmentRelationAccessService) {
		this.scriptEnvironmentRelationAccessService = scriptEnvironmentRelationAccessService;
	}

	public void setTaskAccessService(TaskAccessService taskAccessService) {
		this.taskAccessService = taskAccessService;
	}
	
	public List<Script> queryAllScripts(UserContext uc) throws Exception {
		ScriptCriteria sc = new ScriptCriteria();
		List<Script> scripts = scriptAccessService.find(sc, uc);
		if (Detect.notEmpty(scripts)) {
			long[] scriptIds = new long[scripts.size()];
			for (int i=0; i<scripts.size(); i++) {
				scriptIds[i] = scripts.get(i).getId();
			}
			scripts = cascadeQueryScripts(scriptIds, uc);
			return scripts;
		} else {
			return new ArrayList<Script>();
		}
	}
	
	
	public List<Script> cascadeQueryScripts(long[] scriptIds, UserContext uc) throws Exception {
		List<Script> scripts = scriptAccessService.findByIds(scriptIds, uc);
		return cascadeQueryScripts(scripts, uc);
	}
	
	private List<Script> cascadeQueryScripts(List<Script> scripts, UserContext uc) throws Exception {
		if (Detect.notEmpty(scripts)) {
			for (Script script : scripts) {
				Task task = taskAccessService.findById(script.getTaskId(), uc);
				if (null == task) {
					throw new Exception("脚本找不到关联任务记录,scriptId=" + script.getId());
				}
				User user = userAccessService.findById(task.getUserId(), uc);
				if (null == user) {
					throw new Exception("脚本关联任务没有创建人,scriptId=" + script.getId() + ", taskId=" + task.getId());
				}
				task.setUser(user);
				script.setTask(task);
				
				List<ScriptDestinationRelation> destRelations = scriptDestinationRelationAccessService.findByScriptId(script.getId(), uc);
				if (!Detect.notEmpty(destRelations)) {
					throw new Exception("脚本找不到相关的发布目的地关系,scriptId=" + script.getId());
				}
				
				long[] destIds = new long[destRelations.size()];
				for (int i=0; i<destRelations.size(); i++) {
					destIds[i] = destRelations.get(i).getDestinationId();
				}
				List<Destination> destinations = destinationAccessService.findByIds(destIds, uc);
				if (!Detect.notEmpty(destinations)) {
					throw new Exception("脚本通过关系表记录找不到相关的发布目的地记录,scriptId=" + script.getId());
				}
				script.setDestinations(destinations);
				
				
				List<ScriptEnvironmentRelation> envRelations = scriptEnvironmentRelationAccessService.findByScriptId(script.getId(), uc);
				if (!Detect.notEmpty(envRelations)) {
					throw new Exception("脚本找不到相关的执行环境关系,scriptId=" + script.getId());
				}
				for (ScriptEnvironmentRelation envRelation : envRelations) {
					Environment env = environmentAccessService.findById(envRelation.getEnvironmentId(), uc);
					if (null == env) {
						throw new Exception("脚本通过关系表记录找不到相关的执行环境记录,scriptId=" + script.getId());
					}
					envRelation.setEnvironment(env);
				}
				script.setEnvironmentRelations(envRelations);
				
				BigDataFsLocator locator = new BigDataFsLocator();
				locator.setPath(script.getScriptLocation().replaceAll("\\\\", "\\\\"));
				String content = scriptBigDataAccessService.loadAsString(locator, scriptContentEncoding);
				script.setScriptContent(content);
			}
		}
		return scripts;
	}
	
	public long[] collectTaskIdsOfScripts(List<Script> scripts) {
		Set<Long> taskIds = new HashSet<Long>();
		for (Script s : scripts) {
			taskIds.add(s.getTask().getId());
		}
		Long[] ids = new Long[taskIds.size()];
		ids = taskIds.toArray(ids);
		long[] result = new long[ids.length];
		for (int i=0; i<ids.length; i++) {
			result[i] = ids[i];
		}
		return result;
	}
	
	public long[] collectScriptIdsOfTasks(List<Task> tasks) {
		Set<Long> scriptIds = new HashSet<Long>();
		for (Task t : tasks) {
			for (Script s : t.getScripts()) {
				scriptIds.add(s.getId());
			}
		}
		Long[] ids = new Long[scriptIds.size()];
		ids = scriptIds.toArray(ids);
		long[] result = new long[ids.length];
		for (int i=0; i<ids.length; i++) {
			result[i] = ids[i];
		}
		return result;
	}
	
	public List<Task> cascadeQueryTasks(long[] taskIds, UserContext uc) throws Exception {
		List<Task> tasks = taskAccessService.findByIds(taskIds, uc);
		return cascadeQueryTasks(tasks, uc);
	}
	
	private List<Task> cascadeQueryTasks(List<Task> tasks, UserContext uc) throws Exception {
		if (Detect.notEmpty(tasks)) {
			for (Task task : tasks) {
				User user = userAccessService.findById(task.getUserId(), uc);
				if (null == user) {
					throw new Exception("任务没有创建人,taskId=" + task.getId());
				}
				task.setUser(user);
				
				List<Script> scripts = scriptAccessService.findByTaskIds(new long[]{task.getId()}, uc);
				if (Detect.notEmpty(scripts)) {
					task.setScripts(scripts);
					for (Script script : scripts) {
						List<ScriptDestinationRelation> destRelations = scriptDestinationRelationAccessService.findByScriptId(script.getId(), uc);
						if (!Detect.notEmpty(destRelations)) {
							throw new Exception("脚本找不到相关的发布目的地关系,scriptId=" + script.getId());
						}
						
						long[] destIds = new long[destRelations.size()];
						for (int i=0; i<destRelations.size(); i++) {
							destIds[i] = destRelations.get(i).getDestinationId();
						}
						List<Destination> destinations = destinationAccessService.findByIds(destIds, uc);
						if (!Detect.notEmpty(destinations)) {
							throw new Exception("脚本通过关系表记录找不到相关的发布目的地记录,scriptId=" + script.getId());
						}
						script.setDestinations(destinations);						
						
						List<ScriptEnvironmentRelation> envRelations = scriptEnvironmentRelationAccessService.findByScriptId(script.getId(), uc);
						if (!Detect.notEmpty(envRelations)) {
							throw new Exception("脚本找不到相关的执行环境关系,scriptId=" + script.getId());
						}
						for (ScriptEnvironmentRelation envRelation : envRelations) {
							Environment env = environmentAccessService.findById(envRelation.getEnvironmentId(), uc);
							if (null == env) {
								throw new Exception("脚本通过关系表记录找不到相关的执行环境记录,scriptId=" + script.getId());
							}
							envRelation.setEnvironment(env);
						}
						script.setEnvironmentRelations(envRelations);
						
						BigDataFsLocator locator = new BigDataFsLocator();
						locator.setPath(script.getScriptLocation().replaceAll("\\\\", "\\\\"));
						String content = scriptBigDataAccessService.loadAsString(locator, scriptContentEncoding);
						script.setScriptContent(content);
					}
				}
			}
		}
		return tasks;
	}


	public long getTaskUniqueId() {
		return jdbcTemplate.queryForLong("select SEQ_TASK_NO.Nextval from dual");
	}

	public void setScriptBigDataAccessService(
			BigDataAccessService<BigDataFsLocator> scriptBigDataAccessService) {
		this.scriptBigDataAccessService = scriptBigDataAccessService;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void setUserAccessService(UserAccessService userAccessService) {
		this.userAccessService = userAccessService;
	}

	public List<Script> queryScriptsAllEnvExecSuccess(UserContext uc) throws Exception {
		//查询处于所有脚本执行成功状态的任务,然后把任务下的脚本查出来
		TaskCriteria tc = new TaskCriteria();
		tc.setStatus(DictTaskStatus.Status.EXEC_ALL_SCRIPTS_SUCCESS);
		List<Task> tasks = taskAccessService.find(tc, uc);
		if (Detect.notEmpty(tasks)) {
			int i = 0;
			long[] taskIds = new long[tasks.size()];
			for (Task s : tasks) {
				taskIds[i++] = s.getId();
			}
			List<Script> scripts = scriptAccessService.findByTaskIds(taskIds, uc);
			return cascadeQueryScripts(scripts, uc);
		} else {
			return new ArrayList<Script>();
		}
	}

	public List<Script> queryScriptsAnyEnvExecFail(UserContext uc) throws Exception {
		// 先查询脚本环境关系表中任一环境失败的脚本,然后级联查询脚本
		/*
		 * 先查询脚本环境关系表中执行失败的记录，把脚本id列表取出来
		 * 然后用这个脚本id结果集去级联查询脚本
		 */
		ScriptEnvironmentRelationCriteria criteria = new ScriptEnvironmentRelationCriteria();
		criteria.setStatus(DictEnvironmentStatus.Status.EXEC_FAIL);
		List<ScriptEnvironmentRelation> relations1 = scriptEnvironmentRelationAccessService.find(criteria, uc);
		if (Detect.notEmpty(relations1)) {
			long[] scriptIdArray = new long[relations1.size()];
			for (int i=0; i<relations1.size(); i++) {
				scriptIdArray[i] = relations1.get(i).getScriptId();
			}

			return cascadeQueryScripts(scriptIdArray, uc);
		} else {
			return new ArrayList<Script>();
		}
	}

	public List<Script> queryScriptsAnyEnvWaitingExec(UserContext uc) throws Exception {
		// 先查询脚本环境关系表中任一环境未执行的脚本,然后级联查询脚本
		/*
		 * 先查询脚本环境关系表中未执行的记录，把脚本id列表取出来
		 * 然后用这个脚本id结果集去级联查询脚本
		 */
		ScriptEnvironmentRelationCriteria criteria = new ScriptEnvironmentRelationCriteria();
		criteria.setStatus(DictEnvironmentStatus.Status.WAIT_EXEC);
		List<ScriptEnvironmentRelation> relations1 = scriptEnvironmentRelationAccessService.find(criteria, uc);
		if (Detect.notEmpty(relations1)) {
			long[] scriptIdArray = new long[relations1.size()];
			for (int i=0; i<relations1.size(); i++) {
				scriptIdArray[i] = relations1.get(i).getScriptId();
			}

			return cascadeQueryScripts(scriptIdArray, uc);
		} else {
			return new ArrayList<Script>();
		}
	}

	public List<Script> queryScriptsConfirmSuccessOrPartiallyRelease(UserContext uc) throws Exception {
		// 查询确认成功和部分省份发布的脚本,然后级联查询
		/*
		 * 先查询任务中确认成功和部分省份发布的任务
		 * 然后查任务下的脚本
		 * 然后用这个脚本id结果集去级联查询脚本
		 */
		TaskCriteria tc = new TaskCriteria();
		tc.setStatus(DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS);
		List<Task> task1 = taskAccessService.find(tc, uc);
		
		tc = new TaskCriteria();
		tc.setStatus(DictTaskStatus.Status.RELEASE_PARTIAL_DESTINATION);
		List<Task> task2 = taskAccessService.find(tc, uc);
		
		int count = 0;
		if (Detect.notEmpty(task1)) {
			count += task1.size();
		}
		if (Detect.notEmpty(task2)) {
			count += task2.size();
		}
		
		if (count > 0) {
			int i = 0;
			long[] ids = new long[count];
			if (Detect.notEmpty(task1)) {
				for (Task s : task1) {
					ids[i++] = s.getId();
				}
			}
			if (Detect.notEmpty(task2)) {
				for (Task s : task2) {
					ids[i++] = s.getId();
				}
			}
			
			List<Script> scripts = scriptAccessService.findByTaskIds(ids, uc);
			return cascadeQueryScripts(scripts, uc);
		} else {
			return new ArrayList<Script>();
		}
	}

	public boolean isAllowSubmitScript() {
		return allowSubmitScript;
	}

	public void setAllowSubmitScript(boolean allowSubmitScript) {
		this.allowSubmitScript = allowSubmitScript;
	}

	public List<Script> queryScriptsNeedToExec(List<Task> tasks, UserContext uc) throws Exception {
		long[] taskIds = new long[tasks.size()];
		for (int i=0; i<tasks.size(); i++) {
			taskIds[i] = tasks.get(i).getId();
		}
		
		List<Script> results = new ArrayList<Script>();
		if (Detect.notEmpty(taskIds)) {
			List<Script> scripts = scriptAccessService.findByTaskIds(taskIds, uc);
			if (Detect.notEmpty(scripts)) {
				for (Script s : scripts) {
					List<ScriptEnvironmentRelation> relations = scriptEnvironmentRelationAccessService.findByScriptId(s.getId(), uc);
					for (ScriptEnvironmentRelation relation : relations) {
						if (DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()) {
							results.add(s);
							break;
						}
					}
				}
			}
			results = cascadeQueryScripts(results, uc);			
		}
		
		return results;
	}

	public List<Task> queryTasksNeedToExec(UserContext uc) throws Exception {
		TaskCriteria tc = new TaskCriteria();
		tc.setStatus(DictTaskStatus.Status.WAIT_EXEC);
		List<Task> tasks1 = taskAccessService.find(tc, uc);
		
		tc.setStatus(DictTaskStatus.Status.EXEC_PARTIAL_SCRIPTS);
		List<Task> tasks2 = taskAccessService.find(tc, uc);
		
		List<Task> results = new ArrayList<Task>();
		if (Detect.notEmpty(tasks1)) {
			results.addAll(tasks1);
		}
		if (Detect.notEmpty(tasks2)) {
			results.addAll(tasks2);
		}
		return results;
	}

	protected void setScriptAndEnvironmentIsExecuting(Script script, ScriptEnvironmentRelation relation, UserContext uc) throws Exception {
		if (DictScriptStatus.Status.WAIT_EXEC == script.getStatus()
				|| DictScriptStatus.Status.EXEC_FAIL == script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.EXECUTING);
			scriptAccessService.update(script, uc);
		}
		
		if (DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()
				|| DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus()) {
			relation.setStatus(DictEnvironmentStatus.Status.EXECUTING);
			scriptEnvironmentRelationAccessService.update(relation, uc);
		}
	}

	protected void setScriptEnvironmentRelationIsExecFail(ScriptEnvironmentRelation relation, UserContext uc) throws Exception {
		if (DictEnvironmentStatus.Status.EXECUTING == relation.getStatus()) {
			relation.setStatus(DictEnvironmentStatus.Status.EXEC_FAIL);
			scriptEnvironmentRelationAccessService.update(relation, uc);
		}
	}

	protected void setScriptEnvironmentRelationIsExecSuccessfully(ScriptEnvironmentRelation relation, UserContext uc) throws Exception {
		if (DictEnvironmentStatus.Status.EXECUTING == relation.getStatus()) {
			relation.setStatus(DictEnvironmentStatus.Status.EXEC_SUCCESS);
			scriptEnvironmentRelationAccessService.update(relation, uc);
		}
	}

	public void setSqlScriptExecutor(SqlScriptExecutor sqlScriptExecutor) {
		this.sqlScriptExecutor = sqlScriptExecutor;
	}
	
	public void sortScriptsByCreateTime(List<Script> scripts) {
		//把脚本按创建时间排序
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
	}
	
	/**
	 * 把脚本按分支上的执行顺序排序，在发布脚本时，发布的脚本的执行顺序应该按照分支上的执行顺序来
	 * @param scripts
	 */
	public void sortScriptsByExecuteSeq(List<Script> scripts) {
		//把脚本按执行顺序排序
		if (Detect.notEmpty(scripts)) {
			Collections.sort(scripts, new Comparator<Script>() {

				public int compare(Script o1, Script o2) {
					if (o1.getExecuteSeq() > o2.getExecuteSeq()) {
						return 1;
					} else {
						return -1;
					}
				}				
			});
		}		
	}
	
	/**
	 * 根据提供的环境编码，把脚本按环境上的执行顺序排序，以便在别的环境上按同样顺序执行（做环境间脚本同步用的）
	 * @param scripts
	 * @param srcEnvCode
	 * @param destEnvCode
	 */
	public void sortScriptsByEnvLatestExecuteTime(List<Script> scripts, final String envCode, final List<String> executeResults) {
		if (Detect.notEmpty(scripts) && Detect.notEmpty(envCode)) {
			Collections.sort(scripts, new Comparator<Script>() {

				/**
				 * 把脚本按环境上执行顺序排序
				 * @param o1
				 * @param o2
				 * @return
				 */
				public int compare(Script o1, Script o2) {
					ScriptEnvironmentRelation seRelation1 = null;
					ScriptEnvironmentRelation seRelation2 = null;
					
					List<ScriptEnvironmentRelation> envRelationList1 = o1.getEnvironmentRelations();
					for (ScriptEnvironmentRelation envRelation : envRelationList1) {
						if (envCode.equals(envRelation.getEnvironment().getCode())) {
							seRelation1 = envRelation;
						}
					}

					List<ScriptEnvironmentRelation> envRelationList2 = o2.getEnvironmentRelations();
					for (ScriptEnvironmentRelation envRelation : envRelationList2) {
						if (envCode.equals(envRelation.getEnvironment().getCode())) {
							seRelation2 = envRelation;
						}
					}
					
					Date executeTime1 = seRelation1.getLatestExecuteTime();
					Date executeTime2 = seRelation2.getLatestExecuteTime();
					if (null == executeTime1) {
						String err = "脚本" + o1.getName() + "在环境(code=" + envCode + ")上未执行，不能根据执行时间排序";
//						executeResults.add(err);
						throw new RuntimeException(err);
					}
					if (null == executeTime2) {
						String err = "脚本" + o2.getName() + "在环境(code=" + envCode + ")上未执行，不能根据执行时间排序";
//						executeResults.add(err);
						throw new RuntimeException(err);
					}
					if (executeTime1.before(executeTime2)) {
						return -1;
					} else {
						return 1;
					}
				}				
			});
		}		
	}
	
	/**
	 * 过滤脚本，如果脚本所属MR有其他执行失败的脚本，则移除这个脚本，以免被执行
	 * @param scripts
	 * @param uc
	 * @throws Exception 
	 */
	protected void removeScriptsHasRelativeFailScript(List<Script> scripts, List<String> executeResults, UserContext uc) throws Exception {
		for (Iterator<Script> it = scripts.iterator(); it.hasNext();) {
			Script script = it.next();
			Task task = script.getTask();
			String issueId = task.getIssueId();
			List<Task> tasks = taskManagementService.queryTasksByIssueIds(new String[]{issueId}, uc);
			tasks.add(task);
			tasks = this.cascadeQueryTasks(tasks, uc);
			
			here:
			for (Task t : tasks) {
				for (Script s : t.getScripts()) {
					for (ScriptEnvironmentRelation relation : s.getEnvironmentRelations()) {
						if (DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus()
								&& DictScriptStatus.Status.DEPRECATED != script.getStatus()
								&& DictTaskStatus.Status.DEPRECATED != t.getStatus()) {//如果存在同一MR下的非废弃状态的兄弟脚本执行失败，则本脚本不执行
							if (script.getId() != s.getId()) {
								it.remove();
								executeResults.add("移除脚本: " + t.getIssueId() + ", 任务名=" + t.getName() + ", 脚本名=" + s.getName() + ", 因为有相关脚本执行失败，所以不执行");
								break here;
							}							
						}
					}
				}
			}
		}
	}
	
	/**
	 * 过滤脚本，如果脚本为废弃状态，则移除这个脚本，以免被执行
	 * @param scripts
	 * @param executeResults
	 * @param uc
	 * @throws Exception
	 */
	protected void removeScriptsWithDeprecatedStatus(List<Script> scripts, List<String> executeResults, UserContext uc) throws Exception {
		for (Iterator<Script> it = scripts.iterator(); it.hasNext();) {			
			Script script = it.next();
			Task task = script.getTask();
			if (DictScriptStatus.Status.DEPRECATED == script.getStatus()
					|| DictTaskStatus.Status.DEPRECATED == task.getStatus()) {//如果脚本为废弃状态，则本脚本不执行
				it.remove();
				executeResults.add("移除脚本: " + task.getIssueId() + ", 任务名=" + task.getName() + ", 脚本名=" + script.getName() + ", 因为脚本为废弃状态，所以不执行");
			}
		}		
	}

	public synchronized void executeScriptNormally(List<Script> scripts, List<String> resultLogs, UserContext uc)
			throws Exception {
		boolean notified = false;

		Set<String> errorScriptIssueIds = new HashSet<String>();
		try {
			//如果脚本所属MR有执行失败的脚本，则移除这个脚本，以免被执行
			removeScriptsHasRelativeFailScript(scripts, resultLogs, uc);
			//如果脚本为废弃状态，则移除，以免被执行
			removeScriptsWithDeprecatedStatus(scripts, resultLogs, uc);
			
			sortScriptsByCreateTime(scripts);

			//对每个脚本的每个环境进行处理
			for (Script script : scripts) {
				Task task = script.getTask();
				//如果同一个MR中之前有脚本执行失败了，则后面的脚本不执行
				if (errorScriptIssueIds.contains(task.getIssueId())) {
					continue;
				}
				List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
				if (Detect.notEmpty(relations)) {
					for (ScriptEnvironmentRelation relation : relations) {
						if (DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()) {//环境状态==未执行
							if (DictExecutePoint.Point.AS_SOON_AS_POSSIBLE == relation.getExecutePoint()
									|| (isDawnNow() && DictExecutePoint.Point.BEFORE_DAWN == relation.getExecutePoint())) {//时间点==尽快 || (时间点==凌晨 && 现在是凌晨)
								try {
									executeScriptAndNotify(script, relation, notified, "这是后台自动执行的", uc);
								} catch (Exception e) {
									errorScriptIssueIds.add(task.getIssueId());
									log.error(e, e);
									StringBuffer sb = new StringBuffer();
									sb.append("/jk出错啦，赶紧看日志，msg=").append(e.getMessage());
									messageNotifyService.notifyAdministrators(script.getTask().getUser(), sb.toString(), uc);
								}
								
								if (!notified) {
									notified = true;
								}
							}
						}
					}
				}
			}
			afterExecuteScripts(scripts, uc);
			
			if (notified) {
				User user = uc.getUser();
				StringBuffer sb = new StringBuffer();
				sb.append("执行脚本结束, 调用人=").append(user.getName());
				messageNotifyService.notifyAdministrators(user, sb.toString(), uc);
			}
		} catch (Throwable t) {
			log.error("后台自动执行失败", t);
			{
				User user = uc.getUser();
				StringBuffer sb = new StringBuffer();
				sb.append("/jk执行脚本失败, 调用人=").append(user.getName()).append(", 原因=" + t.getMessage() + "，详情请看服务器日志");
				messageNotifyService.notifyUserAndAdministrators(user, sb.toString(), uc);
			}
			throw new Exception(t);
		}		
	}
	
	protected void executeScriptAndNotify(Script script, ScriptEnvironmentRelation relation, boolean notified, String hint, UserContext uc) throws Exception {
		if (!notified) {
			User user = uc.getUser();
			StringBuffer sb = new StringBuffer();
			sb.append("执行脚本开始, 调用人=").append(user.getName());
			if (Detect.notEmpty(hint)) {
				sb.append("\r" + hint);
			}
			messageNotifyService.notifyAdministrators(script.getTask().getUser(), sb.toString(), uc);
			notified = true;
		}
		
		setScriptAndEnvironmentIsExecuting(script, relation, uc);//脚本设为执行中，环境设为执行中
		//执行脚本
		executeScript(relation, relation.getEnvironment(), script, uc);
	}
	
	private void afterExecuteScripts(List<Script> scripts, UserContext uc) throws Exception {
		if (Detect.notEmpty(scripts)) {
			long[] taskIds = collectTaskIdsOfScripts(scripts);
			List<Task> tasks = cascadeQueryTasks(taskIds, uc);
			adjustStatusAfterExecuteScripts(tasks, uc);
		}		
	}

	private boolean isDawnNow() {
		Date now = DateUtil.getCurrentDate();
		return now.getHours() < 6;
	}
	
/*	protected void executeScript(Environment environment, Script script, UserContext uc) throws Exception {
		//执行脚本
		String output = sqlScriptExecutor.execute(environment.getDbAlias(), environment.getDbUsername(), environment.getDbPassword(), script.getScriptLocation());
		
		Log log = new Log();
		log.setTaskId(script.getTask().getId());
		log.setScriptId(script.getId());
		log.setEnvironmentId(environment.getId());
		log.setMessage(output);
		log = logManagementService.saveLog(log, uc);
		if (!validateSqlExecResult(output)) {
			throw new Exception(output);
		}
	}*/
	
	
	protected synchronized void executeScript(ScriptEnvironmentRelation relation, Environment environment, Script script, UserContext uc) throws Exception {
		{
			StringBuffer sb = new StringBuffer();
			sb.append("开始执行脚本, MR=" + script.getTask().getIssueId() + ", 任务=" + script.getTask().getName() + ", 脚本名称=").append(script.getName());
			sb.append(", 环境名称=").append(environment.getName());
			
			String msg = sb.toString();
			GlobalStatus.latestExecutionStatus = msg;
			messageNotifyService.notifyAdministrators(script.getTask().getUser(), msg, uc);
		}
		
		//执行脚本
		Date startTime = DateUtil.getCurrentDate();
		String output = sqlScriptExecutor.execute(environment.getDbAlias(), environment.getDbUsername(), 
												environment.getDbPassword(), script.getScriptLocation(), script.getScriptType());
		Date endTime = DateUtil.getCurrentDate();
		float gap = endTime.getTime() - startTime.getTime();
		gap /= 1000.0;
		
		ExecuteLog executeLog = new ExecuteLog();
		executeLog.setTaskId(script.getTask().getId());
		executeLog.setScriptId(script.getId());
		executeLog.setEnvironmentId(environment.getId());
		executeLog.setCreateTime(startTime);
		executeLog.setMessage(output);
		executeLog.setElapsedTime(gap + "秒");
		{
			StringBuffer sb = new StringBuffer();
			
			sb.append("MR号(" + script.getTask().getIssueId() + ")");
			sb.append("任务(" + script.getTask().getName() + ")");			
			sb.append("的脚本(" + script.getName() + ")");
			sb.append("在环境(" + environment.getName() + ")");
			if (sqlScriptExecutor.validateSqlExecResult(output)) {
				sb.append("执行成功");
			} else {
				sb.append("执行失败");
			}
			
			executeLog.setTitle(sb.toString());
		}
		
		executeLog = logManagementService.saveLog(executeLog, uc);
		
		relation.setLatestLogId(executeLog.getId());
		relation.setLatestElapsedTime(executeLog.getElapsedTime());
		relation.setLatestExecuteTime(startTime);
		relation.setLatestExecSeq(startTime.getTime());
		if (!sqlScriptExecutor.validateSqlExecResult(output)) {
			//异常：环境设为执行失败
			setScriptEnvironmentRelationIsExecFail(relation, uc);
			
			{
				StringBuffer sb = new StringBuffer();
				sb.append("执行脚本出错, MR=" + script.getTask().getIssueId() + ", 任务=" + script.getTask().getName() + ", 脚本名称=").append(script.getName());
				sb.append(", 环境名称=").append(environment.getName()).append(", 在修复错误前脚本所属MR的其他相关脚本将不会自动执行，可能会影响其他人的脚本，所以请尽快处理");
				messageNotifyService.notifyUserAndAdministrators(script.getTask().getUser(), "/jk" + sb.toString(), uc);
				throw new Exception(sb.toString());
			}			
		} else {
			//成功：环境设为执行成功
			setScriptEnvironmentRelationIsExecSuccessfully(relation, uc);			
			
			{
				StringBuffer sb = new StringBuffer();
				sb.append("执行脚本成功, MR=" + script.getTask().getIssueId() + ", 任务=" + script.getTask().getName() + ", 脚本名称=").append(script.getName());
				sb.append(", 环境名称=").append(environment.getName());
				messageNotifyService.notifyUserAndAdministrators(script.getTask().getUser(), sb.toString(), uc);
			}
		}
		
		//同步脚本执行顺序号这段代码应该不管成功还是失败都要执行，避免虽然执行失败了，但后来手工在界面上强制改为成功，导致没有执行顺序号不能导出脚本的bug
		//经常发生分支environment执行后latest_exec_seq更新了，但script的exec_seq没更新的问题，导致脚本不能发布，可能这里出错了，try-catch一下。问题应该定位了，看上面注释
		try {
			if (Environment.DbLevel.MAIN_BRANCH == environment.getDbLevel()) {
				//更新脚本在分支上的执行顺序号，因为最终发布脚本时，脚本间的执行顺序以BRANCH为准
				script.setExecuteSeq(startTime.getTime());
				scriptAccessService.update(script, uc);
			} else if (Environment.DbLevel.OTHER_BRANCH == environment.getDbLevel()
					&& 0 >= script.getExecuteSeq()) {
				//如果脚本顺序号没有值，则用其他分支上的执行顺序号更新，这样确保那些只在其他分支执行，主要分支不执行的脚本也有顺序号
				script.setExecuteSeq(startTime.getTime());
				scriptAccessService.update(script, uc);
			}
		} catch (Exception e) {
			log.error("更新脚本的exec_seq出错，scriptId=" + script.getId(), e);
			messageNotifyService.notifyUserAndAdministrators(script.getTask().getUser(), "更新脚本的exec_seq出错，请到服务器查日志，scriptId=" + script.getId(), uc);
		}
	}
	
	public void adjustTaskScriptEnvironmentStatus(List<Task> tasks, UserContext uc) throws Exception {
		this.adjustStatusAfterExecuteScripts(tasks, uc);
	}
	
	protected void adjustStatusAfterExecuteScripts(List<Task> tasks, UserContext uc) throws Exception {
		for (Task task : tasks) {
			List<Script> scripts = task.getScripts();
			if (Detect.notEmpty(scripts)) {
				for (Script script : scripts) {
					/*
					 * 如果脚本已经处于“确认成功”，“部分省份发布”，“已发布”，“已废弃”这几种状态
					 * 则脚本在主干或其他非重要分支环境上执行后不会改变状态
					 * 因为脚本在主要分支上验证通过并发布后，就算ok了，事务提交了，不能回滚了。
					 * 而脚本被废弃，则不能再改变状态了
					 */
					if (DictScriptStatus.Status.CONFIRMED_SUCCESS == script.getStatus()
							|| DictScriptStatus.Status.RELEASE_PARTIAL == script.getStatus()
							|| DictScriptStatus.Status.RELEASE_SUCCESSFUL == script.getStatus()
							|| DictScriptStatus.Status.DEPRECATED == script.getStatus()) {
						continue;
					}
					
					//所有环境执行成功
					if (EnvironmentStatusUtil.isAllEnvironmentsExecSuccessfully(script)) {
						scriptManagementService.setScriptStatusIsAllEnvExecSuccessfully(script, uc);
					}
					//所有环境都未执行
					else if (EnvironmentStatusUtil.isAllEnvironmentsNotExec(script)) {
						scriptManagementService.setScriptStatusIsNotExec(script, uc);
					}
					//分支执行成功
					else if (EnvironmentStatusUtil.isAllBranchEnvironmentsExecSuccessfullyButTrunk(script)) {
						scriptManagementService.setScriptStatusIsAllBranchExecSuccessfully(script, uc);
					}
					//执行中
					else if (EnvironmentStatusUtil.isNotAllEnvironmentsExecSuccessButNoFail(script)) {
						scriptManagementService.setScriptStatusIsExecuting(script, uc);
					}
					//执行失败
					else if (EnvironmentStatusUtil.isExistEnvironmentExecFail(script)) {
						scriptManagementService.setScriptStatusIsExecFail(script, uc);
					}					
				}
			}
			
			/*
			 * 如果任务已经处于“所有脚本确认成功”，“部分省份发布”，“已发布”这3种状态
			 * 则任务在主干或其他非重要分支环境上执行后不会改变状态
			 * 因为任务在主要分支上验证通过并发布后，就算ok了，事务提交了，不能回滚了。
			 */
			if (DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS == task.getStatus()
					|| DictTaskStatus.Status.RELEASE_PARTIAL_DESTINATION == task.getStatus()
					|| DictTaskStatus.Status.RELEASE_SUCCESSFUL == task.getStatus()) {
				continue;
			}
			
			//所有脚本确认成功
			if (ScriptStatusUtil.isAllScriptsConfirmSuccessfully(task)) {
				taskManagementService.setTaskStatusIsAllConfirmed(task, uc);
			}
			//所有脚本成功执行或在所有分支成功执行
			else if (ScriptStatusUtil.isAllScriptsExecSuccessfully(task)) {
				taskManagementService.setTaskStatusIsAllExecuted(task, uc);
			}
			//所有脚本都未执行
			else if (ScriptStatusUtil.isAllScriptsNotExec(task)) {
				taskManagementService.setTaskStatusIsNotExec(task, uc);
			}
			//部分脚本执行
			else if (ScriptStatusUtil.isSomeScriptsExecuted(task)) {
				taskManagementService.setTaskStatusIsPartiallyExecuted(task, uc);
			}			
		}
	}
	
	
/*	private Collection<Task> filterDuplicateTasks(Collection<Task> tasks) {
		Map<Long, Task> map = new HashMap<Long, Task>();
		for (Task t : tasks) {
			map.put(t.getId(), t);
		}
		return map.values();
	}*/
	
	public synchronized void executeScriptOnEnvironment(String environmentCode, List<Script> scripts, List<String> executeResults, UserContext uc)
		throws Exception {
		Assertion.notEmpty(environmentCode, "输入的环境的编码不能为空");
		Assertion.notEmpty(scripts, "输入的脚本列表不能为空");
		
		//如果脚本所属MR有执行失败的脚本，则移除这个脚本，以免被执行
		removeScriptsHasRelativeFailScript(scripts, executeResults, uc);
		//如果脚本为废弃状态，则移除，以免被执行
		removeScriptsWithDeprecatedStatus(scripts, executeResults, uc);
		
		sortScriptsByCreateTime(scripts);
		
		boolean notified = false;
		//对每个脚本的每个环境进行处理
		Set<String> errorScriptIssueIds = new HashSet<String>();
		for (Script script : scripts) {
			Task task = script.getTask();
			//如果同一个MR中之前有脚本执行失败了，则后面的脚本不执行
			if (errorScriptIssueIds.contains(task.getIssueId())) {
				executeResults.add("跳过脚本: " + task.getIssueId() + ", 任务名=" + task.getName() + ", 脚本名=" + script.getName() + ", 因为有相关脚本执行失败，所以不执行");
				continue;
			}
			List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
			if (null != relations) {
				for (ScriptEnvironmentRelation relation : relations) {
					if (environmentCode.equalsIgnoreCase(relation.getEnvironment().getCode()) && 
							(DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()
							|| DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus())) {//环境是上海分支 && (环境状态==未执行 || 环境状态==执行失败)
						try {
							executeScriptAndNotify(script, relation, notified, "这是用户手工指定环境执行的", uc);
							executeResults.add("执行成功: " + script.getTask().getIssueId() + ", 任务名=" + script.getTask().getName() + ", 脚本名=" + script.getName() + ", 环境编码=" + environmentCode);
						} catch (Exception e) {
							errorScriptIssueIds.add(task.getIssueId());
							executeResults.add("执行失败: " + script.getTask().getIssueId() + ", 任务名=" + script.getTask().getName() + ", 脚本名=" + script.getName() + ", 环境编码=" + environmentCode);
							log.error(e, e);
							StringBuffer sb = new StringBuffer();
							sb.append("/jk出错啦，赶紧看日志，msg=").append(e.getMessage());
							messageNotifyService.notifyAdministrators(script.getTask().getUser(), sb.toString(), uc);
						}
						
						if (!notified) {
							notified = true;
						}
					}
				}
			}
		}
		
		afterExecuteScripts(scripts, uc);
	}
	
/*	public void executeScriptOnBranch(List<Script> scripts, UserContext uc)
			throws Exception {
		executeScriptOnEnvironment("BRANCH", scripts, uc);
		sortScriptsByCreateTime(scripts);
		
		//对每个脚本的每个环境进行处理
		for (Script script : scripts) {
			List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
			if (null != relations) {
				for (ScriptEnvironmentRelation relation : relations) {
					if ("BRANCH".equalsIgnoreCase(relation.getEnvironment().getCode()) && 
							(DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()
							|| DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus())) {//环境是分支 && (环境状态==未执行 || 环境状态==执行失败)
						setScriptAndEnvironmentIsExecuting(script, relation, uc);//脚本设为执行中，环境设为执行中
						//执行脚本
						executeScript(relation, relation.getEnvironment(), script, uc);
					}
				}
			}
		}
		
		afterExecuteScripts(scripts, uc);
	}*/

/*	public void executeScriptOnShBranch(List<Script> scripts, UserContext uc)
			throws Exception {
		executeScriptOnEnvironment("BRANCH_SH", scripts, uc);
		sortScriptsByCreateTime(scripts);

		//对每个脚本的每个环境进行处理
		for (Script script : scripts) {
			List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
			if (null != relations) {
				for (ScriptEnvironmentRelation relation : relations) {
					if ("BRANCH_SH".equalsIgnoreCase(relation.getEnvironment().getCode()) && 
							(DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()
							|| DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus())) {//环境是上海分支 && (环境状态==未执行 || 环境状态==执行失败)
						setScriptAndEnvironmentIsExecuting(script, relation, uc);//脚本设为执行中，环境设为执行中
						//执行脚本
						executeScript(relation, relation.getEnvironment(), script, uc);
					}
				}
			}
		}
		
		afterExecuteScripts(scripts, uc);
	}*/

/*	public void executeScriptOnTrunk(List<Script> scripts, UserContext uc)
			throws Exception {
		executeScriptOnEnvironment("TRUNK", scripts, uc);
		sortScriptsByCreateTime(scripts);

		//对每个脚本的每个环境进行处理
		for (Script script : scripts) {
			List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
			if (null != relations) {
				for (ScriptEnvironmentRelation relation : relations) {
					if (relation.getEnvironment().getTrunk() && 
							(DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()
							|| DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus())) {//环境是主干 && (环境状态==未执行 || 环境状态==执行失败)
						setScriptAndEnvironmentIsExecuting(script, relation, uc);//脚本设为执行中，环境设为执行中
						//执行脚本
						executeScript(relation, relation.getEnvironment(), script, uc);
					}
				}
			}
		}
		
		afterExecuteScripts(scripts, uc);
	}*/
	
	public void preReleaseValidate(List<Task> tasks, UserContext uc) throws Exception {
		for (Task task : tasks) {
			if (DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS == task.getStatus()
					|| DictTaskStatus.Status.RELEASE_PARTIAL_DESTINATION == task.getStatus()
					|| DictTaskStatus.Status.RELEASE_SUCCESSFUL == task.getStatus()) {
				
				List<Script> scripts = task.getScripts();
				if (Detect.notEmpty(scripts)) {
					for (Script script : scripts) {
						if (DictScriptStatus.Status.CONFIRMED_SUCCESS != script.getStatus()
								&& DictScriptStatus.Status.RELEASE_PARTIAL != script.getStatus()
								&& DictScriptStatus.Status.RELEASE_SUCCESSFUL != script.getStatus()) {
							throw new IllegalStateException("脚本当前状态不是(确认成功/部分发布/发布成功)其中一种，不能发布，MR编号=" + task.getIssueId() + "，脚本名称=" + script.getName());
						}
						if (0 == script.getExecuteSeq()) {
							throw new IllegalStateException("脚本没有在任何分支上执行过，不能发布，MR编号=" + task.getIssueId() + "，脚本名称=" + script.getName());
						}
					}
				}
			} else {
				throw new IllegalStateException("任务当前状态不是(确认成功/部分发布/发布成功)其中一种，不能发布，MR编号=" + task.getIssueId() + "，任务名称=" + task.getName());
			}
		}
	}

	public InputStream releaseScripts(String fileName, List<Task> tasks, String timeStamp, UserContext uc)
			throws Exception {
		/*
		 * 压缩包内容格式如下
		 * fileName.zip
		 *    |---zhejiang-20130307.zip
		 *    |         |---sql_execute_list.txt
		 *    |         |---sql_description.txt
		 *    |         |---xxx.sql
		 *    |         |---yyy.sql
		 *    |         ...
		 *    |         |---zzz.sql
		 *    |
		 *    |---shanghai-20130307.zip
		 *    |         |---sql_execute_list.txt
		 *    |         |---sql_description.txt
		 *    |         |---xxx.sql
		 *    |         |---yyy.sql
		 *    |         ...
		 *    |         |---zzz.sql
		 *    ...
		 */
		
		List<Destination> allDestinations = destinationAccessService.findAll(uc);
		//每个destination（省份）一个zip包
		byte[][] byteArraysOfDestinationZips = new byte[allDestinations.size()][];
		List<String> destinationNamesInZip = new ArrayList<String>();
		
		//把所有task的script放在一起按分支上执行顺序排序
		List<Script> allScripts = new ArrayList<Script>();
		for (Task t : tasks) {
			allScripts.addAll(t.getScripts());
		}
		sortScriptsByExecuteSeq(allScripts);
		
		String sqlListDescription = "";
		
		//对每个发布省份开始打包
		for (int i=0; i< allDestinations.size(); i++) {
			Destination destination = allDestinations.get(i);
			
			/*
			 * fileNamesInDestinationZip和fileContentsInDestinationZip是一对，一个是zip中的文件名，对应的是zip中的文件内容
			 * 目前包括
			 * readme.txt
			 * sql脚本
			 * sql_execute_list.txt
			 * sql_description.txt
			 * batch_update_sql_execute_list.txt //批量刷数据脚本
			 * WARNING_sql_execute_list.txt //开发提交时没写是批量刷数据脚本，但公司执行了较长时间，需要现场自己判断
			 */
			List<String> fileNamesInDestinationZip = new ArrayList<String>();
			List<String> fileContentsInDestinationZip = new ArrayList<String>();
			
			String provinceName = destination.getCode();
			String destinationZipName = provinceName + "-" + timeStamp;
			String scriptExecutePathInPlsql = destination.getScriptExecutePathInPlsql();
			scriptExecutePathInPlsql = scriptExecutePathInPlsql + destinationZipName;
			//zip包中的readme.txt写了是哪个省份
			fileNamesInDestinationZip.add("readme.txt");
			String readme = "这是" + destination.getName() + "的脚本升级包" +
					"\r\nsql_execute_list.txt是执行列表" +
					"\r\nsql_description.txt是脚本说明" +
					"\r\nbatch_update_sql_execute_list.txt是批量刷数据脚本的执行列表" +
					"\r\nWARNING_sql_execute_list.txt是开发提交时没写是批量刷数据脚本，但公司执行了较长时间，需要现场与公司沟通的说明。\r\n";
			fileContentsInDestinationZip.add(readme);
			
			//默认的sql执行清单
			StringBuffer sqlExecListStrBuf = new StringBuffer();
			sqlExecListStrBuf.append("--" + destination.getName() + " scripts\r\n");
			
			//批量刷数据的sql执行清单
			StringBuffer batchUpdateSqlExecListStrBuf = new StringBuffer();
			batchUpdateSqlExecListStrBuf.append("--" + destination.getName() + " batch update data scripts\r\n");
			
			StringBuffer sqlDescStrBuf = new StringBuffer();
			sqlDescStrBuf.append(destination.getName() + "脚本说明\r\n");
			
			StringBuffer sqlWarningStrBuf = new StringBuffer();
			sqlWarningStrBuf.append(destination.getName() + "在公司执行时间较长的脚本清单，需要现场与公司沟通是否要从sql_execute_list.txt中取出来单独执行\r\n");
			
			
			for (Script script : allScripts) {
				//每个脚本名称由"执行seq+脚本名"构成，这样工程人员拿到脚本后按名称排序就知道执行顺序了
				String scriptNameInDestinationZip = script.getExecuteSeq() + "-" + script.getName();
				String scriptContentInDestinationZip = script.getScriptContent();
				List<Destination> destinationsOfScript = script.getDestinations();
				for (Destination destinationOfScript : destinationsOfScript) {
					long destIdOfScript = destinationOfScript.getId();
					//此脚本要发布到这个省份的包里
					if (destination.getId() == destIdOfScript) {
						
						
						boolean isBatchUpdateSql = false;
						boolean isLikeBatchUpdateSql = false;
						{
							List<ScriptEnvironmentRelation> envRelations = script.getEnvironmentRelations();
							for (ScriptEnvironmentRelation relation : envRelations) {
								int execPoint = relation.getExecutePoint();
								
								if (DictExecutePoint.Point.BEFORE_DAWN == execPoint) {//如果脚本有一个环境是晚上执行的就提取出来，放在批量刷数据的清单中
									isBatchUpdateSql = true;
								}
								
								String timeStr = relation.getLatestElapsedTime();
								timeStr = timeStr.substring(0, timeStr.indexOf("秒"));
								Float time = Float.parseFloat(timeStr);
								
								if (sqlExecTimeShreshold < time) {//如果脚本有一个环境的执行时间超过阀值，则记录在警告信息里，由现场人员决定
									isLikeBatchUpdateSql = true;
								}
							}
						}
						
						fileNamesInDestinationZip.add(scriptNameInDestinationZip);
						fileContentsInDestinationZip.add(scriptContentInDestinationZip);
						
						if (isBatchUpdateSql) {
							//保存到批量刷数据的执行序列中							

							batchUpdateSqlExecListStrBuf.append("prompt 'begin " + scriptNameInDestinationZip + ";'\r\n");
							batchUpdateSqlExecListStrBuf.append("column scriptname noprint new_value scriptname;\r\n");
							batchUpdateSqlExecListStrBuf.append("select decode(count(1),0,'" + scriptExecutePathInPlsql + "\\" + scriptNameInDestinationZip + "','该脚本已经执行了 " + scriptNameInDestinationZip + "') as scriptname From db_scriptPatch where Scriptname = '" + scriptNameInDestinationZip + "' and endTime is not null;\r\n");
							batchUpdateSqlExecListStrBuf.append("insert into db_scriptPatch (id, Scriptname, startTime) select seq_db_scriptPatch.Nextval, '" + scriptNameInDestinationZip + "', sysdate from dual where not exists (select * From db_scriptPatch where Scriptname = '" + scriptNameInDestinationZip + "' and endTime is not null);\r\n");
							batchUpdateSqlExecListStrBuf.append("commit;\r\n");
							batchUpdateSqlExecListStrBuf.append("prompt 'exec' &&scriptname;\r\n");
							batchUpdateSqlExecListStrBuf.append("@&&scriptname;\r\n");
							batchUpdateSqlExecListStrBuf.append("update db_scriptPatch set endTime=sysdate where id=(select max(id) from db_scriptPatch);\r\n");
							batchUpdateSqlExecListStrBuf.append("commit;\r\n");
							batchUpdateSqlExecListStrBuf.append("prompt 'end " + scriptNameInDestinationZip + ";'\r\n\r\n");
							
							sqlDescStrBuf.append("\r\n---------------------------------------------------\r\n")
								.append(scriptNameInDestinationZip + "\t" + script.getMemo() + "\r\n");
						} else {
							//如果有一个环境执行时间超过10分钟的输出到警告说明里
							{
								if (isLikeBatchUpdateSql) {
									sqlWarningStrBuf.append("\r\n---------------------------------------------------\r\n")
									.append(scriptNameInDestinationZip + "\t" + script.getMemo() + "\r\n");
								}								
							}

							sqlExecListStrBuf.append("prompt 'begin " + scriptNameInDestinationZip + ";'\r\n");
							sqlExecListStrBuf.append("column scriptname noprint new_value scriptname;\r\n");
							sqlExecListStrBuf.append("select decode(count(1),0,'" + scriptExecutePathInPlsql + "\\" + scriptNameInDestinationZip + "','该脚本已经执行了 " + scriptNameInDestinationZip + "') as scriptname From db_scriptPatch where Scriptname = '" + scriptNameInDestinationZip + "' and endTime is not null;\r\n");
							sqlExecListStrBuf.append("insert into db_scriptPatch (id, Scriptname, startTime) select seq_db_scriptPatch.Nextval, '" + scriptNameInDestinationZip + "', sysdate from dual where not exists (select * From db_scriptPatch where Scriptname = '" + scriptNameInDestinationZip + "' and endTime is not null);\r\n");
							sqlExecListStrBuf.append("commit;\r\n");
							sqlExecListStrBuf.append("prompt 'exec' &&scriptname;\r\n");
							sqlExecListStrBuf.append("@&&scriptname;\r\n");
							sqlExecListStrBuf.append("update db_scriptPatch set endTime=sysdate where id=(select max(id) from db_scriptPatch);\r\n");
							sqlExecListStrBuf.append("commit;\r\n");
							sqlExecListStrBuf.append("prompt 'end " + scriptNameInDestinationZip + ";'\r\n\r\n");
							
							sqlDescStrBuf.append("\r\n---------------------------------------------------\r\n")
								.append(scriptNameInDestinationZip + "\t" + script.getMemo() + "\r\n");
						}

					}
				}
			}
			
			fileNamesInDestinationZip.add("sql_execute_list.txt");
			fileContentsInDestinationZip.add(sqlExecListStrBuf.toString());
			
			fileNamesInDestinationZip.add("batch_update_sql_execute_list.txt");
			fileContentsInDestinationZip.add(batchUpdateSqlExecListStrBuf.toString());
			
			fileNamesInDestinationZip.add("sql_description.txt");
			fileContentsInDestinationZip.add(sqlDescStrBuf.toString());
			
			fileNamesInDestinationZip.add("WARNING_sql_execute_list.txt");
			fileContentsInDestinationZip.add(sqlWarningStrBuf.toString());
			
			sqlListDescription += sqlDescStrBuf.toString();
			sqlListDescription += "\r\n\r\n####################################################\r\n\r\n";
			
			
			byte[] bytesOfDestinationZip = ZipUtil.zipFiles(fileNamesInDestinationZip, fileContentsInDestinationZip);
			
			byteArraysOfDestinationZips[i] = bytesOfDestinationZip;
			destinationNamesInZip.add(destinationZipName + ".zip");
		}

		byte[] bytes = ZipUtil.zipFiles(destinationNamesInZip, byteArraysOfDestinationZips);
		
		for (Task task : tasks) {
			taskManagementService.setTaskStatusIsReleaseSuccessfully(task, uc);
			for (Script script : task.getScripts()) {
				scriptManagementService.setScriptStatusIsReleaseSuccessfully(script, uc);
			}
		}

		ByteArrayInputStream streamOfReleasePackage = new ByteArrayInputStream(bytes);

		ExecuteLog log = new ExecuteLog();
		log.setTaskId(0);
		log.setScriptId(0);
		log.setEnvironmentId(0);
		log.setCreateTime(DateUtil.getCurrentDate());
		log.setElapsedTime("");
		log.setTitle("脚本发布,发布包=" + fileName);
		log.setMessage(sqlListDescription);
		
		log = logManagementService.saveLog(log, uc);
		
		//备份发布包
		releasePackageBigDataAccessService.save(fileName, streamOfReleasePackage);
		streamOfReleasePackage.reset();
		
		//通知
		StringBuffer sb = new StringBuffer();
		if (Detect.notEmpty(allScripts)) {
			sb.append("\r发布包括以下脚本\r");
			for (Script s : allScripts) {
				sb.append(s.getName()).append("\r");
			}
		}		
		User user = uc.getUser();
		messageNotifyService.notifyUserAndAdministrators(user, log.getTitle() + sb.toString(), uc);
		
		return streamOfReleasePackage;
	}

	public synchronized void synchronizeFromEnvToEnv(String srcEnvCode, String destEnvCode, List<Script> scripts, List<List<String>> results, UserContext uc)
			throws Exception {
		Assertion.notEmpty(srcEnvCode, "源环境编码不能为空");
		Assertion.notEmpty(destEnvCode, "目的环境编码不能为空");
		Assertion.notEmpty(scripts, "输入的脚本列表不能为空");
		
		Set<String> errorScriptIssueIds = new HashSet<String>();
		Set<String> scriptIssueIds = new HashSet<String>();
		List<String> executeResults = new ArrayList<String>();
		
		//如果脚本所属MR有执行失败的脚本，则移除这个脚本，以免被执行
		removeScriptsHasRelativeFailScript(scripts, executeResults, uc);
		//如果脚本为废弃状态，则移除，以免被执行
		removeScriptsWithDeprecatedStatus(scripts, executeResults, uc);
		
		try {
			sortScriptsByEnvLatestExecuteTime(scripts, srcEnvCode, executeResults);
			
			boolean notified = false;
			
			//对每个脚本的每个环境进行处理
			for (Script script : scripts) {
				Task task = script.getTask();
				scriptIssueIds.add(task.getIssueId());
				//如果同一个MR中之前有脚本执行失败了，则后面的脚本不执行
				if (errorScriptIssueIds.contains(task.getIssueId())) {
					executeResults.add("跳过同步: " + task.getIssueId() + ", 任务名=" + task.getName() + ", 脚本名=" + script.getName() + ", 环境编码=" + destEnvCode + " 因为有相关脚本执行失败，所以不进行同步");
					continue;
				}
				
				boolean srcEnvExecuteSuccess = false;
				List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
				if (null != relations) {
					for (ScriptEnvironmentRelation relation : relations) {
						if (srcEnvCode.equals(relation.getEnvironment().getCode()) && 
								(DictEnvironmentStatus.Status.EXEC_SUCCESS == relation.getStatus())) {//源环境成功执行
							srcEnvExecuteSuccess = true;
						}
					}
				}
				
				if (null != relations && srcEnvExecuteSuccess) {//源环境成功执行
					for (ScriptEnvironmentRelation relation : relations) {
						if (destEnvCode.equals(relation.getEnvironment().getCode()) && 
								(DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus())) {//目的环境没执行
							
							executeResults.add("开始同步: " + task.getIssueId() + ", 任务名=" + task.getName() + ", 脚本名=" + script.getName() + ", 环境编码=" + destEnvCode + " 正从环境编码=" + srcEnvCode + "进行同步");
							try {
								executeScriptAndNotify(script, relation, notified, "这是用户手工进行环境间脚本同步，从" + srcEnvCode + "同步到" + destEnvCode, uc);
							} catch (Exception e) {
								errorScriptIssueIds.add(task.getIssueId());
								log.error(e, e);
								StringBuffer sb = new StringBuffer();
								sb.append("/jk出错啦，赶紧看日志，msg=").append(e.getMessage());
								messageNotifyService.notifyAdministrators(script.getTask().getUser(), sb.toString(), uc);
							}
							
							if (!notified) {
								notified = true;
							}
						}
					}
				}
			}
			
			if (notified) {
				User user = uc.getUser();
				StringBuffer sb = new StringBuffer();
				sb.append("执行脚本结束, 调用人=").append(user.getName());
				messageNotifyService.notifyAdministrators(user, sb.toString(), uc);
				notified = true;
			}
			
			afterExecuteScripts(scripts, uc);
		} catch (Exception e) {
			executeResults.add(e.getMessage());
		} finally {
			List<String> list = new ArrayList<String>();
			for (String str : scriptIssueIds) {
				list.add(str);
			}
			results.add(list);
			
			list = new ArrayList<String>();
			for (String str : errorScriptIssueIds) {
				list.add(str);
			}
			results.add(list);
			
			results.add(executeResults);
		}
	}

	public void updateScriptStatusToConfirmSuccess(List<Task> tasks, StringBuffer errorLog,
			UserContext uc) throws Exception {
		for (Task task : tasks) {
			List<Script> scripts = task.getScripts();
			if (Detect.notEmpty(scripts)) {
				for (Script script : scripts) {
					//所有环境执行成功
					if (EnvironmentStatusUtil.isAllEnvironmentsExecSuccessfully(script)) {
						try {
							scriptManagementService.setScriptStatusIsConfirmSuccessfully(script, uc);
							errorLog.append(task.getIssueId() + "，更新脚本" + script.getName() + "为确认成功\r\n");
						} catch (Exception e) {
							errorLog.append(task.getIssueId() + "，更新脚本" + script.getName() + "为确认成功失败，原因为" + e.getMessage() + "\r\n");
						}
					}
					//分支执行成功
					else if (EnvironmentStatusUtil.isAllBranchEnvironmentsExecSuccessfullyButTrunk(script)) {
						try {
							scriptManagementService.setScriptStatusIsConfirmSuccessfully(script, uc);
							errorLog.append(task.getIssueId() + "，更新脚本" + script.getName() + "为确认成功\r\n");
						} catch (Exception e) {
							errorLog.append(task.getIssueId() + "，更新脚本" + script.getName() + "为确认成功失败，原因为" + e.getMessage() + "\r\n");
						}						
					}
				}
			}

			//所有脚本确认
			if (ScriptStatusUtil.isAllScriptsConfirmSuccessfully(task)) {
				try {
					taskManagementService.setTaskStatusIsAllConfirmed(task, uc);
					errorLog.append(task.getIssueId() + "，更新任务" + task.getName() + "为确认成功\r\n");
				} catch (Exception e) {
					errorLog.append(task.getIssueId() + "，更新任务" + task.getName() + "为确认成功失败，原因为" + e.getMessage() + "\r\n");
				}				
			}
		}
	}

	public void updateScriptStatusToPartialRelease(List<Task> tasks, String memo,
			UserContext uc) throws Exception {
		for (Task task : tasks) {
			if (DictTaskStatus.Status.RELEASE_SUCCESSFUL == task.getStatus()) {
				
				List<Script> scripts = task.getScripts();
				if (Detect.notEmpty(scripts)) {
					for (Script script : scripts) {
						if (DictScriptStatus.Status.RELEASE_SUCCESSFUL != script.getStatus()) {
							throw new IllegalStateException("脚本当前状态不允许转换到部分发布状态, scriptStatus=" + script.getStatus());
						}
					}
					
					for (Script script : scripts) {
						if (Detect.notEmpty(memo)) {
							script.setMemo(script.getMemo() + "\r\n" + memo);
						}						
						scriptManagementService.setScriptStatusIsReleasePartially(script, uc);
					}
				}
			}
			taskManagementService.setTaskStatusIsReleasePartially(task, uc);
		}
	}

	public void setScriptManagementService(
			ScriptManagementService scriptManagementService) {
		this.scriptManagementService = scriptManagementService;
	}

	public void setTaskManagementService(TaskManagementService taskManagementService) {
		this.taskManagementService = taskManagementService;
	}

	public void setMessageNotifyService(MessageNotifyService messageNotifyService) {
		this.messageNotifyService = messageNotifyService;
	}

	public String getScriptContentEncoding() {
		return scriptContentEncoding;
	}

	public void setScriptContentEncoding(String scriptContentEncoding) {
		this.scriptContentEncoding = scriptContentEncoding;
	}

	public void setReleasePackageBigDataAccessService(
			BigDataAccessService<BigDataFsLocator> releasePackageBigDataAccessService) {
		this.releasePackageBigDataAccessService = releasePackageBigDataAccessService;
	}


}
