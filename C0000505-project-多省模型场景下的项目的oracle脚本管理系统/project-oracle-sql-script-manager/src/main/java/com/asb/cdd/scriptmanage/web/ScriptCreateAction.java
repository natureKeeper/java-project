package com.asb.cdd.scriptmanage.web;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.DestinationAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictExecutePointAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictScriptTypeAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictTaskStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.EnvironmentAccessService;
import com.asb.cdd.scriptmanage.dao.access.LogAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptDestinationRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptEnvironmentRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Destination;
import com.asb.cdd.scriptmanage.dao.access.model.DictEnvironmentStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictExecutePoint;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptStatus;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptType;
import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptDestinationRelation;
import com.asb.cdd.scriptmanage.dao.access.model.ScriptEnvironmentRelation;
import com.asb.cdd.scriptmanage.dao.access.model.Task;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.ScriptManagementService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.asb.cdd.scriptmanage.service.util.ExecutePointUtil;
import com.asb.cdd.scriptmanage.web.util.DictionaryViewHelper;
import com.asb.cdd.scriptmanage.web.vo.ScriptTable;
import com.irm.model.system.User;
import com.irm.web.system.common.action.AbstractAction;
import common.util.Detect;
import common.util.FileUtil;
import common.util.Utf8ByteOrderMarkRemover;

public class ScriptCreateAction extends AbstractAction {

	private static final transient Log log = LogFactory.getLog(ScriptCreateAction.class);
	/**
	 * 
	 */
	private static final long serialVersionUID = -7956088208914284058L;
	
	private DestinationAccessService destinationAccessService;
	private EnvironmentAccessService environmentAccessService;
	private LogAccessService logAccessService;
	private ScriptAccessService scriptAccessService;
	private ScriptDestinationRelationAccessService scriptDestinationRelationAccessService;
	private ScriptEnvironmentRelationAccessService scriptEnvironmentRelationAccessService;
	private TaskAccessService taskAccessService;
	private TaskScriptManagementService taskScriptManagementService;
	private DictExecutePointAccessService dictExecutePointAccessService;
	private DictScriptTypeAccessService dictScriptTypeAccessService;
	private DictTaskStatusAccessService dictTaskStatusAccessService;
	private ScriptManagementService scriptManagementService;
	private DictionaryViewHelper dictionaryViewHelper;
	
	public void setDictionaryViewHelper(DictionaryViewHelper dictionaryViewHelper) {
		this.dictionaryViewHelper = dictionaryViewHelper;
	}


	private MessageNotifyService messageNotifyService;
	
	private static final String PAGE_FORM_LISTVALUE_SPLITER = ", ";
	
	private static final String RESUBMIT_SUCCESS = "resubmitSuccess";
	
	List<Destination> destinations;
	List<Environment> environments;
	List<DictExecutePoint> dictExecutePoints;
	List<DictScriptType> dictScriptTypes;
	
	private String errorMessage;
	
	public String index(){
		return "index";
	}
	
	public String scriptUpdate(){
		
		return "scriptUpdate";
	}
	public String newscriptUpdate(){
		return "newscriptUpdate";
	}
	
	/* 
	 * 返回提交脚本页面
	 * @see com.irm.web.system.common.action.AbstractAction#execute()
	 */
	public String execute() throws Exception {
		if (!taskScriptManagementService.isAllowSubmitScript()) {
			return "deny";
		}
		long taskUniqueId = taskScriptManagementService.getTaskUniqueId();
		taskName = "taskSeq" + taskUniqueId + "-" + this.getUserContext().getUser().getUsername();
		
		destinations = destinationAccessService.findAll(this.getUserContext());
		Collections.sort(destinations, new Comparator<Destination>() {

			public int compare(Destination o1, Destination o2) {
				if (o1.getId() > o2.getId()) {
					return 1;
				} else {
					return -1;
				}
			}

		});
		environments = environmentAccessService.findAll(this.getUserContext());
		Collections.sort(environments, new Comparator<Environment>() {

			public int compare(Environment o1, Environment o2) {
				if (o1.getOrdinal() > o2.getOrdinal()) {
					return 1;
				} else {
					return -1;
				}
			}

		});
		dictExecutePoints = dictExecutePointAccessService.findAll(this.getUserContext());
		Collections.sort(dictExecutePoints, new Comparator<DictExecutePoint>() {

			public int compare(DictExecutePoint o1, DictExecutePoint o2) {
				if (o1.getOrdinal() > o2.getOrdinal()) {
					return 1;
				} else {
					return -1;
				}
			}

		});
		dictScriptTypes = dictScriptTypeAccessService.findAll(this.getUserContext());
		Collections.sort(dictScriptTypes, new Comparator<DictScriptType>() {

			public int compare(DictScriptType o1, DictScriptType o2) {
				if (o1.getOrdinal() > o2.getOrdinal()) {
					return 1;
				} else {
					return -1;
				}
			}

		});
		return "form";
	}
	
	
	private String taskName;
	private String issueId;
	private String taskMemo;
	private String taskDestination;//要发布的地方
	private String taskEnvironment;//用户选中要执行的环境
	private String taskEnvironmentExecutePoint;//每个环境对应的执行时间点，格式为：环境id-时间点id
	private List<ScriptTable> scripts = new ArrayList<ScriptTable>();
	
	private List<File> files;
	private List<String> filesFileName;
	private List<String> filesContentType;
	
	/**
	 * 提交脚本
	 * @return
	 * @throws Exception
	 */
	public String submitForm() throws Exception {
		if (!taskScriptManagementService.isAllowSubmitScript()) {
			Thread.sleep(3000);
			if (!taskScriptManagementService.isAllowSubmitScript()) {
				return "deny";
			}
		}
		
		try {
			validateIssueIdFormat();
		} catch (Exception e) {
			errorMessage = "校验输入异常: " + e.getMessage();
			return SUCCESS;
		}
		
		try {
			validateSelectedEnvRelation(taskEnvironment);
		} catch (Exception e) {
			errorMessage = "校验输入异常: " + e.getMessage();
			return SUCCESS;
		}
		
		try {
			validateUtf8WithBomFile();
		} catch (Exception e) {
			errorMessage = "校验文件异常: " + e.getMessage();
			return SUCCESS;
		}
		
		//对提交的脚本排序
		Collections.sort(scripts, new Comparator<ScriptTable>() {
			public int compare(ScriptTable o1, ScriptTable o2) {
				if (o1.getSequence() > o2.getSequence()) {
					return 1;
				} else {
					return -1;
				}
			}
		});
		
		Task task = assembleTask();
		List<Script> scripts = assembleScripts(task);
		List<ScriptDestinationRelation> scriptDestRelations = assembleScriptDestinationRelations(scripts, taskDestination);
		List<ScriptEnvironmentRelation> scriptEnvRelations = assembleScriptEnvironmentRelations(scripts, taskEnvironment, taskEnvironmentExecutePoint);
		
		try {
			for (Script s : scripts) {
				validateScriptContent(s);
			}
		} catch (Exception e) {
			errorMessage = "校验文件异常: " + e.getMessage();
			return SUCCESS;
		}
		
		taskScriptManagementService.saveTask(task, scripts, scriptDestRelations, scriptEnvRelations, this.getUserContext());
		
		User user = this.getUserContext().getUser();
		StringBuffer sb = new StringBuffer();
		sb.append("提交脚本通知, 用户名=").append(user.getName());
		sb.append("\r任务名称=").append(task.getName());
		sb.append("\rMR编号=").append(task.getIssueId());
		sb.append("\r任务描述=" + task.getMemo());
		
		sb.append("\r各环境执行要求");
		Script s = scripts.get(0);
		for (ScriptEnvironmentRelation ser : scriptEnvRelations) {
			if (ser.getScriptId() == s.getId()) {
				sb.append("\r环境: ").append(ser.getEnvironment().getName()).append(", 执行点: " + ExecutePointUtil.unmarshal(ser.getExecutePoint()));
			}			
		}
		sb.append("\r发布省份: ");
		for (ScriptDestinationRelation sdr : scriptDestRelations) {
			if (sdr.getScriptId() == s.getId()) {
				sb.append(sdr.getDestination().getName()).append(" ");
			}
		}
		
		messageNotifyService.notifyAdministrators(user, sb.toString(), this.getUserContext());
		
		return SUCCESS;
	}
	
	private long scriptId;
	/**
	 * 重新提交脚本
	 * 如果之前提交的脚本有问题导致出错，需要修改的，使用此功能更新系统中的脚本
	 * @return
	 * @throws Exception
	 */
	public String resubmitScript() throws Exception {
		StringBuffer sb = new StringBuffer();
		File f = files.get(0);
		String fileName = filesFileName.get(0);
		byte[] bytes = FileUtil.readFileAsBytes(f);
		if (!Utf8ByteOrderMarkRemover.containsBom(bytes)) {
			sb.append(fileName + " 脚本文件的编码类型不是带BOM头的utf-8格式，请用记事本的另存为功能保存为utf-8格式\r\n");
		}
		if (0 < sb.length()) {
			errorMessage = "校验文件异常: " + sb.toString();
			return RESUBMIT_SUCCESS;
		}
		
		Script s = scriptAccessService.findById(scriptId, getUserContext());
		s.setOriginName(fileName);
		s.setMemo(s.getMemo() + ", 重新提交了");
		String content = getFileContentFromUploadStream(f);
		s.setScriptContent(content);
		
		try {
			validateScriptContent(s);
		} catch (Exception e) {
			errorMessage = "校验文件异常: " + e.getMessage();
			return SUCCESS;
		}
		
		scriptManagementService.updateScriptContent(s, getUserContext());
		
		return RESUBMIT_SUCCESS;
	}
	
	private Task assembleTask() {
		Task task = new Task();
		task.setName(taskName);
		issueId = issueId.trim();
		task.setIssueId(issueId.toUpperCase());
		task.setMemo(taskMemo);
		task.setCreateTime(DateUtil.getCurrentDate());
		task.setStatus(DictTaskStatus.Status.WAIT_EXEC);
		//如果是不用执行的脚本则设为待执行,否则设为不用执行
/*		int taskEnvExecPoint = Integer.parseInt(taskEnvironmentExecutePoint);
		if (DictTaskStatus.Status.)
		task.setStatus(DictTaskStatus.Status.);*/
		return task;
	}
	
	private void validateUtf8WithBomFile() throws Exception {
		StringBuffer sb = new StringBuffer();
		for (int i=0; i<scripts.size(); i++) {
			File f = files.get(i);
			String fileName = filesFileName.get(i);
			byte[] bytes = FileUtil.readFileAsBytes(f);
			if (!Utf8ByteOrderMarkRemover.containsBom(bytes)) {
				sb.append(fileName + " 脚本文件的编码类型不是带BOM头的utf-8格式，请用记事本的另存为功能保存为utf-8格式\r\n");
			}
		}
		if (0 < sb.length()) {
			throw new Exception(sb.toString());
		}
	}
	
	private void validateIssueIdFormat() throws Exception {
		Pattern p = Pattern.compile("^(IRM-|CMI-)[0-9]+$");
		if (!p.matcher(issueId).matches()) {
			throw new Exception("mr编号格式不对，请检查: " + issueId);
		}
	}
	
	private void validateScriptContent(Script s) throws Exception {
		String content = s.getScriptContent();
		//通用检查
		//每条sql语句中不能有空行，否则sql执行报错
		
		String[] lines = null;
		if (content.contains("\r\n")) {
			lines = content.split("\r\n");
		} else if (content.contains("\r")) {
			lines = content.split("\r");
		} else {
			lines = content.split("\n");
		}
		
		switch (s.getScriptType()) {
		case DictScriptType.Type.DML:
			//每条sql语句必须有分号结束，分号后必须换行，不能再添加注释，否则sql执行没效果。 
			for (int i=0; i<lines.length; i++) {
				String line = lines[i];
				if (line.contains(";--")) {
					throw new Exception("脚本(" + s.getOriginName() + ")第" + (i+1) + "行有问题。每条sql语句必须有分号结束，分号后必须换行，不能再添加注释，否则sql执行没效果");
				}
			}
			
			//DML脚本中不允许有commit
			if (content.contains("\ncommit;")) {
				throw new Exception("脚本(" + s.getOriginName() + ")是DML脚本，不允许有commit");
			}
			
			//DML脚本中如果存在declare，begin和end;，则判断最后有没有加单独一行的/指示sqlplus去编译或执行，否则不允许提交，因为没有/会把sqlplus挂起
			if (content.contains("declare") || content.contains("DECLARE")
					|| content.contains("begin") && content.contains("BEGIN")
					|| content.contains("end;") && content.contains("END;")) {
				if (!content.endsWith("/")) {
					throw new Exception("脚本(" + s.getOriginName() + ")是DML脚本，且使用了批量更新语句的方式，最后一行必须是/以提示sqlplus执行");
				}				
			}
			break;
		case DictScriptType.Type.DDL:
			//每条sql语句必须有分号结束，分号后必须换行，不能再添加注释，否则sql执行没效果。 
			for (int i=0; i<lines.length; i++) {
				String line = lines[i];
				if (line.contains(";--")) {
					throw new Exception("脚本(" + s.getOriginName() + ")第" + (i+1) + "行有问题。每条sql语句必须有分号结束，分号后必须换行，不能再添加注释，否则sql执行没效果");
				}
			}
			break;
		case DictScriptType.Type.PROC:
			boolean isErrorProc = true;
			//存储过程要判断最后有没有/，否则不允许提交，因为没有/会把sqlplus挂起			
			for (int i=lines.length-1; i>=0; i++) {
				String line = lines[i];
				
				//空行可以忽略
				if ("".equals(line)) {
					continue;
				}
				
				//最后一行是/则允许提交
				if ("/".equals(line)) {
					isErrorProc = false;
					break;
				}
				
				//最后一行是exec命令，且上一行是编译存储过程的/，则允许提交
				if (line.toLowerCase().startsWith("exec ")) {
					if (i>0) {
						String preLine = lines[i-1];
						if ("/".equals(preLine)) {
							isErrorProc = false;
							break;
						}
					}
				}
				throw new Exception("脚本(" + s.getOriginName() + ")是存储过程，存储过程后必须有/提示sqlplus编译");
			}
			
			if (isErrorProc) {
				throw new Exception("脚本(" + s.getOriginName() + ")是存储过程，存储过程后必须有/提示sqlplus编译");
			}
			break;
		}
	}
	
	/**
	 * 校验选中的环境间的关系
	 * @param environmentsStr
	 * @throws Exception
	 */
	private void validateSelectedEnvRelation(String environmentsStr) throws Exception {
		String[] envIds = environmentsStr.split(PAGE_FORM_LISTVALUE_SPLITER);
		Set<String> names = new HashSet<String>();
		String name = null;
		for (String envId : envIds) {
			Environment env = environmentAccessService.findById(Long.parseLong(envId), this.getUserContext());
			if (1 < env.getName().indexOf("主干")) {
				name = env.getName().substring(0, env.getName().indexOf("主干"));
			} else if (1 < env.getName().indexOf("分支")) {
				name = env.getName().substring(0, env.getName().indexOf("分支"));
			} else {
				throw new Exception("环境的名称设置不正确，必须是xx主干或xx分支，请联系管理员修正");
			}
			if (names.contains(name)) {
				names.remove(name);
			} else {
				names.add(name);
			}
		}
		if (0 < names.size()) {
			throw new Exception("同一环境的主干和分支必须同时选中");
		}
	}
	
	private List<Script> assembleScripts(Task task) {
		List<Script> ss = new ArrayList<Script>();
		for (int i=0; i<scripts.size(); i++) {
			Script s = new Script();
			ScriptTable st = scripts.get(i);
			File f = files.get(i);
			String fileName = filesFileName.get(i);
			
			int scriptType = Integer.parseInt(st.getScriptType());
			
			String str = task.getIssueId() + "-" + dictionaryViewHelper.getScriptTypeCode(scriptType) + "-" + st.getName();
			if (!str.endsWith(".sql")) {
				str += ".sql";
			}
			s.setName(str);
			
			s.setOriginName(fileName);
			
			s.setMemo(taskMemo);
			
			String content = getFileContentFromUploadStream(f);
			s.setScriptContent(content);
			
			s.setStatus(DictScriptStatus.Status.WAIT_EXEC);
			
			s.setScriptType(scriptType);
			ss.add(s);
		}
		return ss;
	}
	
	private String getFileContentFromUploadStream(File f) {
		InputStream stream = null;
		ByteArrayOutputStream out = null;
		String str = "";
		try {
			stream = new FileInputStream(f);
			out = new ByteArrayOutputStream(8192);
			
			byte[] buffer = new byte[8192];
			int bytesRead;
			while ((bytesRead = stream.read(buffer)) != -1) {
				out.write(buffer, 0, bytesRead);
			}
			
			byte[] fileContent = out.toByteArray();
			str = new String(fileContent);
			
		} catch (Exception e) {
			log.error(e, e);
		} finally {
			if (null != stream) {
				try {
					stream.close();
				} catch (IOException e) {
					log.error(e, e);
				}
			}
			if (null != out) {
				try {
					out.close();
				} catch (IOException e) {
					log.error(e, e);
				}
			}
		}
		return str;
	}
	
	private List<ScriptDestinationRelation> assembleScriptDestinationRelations(List<Script> scripts, String destinationsStr) {
		List<ScriptDestinationRelation> relations = new ArrayList<ScriptDestinationRelation>();
		
		String[] ds = destinationsStr.split(PAGE_FORM_LISTVALUE_SPLITER);
		long[] ids = new long[ds.length];
		for (int i=0; i<ds.length; i++) {
			ids[i] = Long.parseLong(ds[i]);
		}
		
		List<Destination> dests = destinationAccessService.findByIds(ids, this.getUserContext());
		
		for (Script script : scripts) {
			for (Destination dest : dests) {
				ScriptDestinationRelation relation = new ScriptDestinationRelation();
				relation.setScript(script);
				relation.setDestination(dest);
				
				relations.add(relation);
			}
		}
		return relations;
	}
	
	private List<ScriptEnvironmentRelation> assembleScriptEnvironmentRelations(List<Script> scripts, String environmentsStr, String envExecutePointsStr) {
		List<ScriptEnvironmentRelation> relations = new ArrayList<ScriptEnvironmentRelation>();
		
		String[] es = environmentsStr.split(PAGE_FORM_LISTVALUE_SPLITER);

		Map<Environment, DictExecutePoint> envAndExecPointMap = new HashMap<Environment, DictExecutePoint>();
		String[] eeps = envExecutePointsStr.split(PAGE_FORM_LISTVALUE_SPLITER);
		for (int i=0; i<eeps.length; i++) {
			String eep = eeps[i];
			if (!Detect.notEmpty(eep)) {
				continue;
			}
			String[] envAndExecPoint = eep.split("-");
			String envId = envAndExecPoint[0];
			String execPointId = envAndExecPoint[1];
			
			for (String e : es) {
				if (e.equals(envId)) {
					Environment env = environmentAccessService.findById(Long.parseLong(envId), this.getUserContext());
					DictExecutePoint execPoint = dictExecutePointAccessService.findById(Long.parseLong(execPointId), this.getUserContext());
					envAndExecPointMap.put(env, execPoint);
				}
			}
		}
		
		Set<Entry<Environment, DictExecutePoint>> envAndExecPointSet = envAndExecPointMap.entrySet();
		for (Script script : scripts) {
			for (Entry<Environment, DictExecutePoint> envAndExecPoint : envAndExecPointSet) {
				ScriptEnvironmentRelation relation = new ScriptEnvironmentRelation();
				relation.setScript(script);
				relation.setEnvironment(envAndExecPoint.getKey());
				relation.setExecutePoint((int)envAndExecPoint.getValue().getId());
				
				//如果用户选择的执行点是不用执行，则保存时设为执行成功
				if (DictExecutePoint.Point.NO_NEED_EXEC == envAndExecPoint.getValue().getId()) {
					relation.setStatus(DictEnvironmentStatus.Status.EXEC_SUCCESS);
				} else {
					relation.setStatus(DictEnvironmentStatus.Status.WAIT_EXEC);
				}
				relations.add(relation);
			}
		}
		return relations;
	}

	public void setDestinationAccessService(DestinationAccessService destinationAccessService) {
		this.destinationAccessService = destinationAccessService;
	}

	public void setEnvironmentAccessService(EnvironmentAccessService environmentAccessService) {
		this.environmentAccessService = environmentAccessService;
	}

	public void setLogAccessService(LogAccessService logAccessService) {
		this.logAccessService = logAccessService;
	}

	public void setScriptAccessService(ScriptAccessService scriptAccessService) {
		this.scriptAccessService = scriptAccessService;
	}

	public void setScriptDestinationRelationAccessService(ScriptDestinationRelationAccessService scriptDestinationRelationAccessService) {
		this.scriptDestinationRelationAccessService = scriptDestinationRelationAccessService;
	}

	public void setScriptEnvironmentRelationAccessService(ScriptEnvironmentRelationAccessService scriptEnvironmentRelationAccessService) {
		this.scriptEnvironmentRelationAccessService = scriptEnvironmentRelationAccessService;
	}

	public void setTaskAccessService(TaskAccessService taskAccessService) {
		this.taskAccessService = taskAccessService;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getTaskMemo() {
		return taskMemo;
	}

	public void setTaskMemo(String taskMemo) {
		this.taskMemo = taskMemo;
	}

	public String getTaskDestination() {
		return taskDestination;
	}

	public void setTaskDestination(String taskDestination) {
		this.taskDestination = taskDestination;
	}

	public String getTaskEnvironment() {
		return taskEnvironment;
	}

	public void setTaskEnvironment(String taskEnvironment) {
		this.taskEnvironment = taskEnvironment;
	}

	public String getTaskEnvironmentExecutePoint() {
		return taskEnvironmentExecutePoint;
	}

	public void setTaskEnvironmentExecutePoint(String taskEnvironmentExecutePoint) {
		this.taskEnvironmentExecutePoint = taskEnvironmentExecutePoint;
	}

	public List<ScriptTable> getScripts() {
		return scripts;
	}

	public void setScripts(List<ScriptTable> scripts) {
		this.scripts = scripts;
	}

	public List<File> getFiles() {
		return files;
	}

	public void setFiles(List<File> files) {
		this.files = files;
	}

	public void setFilesFileName(List<String> filesFileName) {
		this.filesFileName = filesFileName;
	}

	public void setFilesContentType(List<String> filesContentType) {
		this.filesContentType = filesContentType;
	}

	public void setTaskScriptManagementService(TaskScriptManagementService taskScriptManagementService) {
		this.taskScriptManagementService = taskScriptManagementService;
	}

	public void setDictExecutePointAccessService(DictExecutePointAccessService dictExecutePointAccessService) {
		this.dictExecutePointAccessService = dictExecutePointAccessService;
	}

	public void setDictScriptTypeAccessService(DictScriptTypeAccessService dictScriptTypeAccessService) {
		this.dictScriptTypeAccessService = dictScriptTypeAccessService;
	}

	public void setDestinations(List<Destination> destinations) {
		this.destinations = destinations;
	}

	public void setEnvironments(List<Environment> environments) {
		this.environments = environments;
	}

	public void setDictExecutePoints(List<DictExecutePoint> dictExecutePoints) {
		this.dictExecutePoints = dictExecutePoints;
	}

	public void setDictScriptTypes(List<DictScriptType> dictScriptTypes) {
		this.dictScriptTypes = dictScriptTypes;
	}

	public DestinationAccessService getDestinationAccessService() {
		return destinationAccessService;
	}

	public EnvironmentAccessService getEnvironmentAccessService() {
		return environmentAccessService;
	}

	public LogAccessService getLogAccessService() {
		return logAccessService;
	}

	public ScriptAccessService getScriptAccessService() {
		return scriptAccessService;
	}

	public ScriptDestinationRelationAccessService getScriptDestinationRelationAccessService() {
		return scriptDestinationRelationAccessService;
	}

	public ScriptEnvironmentRelationAccessService getScriptEnvironmentRelationAccessService() {
		return scriptEnvironmentRelationAccessService;
	}

	public TaskAccessService getTaskAccessService() {
		return taskAccessService;
	}

	public TaskScriptManagementService getTaskScriptManagementService() {
		return taskScriptManagementService;
	}

	public DictExecutePointAccessService getDictExecutePointAccessService() {
		return dictExecutePointAccessService;
	}

	public DictScriptTypeAccessService getDictScriptTypeAccessService() {
		return dictScriptTypeAccessService;
	}

	public List<String> getFilesFileName() {
		return filesFileName;
	}

	public List<String> getFilesContentType() {
		return filesContentType;
	}

	public List<Destination> getDestinations() {
		return destinations;
	}

	public List<Environment> getEnvironments() {
		return environments;
	}

	public List<DictExecutePoint> getDictExecutePoints() {
		return dictExecutePoints;
	}

	public List<DictScriptType> getDictScriptTypes() {
		return dictScriptTypes;
	}

	public DictTaskStatusAccessService getDictTaskStatusAccessService() {
		return dictTaskStatusAccessService;
	}

	public void setDictTaskStatusAccessService(DictTaskStatusAccessService dictTaskStatusAccessService) {
		this.dictTaskStatusAccessService = dictTaskStatusAccessService;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public void setMessageNotifyService(MessageNotifyService messageNotifyService) {
		this.messageNotifyService = messageNotifyService;
	}

	public String getIssueId() {
		return issueId;
	}

	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}

	public long getScriptId() {
		return scriptId;
	}

	public void setScriptId(long scriptId) {
		this.scriptId = scriptId;
	}

	public void setScriptManagementService(
			ScriptManagementService scriptManagementService) {
		this.scriptManagementService = scriptManagementService;
	}


}
