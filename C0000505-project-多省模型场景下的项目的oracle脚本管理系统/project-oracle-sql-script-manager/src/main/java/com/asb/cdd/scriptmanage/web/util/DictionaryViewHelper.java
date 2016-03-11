package com.asb.cdd.scriptmanage.web.util;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.DictEnvironmentStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictExecutePointAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictScriptStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictScriptTypeAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictTaskStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictExecutePoint;
import com.asb.cdd.scriptmanage.dao.access.model.DictModel;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptType;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.irm.system.authorization.vo.UserContext;

public class DictionaryViewHelper<T extends DictModel> {

	private DictExecutePointAccessService dictExecutePointAccessService;
	private DictScriptTypeAccessService dictScriptTypeAccessService;
	private DictTaskStatusAccessService dictTaskStatusAccessService;
	private DictScriptStatusAccessService dictScriptStatusAccessService;
	private DictEnvironmentStatusAccessService dictEnvironmentStatusAccessService;
	
	public String getExecutePointName(long executePointId) {
		DictExecutePoint d = dictExecutePointAccessService.findById(executePointId, UserContext.getUserContext());
		return d.getName();
	}

	public String getScriptTypeName(int scriptTypeId) {
		DictScriptType d = dictScriptTypeAccessService.findById(scriptTypeId, UserContext.getUserContext());
		return d.getName();
	}
	
	public String getScriptTypeCode(int scriptTypeId) {
		DictScriptType d = dictScriptTypeAccessService.findById(scriptTypeId, UserContext.getUserContext());
		return d.getCode();
	}

	public String getTaskStatusName(int taskStatusId) {
		DictTaskStatus d = dictTaskStatusAccessService.findById(taskStatusId, UserContext.getUserContext());
		return d.getName();
	}

	public String getScriptStatusName(int scriptStatusId) {
		DictScriptStatus d = dictScriptStatusAccessService.findById(scriptStatusId, UserContext.getUserContext());
		return d.getName();
	}

	public String getEnvironmentStatusName(int environmentStatusId) {
		DictEnvironmentStatus d = dictEnvironmentStatusAccessService.findById(environmentStatusId, UserContext.getUserContext());
		return d.getName();
	}
	
	/**
	 * 把字典值列表按ordinal排序
	 * @param dictionaries
	 * @return
	 */
	public List<T> sortDictionaryByOrdinal(List<T> dictionaries) {
		Collections.sort(dictionaries, new Comparator<DictModel>() {

			public int compare(DictModel o1, DictModel o2) {
				if (o1.getOrdinal() > o2.getOrdinal()) {
					return 1;
				} else {
					return -1;
				}
			}
		});
		return dictionaries;
	}

	public DictExecutePointAccessService getDictExecutePointAccessService() {
		return dictExecutePointAccessService;
	}

	public void setDictExecutePointAccessService(DictExecutePointAccessService dictExecutePointAccessService) {
		this.dictExecutePointAccessService = dictExecutePointAccessService;
	}

	public DictScriptTypeAccessService getDictScriptTypeAccessService() {
		return dictScriptTypeAccessService;
	}

	public void setDictScriptTypeAccessService(DictScriptTypeAccessService dictScriptTypeAccessService) {
		this.dictScriptTypeAccessService = dictScriptTypeAccessService;
	}

	public DictTaskStatusAccessService getDictTaskStatusAccessService() {
		return dictTaskStatusAccessService;
	}

	public void setDictTaskStatusAccessService(DictTaskStatusAccessService dictTaskStatusAccessService) {
		this.dictTaskStatusAccessService = dictTaskStatusAccessService;
	}

	public DictScriptStatusAccessService getDictScriptStatusAccessService() {
		return dictScriptStatusAccessService;
	}

	public void setDictScriptStatusAccessService(DictScriptStatusAccessService dictScriptStatusAccessService) {
		this.dictScriptStatusAccessService = dictScriptStatusAccessService;
	}

	public DictEnvironmentStatusAccessService getDictEnvironmentStatusAccessService() {
		return dictEnvironmentStatusAccessService;
	}

	public void setDictEnvironmentStatusAccessService(DictEnvironmentStatusAccessService dictEnvironmentStatusAccessService) {
		this.dictEnvironmentStatusAccessService = dictEnvironmentStatusAccessService;
	}
}
