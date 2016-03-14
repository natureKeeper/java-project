package com.asb.cdd.scriptmanage.service.impl;

import java.io.File;
import java.io.IOException;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.model.DictScriptType;
import common.util.FileUtil;
import common.util.Utf8ByteOrderMarkRemover;

public class SqlFormatter {
	
	public enum FileEncoding {
		GBK, UTF8_WITHOUT_BOM, UTF8_WITH_BOM
	}

	private static final transient Log log = LogFactory.getLog(SqlFormatter.class);

/*	public static String[] format(String sql, int sqlType) {
		String result = Utf8ByteOrderMarkRemover.removeBom(sql);//去bom头
		result = result.replaceAll("\r", "").replaceAll("\\\\", "");//去\r和\
		result = result.replaceAll("--.*\n", "\n");//去注释
		
		switch (sqlType) {
		case DictScriptType.Type.DDL:
			return result.split(";");
		case DictScriptType.Type.DML:
			return result.split(";");
		case DictScriptType.Type.PROC:
			return result.split("/");
		default:
			return new String[]{sql};
		}
	}*/
	
	public static String convertFileEncodingToUTF8WithoutBom(String srcFilePath, String destFilePath, String destFileSuffix, boolean justTest) throws IOException {
		File srcFile = new File(srcFilePath);
		String sql = FileUtil.readFileAsString(new File(srcFilePath), "UTF-8");
		sql = Utf8ByteOrderMarkRemover.removeBomHeader(sql);//去bom头
		String result = destFilePath + srcFile.getName() + "-0" + destFileSuffix;
		File f = new File(result);
		if (f.exists()) {
			for (int i=0; i<100; i++) {
				result = destFilePath + srcFile.getName() + "-" + i + destFileSuffix;
				f = new File(result);				
				if (!f.exists()) {
					break;
				}
			}
		}
		
		//set sqlblanklines on 处理sql中的空行
		//set serveroutput on 输出结果
		//set echo on 显示命令语句
		//set linesize 5000 设置行宽为5000个字符
		sql = "set linesize 5000\r\nset serveroutput on\r\nset echo on\r\nset sqlblanklines on\r\n" + sql;
		if (justTest) {
			sql = sql + "\r\nrollback;\r\nexit;";
		} else {
			sql = sql + "\r\ncommit;\r\nexit;";
		}
		
		FileUtil.save(sql, f);
		return result;
	}
}
