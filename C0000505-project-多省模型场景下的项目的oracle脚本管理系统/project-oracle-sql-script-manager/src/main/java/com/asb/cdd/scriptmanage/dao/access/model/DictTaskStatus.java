package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DictTaskStatus extends DictModel {
	@XmlRootElement
	static public class Status {
		static public final int NO_EXISTS = 0;//不存在
		static public final int WAIT_EXEC = 1;//等待执行
		static public final int EXEC_PARTIAL_SCRIPTS = 2;//部分脚本执行
		static public final int EXEC_ALL_SCRIPTS_SUCCESS = 3;//所有脚本执行成功
		static public final int CONFIRMED_ALL_SCRIPTS_SUCCESS = 4;//所有脚本确认成功
		static public final int RELEASE_PARTIAL_DESTINATION = 5;//部分省份发布
		static public final int RELEASE_SUCCESSFUL = 6;//已发布
		static public final int DEPRECATED = 7;//已废弃
	}
	
}
