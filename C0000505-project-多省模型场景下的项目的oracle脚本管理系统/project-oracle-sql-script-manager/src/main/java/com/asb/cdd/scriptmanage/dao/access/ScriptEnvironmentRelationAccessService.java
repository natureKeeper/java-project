package com.asb.cdd.scriptmanage.dao.access;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.irm.system.access.common.service.AbstractNamespaceAccessService;
import com.irm.system.authorization.vo.UserContext;

public interface ScriptEnvironmentRelationAccessService extends AbstractNamespaceAccessService<ScriptEnvironmentRelation> {
	public List<ScriptEnvironmentRelation> findByScriptId(long scriptId, UserContext userContext);
	
	/**
	 * 查找给定scriptId集中非成功的记录
	 * @param scriptIds
	 * @param userContext
	 * @return
	 */
	public List<ScriptEnvironmentRelation> findUnSuccessRelationWithScriptIds(long[] scriptIds, UserContext userContext);
}
