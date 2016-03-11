package com.asb.cdd.scriptmanage.dao.access.model;

import com.irm.model.system.SystemModel;

public class Environment extends SystemModel {
	
	static public class DbLevel {
		static public final int MAIN_TRUNK = 1;
		static public final int OTHER_TRUNK = 2;
		static public final int MAIN_BRANCH = 3;
		static public final int OTHER_BRANCH = 4;
	}
/*	
	private int id;
	private int version;
	private String name;*/
//	private Boolean trunk;
	private String dbDriver;
	private String dbUrl;
	private String dbUsername;
	private String dbPassword;
	private String dbAlias;
	/**
	 * 页面显示顺序
	 */
	private int ordinal;
	public int getOrdinal() {
		return ordinal;
	}

	public void setOrdinal(int ordinal) {
		this.ordinal = ordinal;
	}
	/**
	 * 环境的级别，分为主要的主干，其他主干，主要分支，其他分支
	 */
	private int dbLevel;
	
	public boolean isMainTrunk() {
		return dbLevel == DbLevel.MAIN_TRUNK;
	}
	
	public boolean isOtherTrunk() {
		return dbLevel == DbLevel.OTHER_TRUNK;
	}

	public boolean isBranch() {
		return (dbLevel == DbLevel.MAIN_BRANCH) || (dbLevel == DbLevel.OTHER_BRANCH);
	}
	public String getDbAlias() {
		return dbAlias;
	}
	public void setDbAlias(String dbAlias) {
		this.dbAlias = dbAlias;
	}

	public String getDbUrl() {
		return dbUrl;
	}
	public void setDbUrl(String dbUrl) {
		this.dbUrl = dbUrl;
	}
	public String getDbUsername() {
		return dbUsername;
	}
	public void setDbUsername(String dbUsername) {
		this.dbUsername = dbUsername;
	}
	public String getDbPassword() {
		return dbPassword;
	}
	public void setDbPassword(String dbPassword) {
		this.dbPassword = dbPassword;
	}
	public String getDbDriver() {
		return dbDriver;
	}
	public void setDbDriver(String dbDriver) {
		this.dbDriver = dbDriver;
	}
	public int getDbLevel() {
		return dbLevel;
	}
	public void setDbLevel(int dbLevel) {
		this.dbLevel = dbLevel;
	}

}
