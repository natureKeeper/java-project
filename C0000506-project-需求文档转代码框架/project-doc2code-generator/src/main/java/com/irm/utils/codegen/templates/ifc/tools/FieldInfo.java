package com.irm.utils.codegen.templates.ifc.tools;

public class FieldInfo {
	private String fieldEnName;//字段英文名称
	private String fieldCnName;//字段中文名称
	private String fieldDataType;//字段类型
	private String fieldDescription;//字段说明
	

	
	private String javaFieldName;//Java属性名
	private String javaFieldDataType;//Java属性类型
	
	private boolean canNotNull;//是否必填
	
	
	private String dbFieldEnName;//数据库字段英文名
	private String dbFieldCnName;//数据库字段名称
	private String dbFieldDataType;//数据库字段类型
	
	public String getFieldEnName() {
		return fieldEnName;
	}
	public void setFieldEnName(String fieldEnName) {
		this.fieldEnName = fieldEnName;
	}

	public String getFieldCnName() {
		return fieldCnName;
	}
	public void setFieldCnName(String fieldCnName) {
		this.fieldCnName = fieldCnName;
	}
	public String getJavaFieldName() {
		return javaFieldName;
	}
	public void setJavaFieldName(String javaFieldName) {
		this.javaFieldName = javaFieldName;
	}
	public String getJavaFieldDataType() {
		return javaFieldDataType;
	}
	public void setJavaFieldDataType(String javaFieldDataType) {
		this.javaFieldDataType = javaFieldDataType;
	}
	public String getFieldDataType() {
		return fieldDataType;
	}
	public void setFieldDataType(String fieldDataType) {
		this.fieldDataType = fieldDataType;
	}
	public boolean isCanNotNull() {
		return canNotNull;
	}
	public void setCanNotNull(boolean canNotNull) {
		this.canNotNull = canNotNull;
	}
	public String getFieldDescription() {
		return fieldDescription;
	}
	public void setFieldDescription(String fieldDescription) {
		this.fieldDescription = fieldDescription;
	}
	public String getDbFieldEnName() {
		return dbFieldEnName;
	}
	public void setDbFieldEnName(String dbFieldEnName) {
		this.dbFieldEnName = dbFieldEnName;
	}
	public String getDbFieldCnName() {
		return dbFieldCnName;
	}
	public void setDbFieldCnName(String dbFieldCnName) {
		this.dbFieldCnName = dbFieldCnName;
	}
	public String getDbFieldDataType() {
		return dbFieldDataType;
	}
	public void setDbFieldDataType(String dbFieldDataType) {
		this.dbFieldDataType = dbFieldDataType;
	}

}
