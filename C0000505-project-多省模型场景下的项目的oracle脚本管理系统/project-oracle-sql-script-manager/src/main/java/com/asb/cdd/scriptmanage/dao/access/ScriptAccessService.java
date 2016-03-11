package com.asb.cdd.scriptmanage.dao.access;

import java.util.List;
import java.util.Map;

import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.irm.system.access.common.service.AbstractNamespaceAccessService;
import com.irm.system.authorization.vo.UserContext;

public interface ScriptAccessService extends AbstractNamespaceAccessService<Script> {
	
	public List<Script> findByTaskIds(long[] taskIds, UserContext uc);
	
	public List<Script> findScriptsByConditions(Map<String, Object> map, UserContext uc);
	
	public Script update(Script script, UserContext uc);
}
