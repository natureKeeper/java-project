package com.asb.cdd.scriptmanage.dao.access.model;


public class DictEnvironmentStatus extends DictModel {
	
	static public class Status {
		static public final int WAIT_EXEC = 1;//等待执行
		static public final int EXECUTING = 2;//执行中
		static public final int EXEC_FAIL = 3;//执行失败
		static public final int EXEC_SUCCESS = 4;//执行成功
		static public final int NO_NEED_EXEC = 5;//不用执行
		
	}

}
