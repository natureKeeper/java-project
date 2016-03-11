package com.asb.cdd.scriptmanage.service.impl;

import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Issue;
import com.asb.cdd.scriptmanage.dao.access.model.IssueTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.dao.access.model.Task2;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.TaskCriteria;
import com.asb.cdd.scriptmanage.service.IssueTaskQueryService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.irm.model.system.User;
import com.irm.system.authorization.vo.UserContext;
import common.util.Detect;

@Path("/issueTaskQueryService")
public class IssueTaskQueryServiceImpl implements IssueTaskQueryService{
	
	private TaskAccessService taskAccessService;
	private TaskScriptManagementService taskScriptManagementService;
	private static final transient Log log = LogFactory.getLog(IssueTaskQueryServiceImpl.class);
	
	@POST
	@Path("/getIssueStatus")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Issue getIssueStatus(Issue i) {
		if (i==null || i.getIssueId()==null){
			i = new Issue();
			i.setIssueTaskStatus(IssueTaskStatus.noExist);
			return i;
		}
		
		TaskCriteria tc = new TaskCriteria();
		tc.setIssueId(i.getIssueId());
		List<Task> tasks = taskAccessService.find(tc, new UserContext());
		if (!Detect.notEmpty(tasks)){
			i.setIssueTaskStatus(IssueTaskStatus.noExist);
			return i;
		}
		
		int status = DictTaskStatus.Status.RELEASE_SUCCESSFUL;
		List<Task2> task2s = new ArrayList<Task2>();
		for(Iterator<Task> it = tasks.iterator(); it.hasNext();){
			Task t = it.next();
			if (t.getStatus()==DictTaskStatus.Status.DEPRECATED){
				it.remove();
				continue;
			}
			
			if (t.getStatus()<status){
				status = t.getStatus();
			}
			
			Task2 t2 = new Task2();
			task2s.add(t2);
			try {
				BeanUtils.copyProperties(t2, t);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
		}
		
		i.setTasks(task2s);
		i.setIssueTaskStatus(IssueTaskStatus.get((short)status));
		return i;
	}

	
	@POST
	@Path("/release")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public InputStream release(Issue i) {
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd-HHmmss");
		String timeStamp = sdf.format(DateUtil.getCurrentDate());
		String fileName = "scripts-" + timeStamp + ".zip";
		List<Task> tasks = convert(i.getTasks());
		
		try {
			UserContext uc = new UserContext();
			uc.setUser(new User());
			InputStream in = null;
			if (tasks!=null){
				in = taskScriptManagementService.releaseScripts(fileName, tasks , timeStamp , uc);
			}
			return in;
		} catch (Exception e) {
			log.error(e, e);
		}
		
		return null;
	}
	
	
	private List<Task> convert(List<Task2> tasks) {
		long t[]=new long[tasks.size()];
		for(int i=0;i<tasks.size();i++){
			t[i] = tasks.get(i).getId();
		}
		List<Task> ts = taskAccessService.findByIds(t, new UserContext());
		return ts;
	}


	public TaskAccessService getTaskAccessService() {
		return taskAccessService;
	}

	public void setTaskAccessService(TaskAccessService taskAccessService) {
		this.taskAccessService = taskAccessService;
	}


	public TaskScriptManagementService getTaskScriptManagementService() {
		return taskScriptManagementService;
	}


	public void setTaskScriptManagementService(TaskScriptManagementService taskScriptManagementService) {
		this.taskScriptManagementService = taskScriptManagementService;
	}
	
	
}
