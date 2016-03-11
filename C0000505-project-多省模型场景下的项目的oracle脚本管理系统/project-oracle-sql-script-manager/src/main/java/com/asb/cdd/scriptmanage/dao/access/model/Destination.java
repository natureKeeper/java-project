package com.asb.cdd.scriptmanage.dao.access.model;

import com.irm.model.system.SystemModel;

public class Destination extends SystemModel {
	
	private String scriptExecutePathInPlsql;
	/*
	private long id;
	private long version;
	private String name;
	private String code;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public long getVersion() {
		return version;
	}
	public void setVersion(long version) {
		this.version = version;
	}*/

	public String getScriptExecutePathInPlsql() {
		return scriptExecutePathInPlsql;
	}

	public void setScriptExecutePathInPlsql(String scriptExecutePathInPlsql) {
		this.scriptExecutePathInPlsql = scriptExecutePathInPlsql;
	}
	
}
