package com.asb.cdd.scriptmanage.dao.access.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DictScriptStatus extends DictModel {
	@XmlRootElement
	static public class Status {
		static public final int NO_EXIST = 0;//不存在
		static public final int WAIT_EXEC = 1;//等待执行
		static public final int EXECUTING = 2;//执行中（有环境执行，但不是所有都执行成功）
		static public final int EXEC_FAIL = 3;//执行失败（一个环境失败就失败）
		static public final int ALL_ENV_EXEC_SUCCESS = 4;//所有环境执行成功
		static public final int NO_NEED_EXEC = 5;//不用执行
		static public final int CONFIRMED_SUCCESS = 6;//确认成功
		static public final int RELEASE_PARTIAL = 7;//部分省份发布
		static public final int RELEASE_SUCCESSFUL = 8;//发布成功
		static public final int ALL_BRANCH_ENV_EXEC_SUCCESS = 9;//所有分支环境执行成功
		static public final int DEPRECATED = 10;//已废弃
	}
	
}
