package com.asb.cdd.scriptmanage.service.util;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import common.util.Detect;

public class ScriptStatusUtil {

	/**
	 * 是否所有脚本都执行成功
	 * @param relations
	 * @return
	 */
	public static boolean isAllScriptsExecSuccessfully(Task task) {
		//任务的所有脚本都处于分支执行成功，所有环境执行成功，确认成功3种状态之一才算成功
		List<Script> scripts = task.getScripts();
		if (Detect.notEmpty(scripts)) {
			boolean allScriptSuccessful = true;
			for (Script script : scripts) {
				if (DictScriptStatus.Status.ALL_ENV_EXEC_SUCCESS == script.getStatus()
						|| DictScriptStatus.Status.ALL_BRANCH_ENV_EXEC_SUCCESS == script.getStatus()
						|| DictScriptStatus.Status.CONFIRMED_SUCCESS == script.getStatus()) {
					allScriptSuccessful &= true;
				} else {
					allScriptSuccessful &= false;
				}
			}
			//最后要排除所有脚本都确认成功的场景
			if (allScriptSuccessful && !isAllScriptsConfirmSuccessfully(task)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}		
	}
	
	/**
	 * 是否所有脚本都确认成功
	 * @param relations
	 * @return
	 */
	public static boolean isAllScriptsConfirmSuccessfully(Task task) {
		List<Script> scripts = task.getScripts();
		if (Detect.notEmpty(scripts)) {
			boolean allScriptSuccessful = true;
			for (Script script : scripts) {
				if (DictScriptStatus.Status.CONFIRMED_SUCCESS == script.getStatus()) {
					allScriptSuccessful &= true;
				} else {
					allScriptSuccessful &= false;
				}
			}
			return allScriptSuccessful;
		} else {
			return false;
		}
	}
	
	/**
	 * 是否部分脚本执行过
	 * @param relations
	 * @return
	 */
	public static boolean isSomeScriptsExecuted(Task task) {
		//不是所有脚本未执行
		if (isAllScriptsNotExec(task)) {
			return false;
		}
		//不是所有脚本执行成功
		if (isAllScriptsExecSuccessfully(task)) {
			return false;
		}
		//不是所有脚本确认成功
		if (isAllScriptsConfirmSuccessfully(task)) {
			return false;
		}
		//不存在已发布或部分发布的脚本
		List<Script> scripts = task.getScripts();
		if (Detect.notEmpty(scripts)) {
			boolean someScriptReleased = false;
			for (Script script : scripts) {
				if (DictScriptStatus.Status.RELEASE_SUCCESSFUL == script.getStatus()
						|| DictScriptStatus.Status.RELEASE_PARTIAL == script.getStatus()) {
					someScriptReleased |= true;
				} else {
					someScriptReleased |= false;
				}
			}
			if (someScriptReleased) {
				return false;
			}
		} else {
			return false;
		}
		//以上条件都不成立，则认为是部分执行过
		return true;
	}
	
	/**
	 * 是否所有脚本都没执行
	 * @param relations
	 * @return
	 */
	public static boolean isAllScriptsNotExec(Task task) {
		List<Script> scripts = task.getScripts();
		if (Detect.notEmpty(scripts)) {
			boolean allScriptSuccessful = true;
			for (Script script : scripts) {
				if (DictScriptStatus.Status.WAIT_EXEC == script.getStatus()) {
					allScriptSuccessful &= true;
				} else {
					allScriptSuccessful &= false;
				}
			}
			return allScriptSuccessful;
		} else {
			return false;
		}
	}
	
	/**
	 * 是否任务本身和相关所有脚本都废弃
	 * @param relations
	 * @return
	 */
	public static boolean isAllScriptsDeprecated(Task task) {
		//任务的所有脚本都处于废弃状态，任务也是废弃
		List<Script> scripts = task.getScripts();
		if (Detect.notEmpty(scripts)) {
			boolean allScriptDeprecated = true;
			for (Script script : scripts) {
				if (DictScriptStatus.Status.DEPRECATED == script.getStatus()) {
					allScriptDeprecated &= true;
				} else {
					allScriptDeprecated &= false;
				}
			}
			return allScriptDeprecated && (DictTaskStatus.Status.DEPRECATED == task.getStatus());
		} else {
			return DictTaskStatus.Status.DEPRECATED == task.getStatus();
		}		
	}
	
	public static String unmarshal(int status) {
		String result = "未定义";
		switch (status) {
		case DictScriptStatus.Status.ALL_BRANCH_ENV_EXEC_SUCCESS:
			result = "所有分支环境执行成功";
			break;
		case DictScriptStatus.Status.ALL_ENV_EXEC_SUCCESS:
			result = "所有环境执行成功";
			break;
		case DictScriptStatus.Status.CONFIRMED_SUCCESS:
			result = "确认成功";
			break;
		case DictScriptStatus.Status.EXEC_FAIL:
			result = "执行失败（一个环境失败就失败）";
			break;
		case DictScriptStatus.Status.EXECUTING:
			result = "执行中（有环境执行，但不是所有都执行成功）";
			break;
		case DictScriptStatus.Status.NO_NEED_EXEC:
			result = "不用执行";
			break;
		case DictScriptStatus.Status.RELEASE_PARTIAL:
			result = "部分省份发布";
			break;
		case DictScriptStatus.Status.RELEASE_SUCCESSFUL:
			result = "发布成功";
			break;
		case DictScriptStatus.Status.WAIT_EXEC:
			result = "等待执行";
			break;
		case DictScriptStatus.Status.DEPRECATED:
			result = "已废弃";
			break;
		}
		return result;
	}
}
