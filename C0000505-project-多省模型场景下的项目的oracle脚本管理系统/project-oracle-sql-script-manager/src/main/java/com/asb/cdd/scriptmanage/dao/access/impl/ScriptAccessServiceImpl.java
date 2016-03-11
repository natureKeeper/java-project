package com.asb.cdd.scriptmanage.dao.access.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.ScriptAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.irm.system.access.common.service.impl.AbstractNamespaceAccessServiceImpl;
import com.irm.system.authorization.vo.UserContext;

public class ScriptAccessServiceImpl extends AbstractNamespaceAccessServiceImpl<Script> 
implements ScriptAccessService {
	
	private static final transient Log log = LogFactory.getLog(ScriptAccessServiceImpl.class);

	private static final String FIND_BY_TASK_IDS = "findByTaskIds";
	
	private static final String FIND_SCRIPTS_BY_CONDITIONS = "findScriptsByConditions";
	
	public List<Script> findByTaskIds(long[] taskIds, UserContext uc) {
		Map<String,Object> parameters=new HashMap<String,Object>();
		parameters.put("taskIds", taskIds);		
		List<Script> results = this.getIbatisDataAccessObject().find(this.getNamespace(), FIND_BY_TASK_IDS, parameters);
		return results;
	}

	public List<Script> findScriptsByConditions(Map<String, Object> map,
			UserContext uc) {
		List<Script> results = this.getIbatisDataAccessObject().find(this.getNamespace(), FIND_SCRIPTS_BY_CONDITIONS, map);
		return results;
	}
	
	public Script update(Script script, UserContext uc) {
		//检测哪里导致version有乐观锁错误
//		try {
//			throw new Exception(script.getName() + "，状态=" + script.getStatus() + "，版本=" + script.getVersion());
//		} catch (Exception e) {
//			log.error(e, e);
//		}
		return super.update(script, uc);
	}

}
