package com.asb.cdd.scriptmanage.service.util;

import com.asb.cdd.scriptmanage.dao.access.model.DictTaskStatus;

public class TaskStatusUtil {
	
	public static String unmarshal(int status) {
		String result = "未定义";
		switch (status) {
		case DictTaskStatus.Status.CONFIRMED_ALL_SCRIPTS_SUCCESS:
			result = "所有脚本确认成功";
			break;
		case DictTaskStatus.Status.EXEC_ALL_SCRIPTS_SUCCESS:
			result = "所有脚本执行成功";
			break;
		case DictTaskStatus.Status.EXEC_PARTIAL_SCRIPTS:
			result = "部分脚本执行";
			break;
		case DictTaskStatus.Status.RELEASE_PARTIAL_DESTINATION:
			result = "部分省份发布";
			break;
		case DictTaskStatus.Status.RELEASE_SUCCESSFUL:
			result = "已发布";
			break;
		case DictTaskStatus.Status.WAIT_EXEC:
			result = "等待执行";
			break;
		case DictTaskStatus.Status.DEPRECATED:
			result = "已废弃";
			break;
		}
		return result;
	}
}
