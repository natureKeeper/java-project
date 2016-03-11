package com.asb.cdd.scriptmanage.dao.access.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.asb.cdd.scriptmanage.dao.access.ScriptDestinationRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptDestinationRelation;
import com.irm.system.access.common.service.impl.AbstractNamespaceAccessServiceImpl;
import com.irm.system.authorization.vo.UserContext;

public class ScriptDestinationRelationAccessServiceImpl 
extends AbstractNamespaceAccessServiceImpl<ScriptDestinationRelation> 
implements ScriptDestinationRelationAccessService {
	
	private static final String FIND_BY_SCRIPT_ID = "findByScriptId";

	public List<ScriptDestinationRelation> findByScriptId(long scriptId, UserContext userContext) {
		Map<String,Object> parameters=new HashMap<String,Object>();
		parameters.put("scriptId", scriptId);		
		List<ScriptDestinationRelation> results = this.getIbatisDataAccessObject().find(this.getNamespace(), FIND_BY_SCRIPT_ID, parameters);
		return results;
	}

}
