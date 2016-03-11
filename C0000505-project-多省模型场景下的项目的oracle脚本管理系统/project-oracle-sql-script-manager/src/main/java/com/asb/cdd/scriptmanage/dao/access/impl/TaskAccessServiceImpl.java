package com.asb.cdd.scriptmanage.dao.access.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.irm.system.access.common.service.impl.AbstractNamespaceAccessServiceImpl;
import com.irm.system.authorization.vo.UserContext;

public class TaskAccessServiceImpl extends AbstractNamespaceAccessServiceImpl<Task> implements TaskAccessService {

	private static final transient Log log = LogFactory.getLog(TaskAccessServiceImpl.class);
	
	private static final String FIND_BY_ISSUEIDS = "findByIssueIds";
	
	public List<Task> findByIssueIds(String[] issueIds, UserContext uc) {
		Map<String,Object> parameters=new HashMap<String,Object>();
		parameters.put("issueIds", issueIds);		
		List<Task> results = this.getIbatisDataAccessObject().find(this.getNamespace(), FIND_BY_ISSUEIDS, parameters);
		return results;
	}
	
	public Task update(Task task, UserContext uc) {
		//检测哪里导致version有乐观锁错误
//		try {
//			throw new Exception(task.getName() + "，状态=" + task.getStatus() + "，版本=" + task.getVersion());
//		} catch (Exception e) {
//			log.error(e, e);
//		}
		return super.update(task, uc);
	}
}
