package com.asb.cdd.scriptmanage.service.util;

import common.util.StringUtil;

public class StringUtilEx extends StringUtil {
	
	public static String[] splitByLinebreak(String rawStr) {
		String[] ret = null;
		if (rawStr.contains("\r\n")) {
			ret = rawStr.split("\r\n");
		} else if (rawStr.contains("\r")) {
			ret = rawStr.split("\r");
		} else if (rawStr.contains("\n")) {
			ret = rawStr.split("\n");
		} else {
			ret = new String[]{rawStr};
		}
		return ret;
	}

}
