package com.asb.cdd.scriptmanage.web;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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
import com.asb.cdd.scriptmanage.dao.access.model.DictExecutePoint;
import com.asb.cdd.scriptmanage.dao.access.model.DictScriptType;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.Script;
import com.asb.cdd.scriptmanage.dao.access.model.criteria.ScriptCriteria;
import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.asb.cdd.scriptmanage.service.ScriptManagementService;
import com.asb.cdd.scriptmanage.service.TaskScriptManagementService;
import com.asb.cdd.scriptmanage.web.util.DictionaryViewHelper;
import com.asb.cdd.scriptmanage.web.vo.ScriptTable;
import com.irm.web.system.common.action.AbstractAction;

public class ScriptPlaybackAction extends AbstractAction {


	private static final transient Log log = LogFactory.getLog(ScriptPlaybackAction.class);

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
	
	/* 
	 * 返回回放脚本页面
	 * @see com.irm.web.system.common.action.AbstractAction#execute()
	 */
	public String execute() throws Exception {
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

		return SUCCESS;
	}
	
	
	private String scriptName;
	private String issueId;
	private String taskMemo;
	private String taskDestination;//要发布的地方
	private String scriptEnvironment;//用户选中要执行的环境
	private String taskEnvironmentExecutePoint;//每个环境对应的执行时间点，格式为：环境id-时间点id
	private List<ScriptTable> scripts = new ArrayList<ScriptTable>();
	
	private List<File> files;
	private List<String> filesFileName;
	private List<String> filesContentType;
	
	/**
	 * 回放脚本
	 * @return
	 * @throws Exception
	 */
	public String submitForm() throws Exception {

		taskScriptManagementService.setAllowSubmitScript(false);
		
		ScriptCriteria sc = new ScriptCriteria();
		sc.setName(scriptName);
		Script script = scriptAccessService.findOne(sc, this.getUserContext());
		if (null == script) {
			taskScriptManagementService.setAllowSubmitScript(true);
			return ERROR;
		}
		long seq = script.getExecuteSeq();
		
		Environment env = environmentAccessService.findById(Long.parseLong(scriptEnvironment), this.getUserContext());
		
		sc = new ScriptCriteria();
		sc.setName(scriptName);
//		sc.sete
//		Script script = scriptAccessService.find(sc, this.getUserContext());
		
		taskScriptManagementService.setAllowSubmitScript(true);

		return SUCCESS;
	}
	
	private long scriptId;

}
