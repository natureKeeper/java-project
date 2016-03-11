package com.asb.cdd.scriptmanage.service;

import java.io.InputStream;
import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptDestinationRelation;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.irm.system.authorization.vo.UserContext;

public interface TaskScriptManagementService {

	Task saveTask(Task task, List<Script> scripts, List<ScriptDestinationRelation> scriptDestRelations, List<ScriptEnvironmentRelation> scriptEnvRelations, UserContext userContext) throws Exception;
	
	/**
	 * 得到任务的唯一id,以便生成提交页面
	 * @return
	 */
	long getTaskUniqueId();
	
	/**
	 * 查询所有脚本,测试用途
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> queryAllScripts(UserContext uc) throws Exception;
	
	/**
	 * 根据脚本id列表级联查询脚本及相关信息
	 * @param scriptIds
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> cascadeQueryScripts(long[] scriptIds, UserContext uc) throws Exception;
	
	/**
	 * 查询任一环境未执行的脚本,以便手工执行
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> queryScriptsAnyEnvWaitingExec(UserContext uc) throws Exception;
	
	/**
	 * 查询任一环境执行失败的脚本,以便修正再执行
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> queryScriptsAnyEnvExecFail(UserContext uc) throws Exception;
	
	/**
	 * 查询所有环境执行成功的脚本,以便手工确认成功
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> queryScriptsAllEnvExecSuccess(UserContext uc) throws Exception;
	
	/**
	 * 查询确认成功或部分发布的脚本,以便发布
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> queryScriptsConfirmSuccessOrPartiallyRelease(UserContext uc) throws Exception;
	
	/**
	 * 扫描未执行和部分脚本执行的任务,以便自动执行
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Task> queryTasksNeedToExec(UserContext uc) throws Exception;
	
	/**
	 * 加载这些任务下未执行，执行中的脚本,以便自动执行
	 * @param tasks
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	List<Script> queryScriptsNeedToExec(List<Task> tasks, UserContext uc) throws Exception;
	
	/**
	 * 把脚本,脚本环境关系的状态设为执行中
	 * 前提是脚本状态为未执行,执行中,执行失败,脚本环境关系状态为未执行,执行失败
	 * @param script
	 * @param relation
	 * @param uc
	 * @throws Exception
	 */
	//void setScriptAndEnvironmentIsExecuting(Script script, ScriptEnvironmentRelation relation, UserContext uc) throws Exception;
	
	/**
	 * 把脚本环境关系的状态设为成功
	 * 前提是状态为执行中
	 * @param relation
	 * @param uc
	 * @throws Exception
	 */
	//void setScriptEnvironmentRelationIsExecSuccessfully(ScriptEnvironmentRelation relation, UserContext uc) throws Exception;
	
	/**
	 * 把脚本设为执行成功的状态
	 * 前提是脚本状态为未执行，执行中，执行失败
	 * @param script
	 * @param uc
	 * @throws Exception
	 */
	//void setScriptIsExecSuccessfully(Script script, UserContext uc) throws Exception;
	
	/**
	 * 把脚本环境关系的状态设为失败
	 * 前提是状态为执行中
	 * @param relation
	 * @param uc
	 * @throws Exception
	 */
	//void setScriptEnvironmentRelationIsExecFail(ScriptEnvironmentRelation relation, UserContext uc) throws Exception;
	
	/**
	 * 把任务状态设为部分执行
	 * 前提是任务状态为未执行,部分执行
	 * @param task
	 * @param uc
	 * @throws Exception
	 */
	//void setTaskIsExecPartially(Task task, UserContext uc) throws Exception;
	
	/**
	 * 把任务状态设为成功执行
	 * 前提是任务状态为未执行,部分执行
	 * @param task
	 * @param uc
	 * @throws Exception
	 */
	//void setTaskIsExecSuccessfully(Task task, UserContext uc) throws Exception;
	
	/**
	 * 返回是否允许提交脚本
	 * @return
	 */
	public boolean isAllowSubmitScript();

	/**
	 * 设置是否允许提交脚本
	 * @param allowSubmitScript
	 */
	public void setAllowSubmitScript(boolean allowSubmitScript);
	
	/**
	 * 自动执行脚本
	 * @param scripts
	 * @param uc
	 * @throws Exception
	 */
	public void executeScriptNormally(List<Script> scripts, List<String> resultLogs, UserContext uc) throws Exception;
	
	/**
	 * 把选中的未执行或执行失败的脚本在指定环境上执行，执行顺序为按脚本id排序
	 * @param environmentCode
	 * @param scripts
	 * @param uc
	 * @throws Exception
	 */
	public void executeScriptOnEnvironment(String environmentCode, List<Script> scripts, List<String> executeResults, UserContext uc) throws Exception;

	/**
	 * 把选中的整体执行成功的脚本和所属任务设置为验证成功状态
	 * （仅在要执行的分支都执行成功或不需要执行时才能把脚本设为验证成功，仅在所有脚本都验证成功才能把任务设为验证成功）
	 * 没选中任务下所有脚本则报错
	 * @param scripts
	 * @param uc
	 * @throws Exception
	 */
	public void updateScriptStatusToConfirmSuccess(List<Task> tasks, StringBuffer errorLog, UserContext uc) throws Exception;
	
	/**
	 * 把选中脚本和任务设置为部分发布状态，同时要求更新备注（仅在脚本状态为已发布时）
	 * 没选中任务下所有脚本则报错
	 * @param scripts
	 * @param uc
	 * @throws Exception
	 */
	public void updateScriptStatusToPartialRelease(List<Task> tasks, String memo, UserContext uc) throws Exception;
	
	/**
	 * 同步环境1的脚本到环境2（在开新分支情况下或要先在主干验证再在分支执行情况下使用，把主干执行成功，分支未执行的执行）
	 * 没选中任务下所有脚本则报错
	 * @param envCode1
	 * @param envCode2
	 * @param scripts
	 * @param uc
	 * @throws Exception
	 */
	public void synchronizeFromEnvToEnv(String envCode1, String envCode2, List<Script> scripts, List<List<String>> results, UserContext uc) throws Exception;
	
	/**
	 * 发布脚本前验证脚本状态
	 * @param tasks
	 * @param uc
	 * @throws Exception
	 */
	public void preReleaseValidate(List<Task> tasks, UserContext uc) throws Exception;
	
	/**
	 * 把选中的验证成功或部分发布的任务发布，按任务的脚本在分支上执行顺序排序
	 * 没选中任务下所有脚本则报错
	 * @param fileName 生成的发布包的名称
	 * @param tasks
	 * @param timeStamp
	 * @param uc
	 * @throws Exception
	 */
	public InputStream releaseScripts(String fileName, List<Task> tasks, String timeStamp, UserContext uc) throws Exception;
	
	/**
	 * 采集脚本所属的任务id列表
	 * @param scripts
	 * @return
	 */
	public long[] collectTaskIdsOfScripts(List<Script> scripts);
	
	/**
	 * 采集任务下脚本的id列表
	 * @param tasks
	 * @return
	 */
	public long[] collectScriptIdsOfTasks(List<Task> tasks);
	
	/**
	 * 递归查询任务及其相关信息
	 * @param taskIds
	 * @param uc
	 * @return
	 * @throws Exception
	 */
	public List<Task> cascadeQueryTasks(long[] taskIds, UserContext uc) throws Exception;
	
	/**
	 * 把脚本按创建时间排序
	 * @param scripts
	 */
	public void sortScriptsByCreateTime(List<Script> scripts);
	
	/**
	 * 把脚本按分支上的执行顺序排序，在发布脚本时，发布的脚本的执行顺序应该按照分支上的执行顺序来
	 * @param scripts
	 */
	public void sortScriptsByExecuteSeq(List<Script> scripts);
	
	/**
	 * 根据提供的环境编码，把脚本按环境上的执行顺序排序，以便在别的环境上按同样顺序执行（做环境间脚本同步用的）
	 * @param scripts
	 * @param envCode
	 */
	public void sortScriptsByEnvLatestExecuteTime(List<Script> scripts, String envCode, List<String> executeResults);
	
	/**
	 * 调整任务，脚本，和环境的状态
	 * @param tasks
	 * @param uc
	 * @throws Exception
	 */
	public void adjustTaskScriptEnvironmentStatus(List<Task> tasks, UserContext uc) throws Exception;
}
