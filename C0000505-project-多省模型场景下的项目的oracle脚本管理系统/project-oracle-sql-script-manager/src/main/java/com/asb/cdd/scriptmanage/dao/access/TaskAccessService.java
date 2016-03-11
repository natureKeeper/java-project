package com.asb.cdd.scriptmanage.dao.access;

import java.util.List;

import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.irm.system.access.common.service.AbstractNamespaceAccessService;
import com.irm.system.authorization.vo.UserContext;

public interface TaskAccessService extends AbstractNamespaceAccessService<Task> {
	
	/**
	 * 根据issue id列表找task
	 * @param issueIds
	 * @param uc
	 * @return
	 */
	public List<Task> findByIssueIds(String[] issueIds, UserContext uc);
	
	public Task update(Task task, UserContext uc);
}
