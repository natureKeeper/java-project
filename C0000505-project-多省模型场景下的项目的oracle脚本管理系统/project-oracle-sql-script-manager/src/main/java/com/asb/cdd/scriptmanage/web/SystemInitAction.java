package com.asb.cdd.scriptmanage.web;

import com.asb.cdd.scriptmanage.dao.access.DestinationAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictEnvironmentStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictExecutePointAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictScriptStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictScriptTypeAccessService;
import com.asb.cdd.scriptmanage.dao.access.DictTaskStatusAccessService;
import com.asb.cdd.scriptmanage.dao.access.EnvironmentAccessService;
import com.asb.cdd.scriptmanage.dao.access.LogAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptDestinationRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.ScriptEnvironmentRelationAccessService;
import com.asb.cdd.scriptmanage.dao.access.TaskAccessService;
import com.asb.cdd.scriptmanage.dao.access.model.Destination;
import com.asb.cdd.scriptmanage.dao.access.model.Environment;
import com.asb.cdd.scriptmanage.dao.access.model.Environment.DbLevel;
import com.irm.web.system.common.action.AbstractAction;
import com.platform.dao.JdbcTemplateDataAccessObject;

/**
 * 系统第一次初始化时调用，以后就不用了
 * @author Administrator
 *
 */
public class SystemInitAction extends AbstractAction {

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
	
	private DictEnvironmentStatusAccessService dictEnvironmentStatusAccessService;
	private DictExecutePointAccessService dictExecutePointAccessService;
	private DictScriptStatusAccessService dictScriptStatusAccessService;
	private DictScriptTypeAccessService dictScriptTypeAccessService;
	private DictTaskStatusAccessService dictTaskStatusAccessService;

	private JdbcTemplateDataAccessObject jdbcTemplateDataAccessObject;
	public String execute() throws Exception {
/*		initDestination();
		initEnvironment();*/
		return SUCCESS;
	}
	
	private void initDestination() {
		jdbcTemplateDataAccessObject.delete("truncate table t_destination", null);
		Destination d = new Destination();
		d.setCode("zhejiang");
		d.setName("浙江");
		destinationAccessService.create(d, this.getUserContext());
		
		d.setCode("shanghai");
		d.setName("上海");
		destinationAccessService.create(d, this.getUserContext());
		
		d.setCode("gansu");
		d.setName("甘肃");
		destinationAccessService.create(d, this.getUserContext());
		
		d.setCode("jiangxi");
		d.setName("江西");
		destinationAccessService.create(d, this.getUserContext());
		
		d.setCode("shanxi");
		d.setName("山西");
		destinationAccessService.create(d, this.getUserContext());
	}
	
	private void initEnvironment() {
		jdbcTemplateDataAccessObject.delete("truncate table t_environment", null);
		Environment e = new Environment();
		e.setDbPassword("irmqa_2012");
		e.setDbUrl("jdbc:oracle:thin:@135.251.223.173:1521:irm");
		e.setDbDriver("oracle.jdbc.driver.OracleDriver");
		e.setDbUsername("irmqa");
		e.setName("主干");
		e.setCode("TRUNK");
		e.setDbLevel(DbLevel.MAIN_TRUNK);
		environmentAccessService.create(e, this.getUserContext());
		
		e = new Environment();
		e.setDbPassword("irmdev_2012");
		e.setDbUrl("jdbc:oracle:thin:@135.251.223.173:1521:irm");
		e.setDbDriver("oracle.jdbc.driver.OracleDriver");
		e.setDbUsername("irmdev");
		e.setName("开发");
		e.setCode("DEV");
		e.setDbLevel(DbLevel.OTHER_BRANCH);
		environmentAccessService.create(e, this.getUserContext());
		
		e = new Environment();
		e.setDbPassword("irmsim_2012");
		e.setDbUrl("jdbc:oracle:thin:@135.251.223.173:1521:irm");
		e.setDbDriver("oracle.jdbc.driver.OracleDriver");
		e.setDbUsername("irmsim");
		e.setName("模拟");
		e.setCode("BRANCH");
		e.setDbLevel(DbLevel.MAIN_BRANCH);
		environmentAccessService.create(e, this.getUserContext());
	}
	
	/*
	private void initDictEnvironmentStatus() {
		jdbcTemplateDataAccessObject.delete("truncate table dict_environment_status", null);
		DictEnvironmentStatus e = new DictEnvironmentStatus();
		e.setName(name);
		e.setOrdinal(ordinal);
		dictEnvironmentStatusAccessService.create(e, this.getUserContext());
	}

	private void initDictExecutePoint() {
		jdbcTemplateDataAccessObject.delete("truncate table dict_execute_point", null);
		DictExecutePoint e = new DictExecutePoint();
		e.setName(name);
		e.setOrdinal(ordinal);
		dictExecutePointAccessService.create(e, this.getUserContext());
	}

	private void initDictScriptStatus() {
		jdbcTemplateDataAccessObject.delete("truncate table dict_script_status", null);
		DictScriptStatus e = new DictScriptStatus();
		e.setName(name);
		e.setOrdinal(ordinal);
		dictScriptStatusAccessService.create(e, this.getUserContext());
	}

	private void initDictScriptType() {
		jdbcTemplateDataAccessObject.delete("truncate table dict_script_type", null);
		DictScriptType e = new DictScriptType();
		e.setName(name);
		e.setOrdinal(ordinal);
		dictScriptTypeAccessService.create(e, this.getUserContext());
	}

	private void initDictTaskStatus() {
		jdbcTemplateDataAccessObject.delete("truncate table dict_task_status", null);
		DictTaskStatus e = new DictTaskStatus();
		e.setName(name);
		e.setOrdinal(ordinal);
		dictTaskStatusAccessService.create(e, this.getUserContext());
	}*/

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

	public void setDictEnvironmentStatusAccessService(DictEnvironmentStatusAccessService dictEnvironmentStatusAccessService) {
		this.dictEnvironmentStatusAccessService = dictEnvironmentStatusAccessService;
	}

	public void setDictExecutePointAccessService(DictExecutePointAccessService dictExecutePointAccessService) {
		this.dictExecutePointAccessService = dictExecutePointAccessService;
	}

	public void setDictScriptStatusAccessService(DictScriptStatusAccessService dictScriptStatusAccessService) {
		this.dictScriptStatusAccessService = dictScriptStatusAccessService;
	}

	public void setDictScriptTypeAccessService(DictScriptTypeAccessService dictScriptTypeAccessService) {
		this.dictScriptTypeAccessService = dictScriptTypeAccessService;
	}

	public void setDictTaskStatusAccessService(DictTaskStatusAccessService dictTaskStatusAccessService) {
		this.dictTaskStatusAccessService = dictTaskStatusAccessService;
	}

	public void setJdbcTemplateDataAccessObject(JdbcTemplateDataAccessObject jdbcTemplateDataAccessObject) {
		this.jdbcTemplateDataAccessObject = jdbcTemplateDataAccessObject;
	}

}
