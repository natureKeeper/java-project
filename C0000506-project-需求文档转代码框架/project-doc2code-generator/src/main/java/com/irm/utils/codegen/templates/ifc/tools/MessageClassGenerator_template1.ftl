package com.irm.integration.business.${remoteSystemName}.message;

import java.io.Serializable;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlElements;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import com.platform.integration.message.RequestMessage;
import common.jaxb.DateTimeAdapter;

<#if msgClazzDef.fatherMessageName?exists && '' != msgClazzDef.fatherMessageName >
@XmlRootElement(name = "${msgClazzReviseName?substring(0,1)?lower_case}${msgClazzReviseName?substring(1)}")
@XmlAccessorType(XmlAccessType.FIELD)
public class ${msgClazzReviseName} implements Serializable{
<#else>
@XmlRootElement(name = "xmlRoot")
@XmlAccessorType(XmlAccessType.FIELD)
public class ${msgClazzReviseName} implements RequestMessage{
</#if>

	自己生成getter和setter
	
	public ${msgClazzReviseName}() {
		//列表类型例子 serverInfoList = new ArrayList<ServerInfo>();
		<#list fieldDefs as e>
			<#if 'list' == e.javaFieldDataType>
		${msgClazzReviseName?substring(0,1)?lower_case}${msgClazzReviseName?substring(1)}${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}s = new ArrayList<${msgClazzReviseName}${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}>();
			</#if>
		</#list>
	}

	/**
	 * 列表类型例子
	@XmlElementWrapper(name="serverInfoList")
	@XmlElements({
	    @XmlElement(name="serverInfo")
	})
	private List<ServerInfo> serverInfoList;
	注意构造函数中要new一下
	 *
	 * 日期类型例子
	@XmlJavaTypeAdapter(DateTimeAdapter.class)
	private Date callTime;
	 */
	
	
	/*********** ${fieldGroupDescription} begin ******************/
	<#list fieldDefs as e>
		<#if 'list' == e.javaFieldDataType>
	/**
	 * 需求文档: ${t3DocName}<br>
	 * 字段英文名: ${e.fieldEnName}<br>
	 * 字段中文名: ${e.fieldCnName}<br>
	 * 字段类型: ${e.fieldDataType!''}<br>
	 * 字段是否必填: <#if e.canNotNull>是<#else>否</#if><br>
	 * 字段说明: <br><#if e.fieldDescription?exists><#list e.fieldDescription?split("\r\n") as l>
	 *     ${l}<br></#list></#if>
	 */
	@XmlElementWrapper(name="${msgClazzReviseName?substring(0,1)?lower_case}${msgClazzReviseName?substring(1)}${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}s")
	@XmlElements({
		@XmlElement(name="${msgClazzReviseName?substring(0,1)?lower_case}${msgClazzReviseName?substring(1)}${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}")
	})
	private List<${msgClazzReviseName}${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}> ${msgClazzReviseName?substring(0,1)?lower_case}${msgClazzReviseName?substring(1)}${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}s;
		
		<#elseif 'date' == e.javaFieldDataType>
	/**
	 * 需求文档: ${t3DocName}<br>
	 * 字段英文名: ${e.fieldEnName}<br>
	 * 字段中文名: ${e.fieldCnName}<br>
	 * 字段类型: ${e.fieldDataType!''}<br>
	 * 字段是否必填: <#if e.canNotNull>是<#else>否</#if><br>
	 * 字段说明: <br><#if e.fieldDescription?exists><#list e.fieldDescription?split("\r\n") as l>
	 *     ${l}<br></#list></#if>
	 */
	@XmlJavaTypeAdapter(DateTimeAdapter.class)
	private Date ${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)};
		
		<#elseif e.javaFieldDataType?starts_with('enum')>
	/**
	 * 需求文档: ${t3DocName}<br>
	 * 字段英文名: ${e.fieldEnName}<br>
	 * 字段中文名: ${e.fieldCnName}<br>
	 * 字段类型: ${e.fieldDataType!''}<br>
	 * 字段是否必填: <#if e.canNotNull>是<#else>否</#if><br>
	 * 字段说明: <br><#if e.fieldDescription?exists><#list e.fieldDescription?split("\r\n") as l>
	 *     ${l}<br></#list></#if>
	 */
	@XmlJavaTypeAdapter(${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}TypeAdapter.class)
	private ${e.javaFieldName?substring(0,1)?upper_case}${e.javaFieldName?substring(1)}Type ${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)};
	
		<#else>
	/**
	 * 需求文档: ${t3DocName}<br>
	 * 字段英文名: ${e.fieldEnName}<br>
	 * 字段中文名: ${e.fieldCnName}<br>
	 * 字段类型: ${e.fieldDataType!''}<br>
	 * 字段是否必填: <#if e.canNotNull>是<#else>否</#if><br>
	 * 字段说明: <br><#if e.fieldDescription?exists><#list e.fieldDescription?split("\r\n") as l>
	 *     ${l}<br></#list></#if>
	 */
	private ${e.javaFieldDataType} ${e.javaFieldName?substring(0,1)?lower_case}${e.javaFieldName?substring(1)};
		</#if>
	</#list>
	/*********** ${fieldGroupDescription} end ******************/
}