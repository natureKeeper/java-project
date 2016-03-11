package com.asb.cdd.scriptmanage.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.asb.cdd.scriptmanage.dao.access.DictScriptStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.ScriptCriteria;
import com.asb.cdd.scriptmanage.service.ScriptManagementService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.entity.BigDataFsLocator;
import com.asb.cdd.scriptmanage.service.util.ScriptStatusUtil;
import com.irm.system.authorization.vo.UserContext;
import com.irm.system.bigdata.service.BigDataAccessService;
import common.util.Detect;

public class ScriptManagementServiceImpl implements ScriptManagementService {
	
	private String scriptContentEncoding = "utf-8";

	public void setScriptStatusIsAllBranchExecSuccessfully(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.EXECUTING == script.getStatus()
				|| DictScriptStatus.Status.EXEC_FAIL == script.getStatus()
				|| DictScriptStatus.Status.ALL_BRANCH_ENV_EXEC_SUCCESS == script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.ALL_BRANCH_ENV_EXEC_SUCCESS);
			scriptAccessService.update(script, uc);
		} else {
			throw new IllegalStateException("脚本当前状态不允许转换到分支执行成功状态, scriptName=" + script.getName() + ", scriptStatus=" + ScriptStatusUtil.unmarshal(script.getStatus()));
		}		
	}

	public void setScriptStatusIsAllEnvExecSuccessfully(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.EXECUTING == script.getStatus()
				|| DictScriptStatus.Status.EXEC_FAIL == script.getStatus()
				|| DictScriptStatus.Status.ALL_ENV_EXEC_SUCCESS == script.getStatus()
				|| DictScriptStatus.Status.ALL_BRANCH_ENV_EXEC_SUCCESS == script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.ALL_ENV_EXEC_SUCCESS);
			scriptAccessService.update(script, uc);
		} else {
			throw new IllegalStateException("脚本当前状态不允许转换到所有环境执行成功状态, scriptName=" + script.getName() + ", scriptStatus=" + ScriptStatusUtil.unmarshal(script.getStatus()));
		}
	}
	
	public void setScriptStatusIsConfirmSuccessfully(Script script,
			UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.ALL_ENV_EXEC_SUCCESS == script.getStatus()
				|| DictScriptStatus.Status.ALL_BRANCH_ENV_EXEC_SUCCESS == script.getStatus()
				|| DictScriptStatus.Status.CONFIRMED_SUCCESS == script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.CONFIRMED_SUCCESS);
			scriptAccessService.update(script, uc);
		} else {
			throw new IllegalStateException("脚本当前状态不允许转换到确认成功状态, scriptName=" + script.getName() + ", scriptStatus=" + ScriptStatusUtil.unmarshal(script.getStatus()));
		}
	}
	
	public void setScriptStatusIsReleasePartially(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.RELEASE_SUCCESSFUL == script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.RELEASE_PARTIAL);
			scriptAccessService.update(script, uc);
		} else {
			throw new IllegalStateException("脚本当前状态不允许转换到部分发布状态, scriptName=" + script.getName() + ", scriptStatus=" + ScriptStatusUtil.unmarshal(script.getStatus()));
		}
	}
	
	public void setScriptStatusIsReleaseSuccessfully(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.CONFIRMED_SUCCESS == script.getStatus()
				|| DictScriptStatus.Status.RELEASE_PARTIAL == script.getStatus()
				|| DictScriptStatus.Status.RELEASE_SUCCESSFUL == script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.RELEASE_SUCCESSFUL);
			scriptAccessService.update(script, uc);
		} else {
			throw new IllegalStateException("脚本当前状态不允许转换到发布成功状态, scriptName=" + script.getName() + ", scriptStatus=" + ScriptStatusUtil.unmarshal(script.getStatus()));
		}
	}

	public void setScriptStatusIsExecFail(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.EXEC_FAIL != script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.EXEC_FAIL);
			scriptAccessService.update(script, uc);
		}
	}

	public void setScriptStatusIsExecuting(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.EXECUTING != script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.EXECUTING);
			scriptAccessService.update(script, uc);
		}
	}

	public void setScriptStatusIsNotExec(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.WAIT_EXEC != script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.WAIT_EXEC);
			scriptAccessService.update(script, uc);
		}
	}
	
	public void setScriptStatusIsDeprecated(Script script, UserContext uc) throws IllegalStateException {
		if (DictScriptStatus.Status.DEPRECATED != script.getStatus()) {
			script.setStatus(DictScriptStatus.Status.DEPRECATED);
			scriptAccessService.update(script, uc);
		}
	}

	private ScriptAccessService scriptAccessService;
	private BigDataAccessService<BigDataFsLocator> scriptBigDataAccessService;

	public void setScriptAccessService(ScriptAccessService scriptAccessService) {
		this.scriptAccessService = scriptAccessService;
	}

	public Script queryScriptById(long id, UserContext uc) {
		Script script = scriptAccessService.findById(id, uc);
		if (null != script) {
			BigDataFsLocator locator = new BigDataFsLocator();
			locator.setPath(script.getScriptLocation().replaceAll("\\\\", "\\\\"));
			String content = scriptBigDataAccessService.loadAsString(locator, scriptContentEncoding);
			script.setScriptContent(content);
		}
		return script;
	}

	public void setScriptBigDataAccessService(
			BigDataAccessService<BigDataFsLocator> scriptBigDataAccessService) {
		this.scriptBigDataAccessService = scriptBigDataAccessService;
	}

	private DictScriptStatusAccessService dictScriptStatusAccessService;
	public List<DictScriptStatus> queryAllScriptStatus(UserContext uc)
			throws Exception {
		return dictScriptStatusAccessService.findAll(uc);
	}

	public void setScriptContentEncoding(String scriptContentEncoding) {
		this.scriptContentEncoding = scriptContentEncoding;
	}

	public void setDictScriptStatusAccessService(
			DictScriptStatusAccessService dictScriptStatusAccessService) {
		this.dictScriptStatusAccessService = dictScriptStatusAccessService;
	}

	public List<Script> queryScriptsByStatus(int status, UserContext uc)
			throws Exception {
		if (0 < status) {
			ScriptCriteria criteria = new ScriptCriteria();
			criteria.setStatus(status);
			return scriptAccessService.find(criteria, uc);
		} else {
			return new ArrayList<Script>();
		}
	}

	private TaskScriptManagementService taskScriptManagementService;
	
	public List<Script> findScriptsByConditions(String issueId, int taskStatus,
			int scriptStatus, int environmentStatus, String environmentCode,
			UserContext uc) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		if (Detect.notEmpty(issueId)) {
			if (issueId.endsWith("$")) {
				issueId = issueId.substring(0, issueId.length()-1);
				map.put("issueId", issueId);
			} else {
				map.put("issueId_like", issueId);
			}			
		}
		if (0 < taskStatus) {
			map.put("taskStatus", Integer.valueOf(taskStatus));
		}
		if (0 < scriptStatus) {
			map.put("scriptStatus", Integer.valueOf(scriptStatus));
		}		
		if (0 < environmentStatus && Detect.notEmpty(environmentCode)) {
			map.put("environmentStatus", Integer.valueOf(environmentStatus));
			map.put("environmentCode", environmentCode);
		}
		//不输入条件不允许查询
		if (!Detect.notEmpty(map)) {
			return new ArrayList<Script>();
		}
		List<Script> scripts = scriptAccessService.findScriptsByConditions(map, uc);
		if (Detect.notEmpty(scripts)) {
			long[] ids = new long[scripts.size()];
			for (int i=0; i<ids.length; i++) {
				ids[i] = scripts.get(i).getId();
			}
			scripts = taskScriptManagementService.cascadeQueryScripts(ids, uc);
		}
		return scripts;
	}

	public void setTaskScriptManagementService(
			TaskScriptManagementService taskScriptManagementService) {
		this.taskScriptManagementService = taskScriptManagementService;
	}

	public void updateScriptContent(Script script, UserContext uc)
			throws Exception {
		BigDataFsLocator bdl = scriptBigDataAccessService.save(script.getName(), script.getScriptContent());
		script.setScriptLocation(bdl.getPath());
		scriptAccessService.update(script, uc);
	}

	
}
