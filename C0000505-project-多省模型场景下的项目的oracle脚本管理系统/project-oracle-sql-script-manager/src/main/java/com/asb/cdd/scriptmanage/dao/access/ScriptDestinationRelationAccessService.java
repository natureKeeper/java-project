package com.asb.cdd.scriptmanage.dao.access;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.ScriptDestinationRelation;
import com.irm.system.access.common.service.AbstractNamespaceAccessService;
import com.irm.system.authorization.vo.UserContext;

public interface ScriptDestinationRelationAccessService extends AbstractNamespaceAccessService<ScriptDestinationRelation> {
	
	public List<ScriptDestinationRelation> findByScriptId(long scriptId, UserContext userContext);
}
