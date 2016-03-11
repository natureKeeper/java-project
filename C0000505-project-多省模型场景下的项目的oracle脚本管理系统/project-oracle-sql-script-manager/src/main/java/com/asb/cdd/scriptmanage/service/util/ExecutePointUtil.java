package com.asb.cdd.scriptmanage.service.util;

import com.asb.cdd.scriptmanage.dao.access.model.DictExecutePoint;

public class ExecutePointUtil {
	
	public static String unmarshal(int status) {
		String result = "未定义";
		switch (status) {
		case DictExecutePoint.Point.AS_SOON_AS_POSSIBLE:
			result = "自动执行";
			break;
		case DictExecutePoint.Point.BEFORE_DAWN:
			result = "明天凌晨";
			break;
		case DictExecutePoint.Point.MANUAL:
			result = "日后手工";
			break;
		case DictExecutePoint.Point.NO_NEED_EXEC:
			result = "不用执行";
			break;
		}
		return result;
	}
}
