package com.asb.cdd.scriptmanage.service.util;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import common.util.Detect;

public class EnvironmentStatusUtil {

	/**
	 * 是否所有环境都成功
	 * @param relations
	 * @return
	 */
	public static boolean isAllEnvironmentsExecSuccessfully(Script script) {
		List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
		if (Detect.notEmpty(relations)) {
			boolean allSuccess = true;
			for (ScriptEnvironmentRelation relation : relations) {
				if (DictEnvironmentStatus.Status.EXEC_SUCCESS == relation.getStatus()) {
					allSuccess &= true;
				} else {
					allSuccess &= false;
				}
			}
			return allSuccess;
		} else {
			return false;
		}
	}
	
	/**
	 * 是否所有分支执行成功，但主要的主干没成功
	 * 至于非主要主干，执行成功和失败都无所谓
	 * 考虑异常情况：
	 * 如果脚本不需要在主干执行，则仅判断分支
	 * 如果脚本不需要在分支执行，则当这些分支执行成功
	 * 如果脚本只需要在某些分支执行，则当那些分支执行成功
	 * @param relations
	 * @return
	 */
	public static boolean isAllBranchEnvironmentsExecSuccessfullyButTrunk(Script script) {
		List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
		if (Detect.notEmpty(relations)) {
			boolean allBranchSuccessAndTrunkFail = true;
			for (ScriptEnvironmentRelation relation : relations) {
				if (DictEnvironmentStatus.Status.EXEC_SUCCESS == relation.getStatus()
						&& relation.getEnvironment().isBranch()) {
					allBranchSuccessAndTrunkFail &= true;
				} else if (DictEnvironmentStatus.Status.EXEC_SUCCESS != relation.getStatus()	
						&& relation.getEnvironment().isMainTrunk()) {
					allBranchSuccessAndTrunkFail &= true;
				} else if (relation.getEnvironment().isOtherTrunk()) {
					allBranchSuccessAndTrunkFail &= true;
				} else {
					allBranchSuccessAndTrunkFail &= false;
				}
			}
			return allBranchSuccessAndTrunkFail;
		} else {
			return false;
		}
	}
	
	/**
	 * 是否所有环境都没执行
	 * @param relations
	 * @return
	 */
	public static boolean isAllEnvironmentsNotExec(Script script) {
		List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
		if (Detect.notEmpty(relations)) {
			boolean allNotExec = true;
			for (ScriptEnvironmentRelation relation : relations) {
				if (DictEnvironmentStatus.Status.WAIT_EXEC == relation.getStatus()) {
					allNotExec &= true;
				} else {
					allNotExec &= false;
				}
			}
			return allNotExec;
		} else {
			return false;
		}
	}
	
	/**
	 * 有环境执行失败
	 * @param relations
	 * @return
	 */
	public static boolean isExistEnvironmentExecFail(Script script) {
		List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
		if (Detect.notEmpty(relations)) {
			boolean existsFail = false;
			for (ScriptEnvironmentRelation relation : relations) {
				if (DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus()) {
					existsFail |= true;
				} else {
					existsFail |= false;
				}
			}
			return existsFail;
		} else {
			return false;
		}
	}
	
	/**
	 * 有执行不成功的环境，但没有执行失败的环境
	 * @return
	 */
	public static boolean isNotAllEnvironmentsExecSuccessButNoFail(Script script) {
		List<ScriptEnvironmentRelation> relations = script.getEnvironmentRelations();
		if (Detect.notEmpty(relations)) {
			boolean existsNotSuccess = false;
			for (ScriptEnvironmentRelation relation : relations) {
				if (DictEnvironmentStatus.Status.EXEC_SUCCESS != relation.getStatus()) {
					existsNotSuccess |= true;
				} else {
					existsNotSuccess |= false;
				}
			}
			
			boolean existsFail = false;
			for (ScriptEnvironmentRelation relation : relations) {
				if (DictEnvironmentStatus.Status.EXEC_FAIL == relation.getStatus()) {
					existsFail |= true;
				} else {
					existsFail |= false;
				}
			}
			return existsNotSuccess && !existsFail;
		} else {
			return false;
		}
	}
	
}
