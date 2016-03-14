package com.irm.utils.syncdb;
import java.io.File;
import java.io.IOException;

import common.util.FileUtil;


/**
 * 生成手工执行sql的脚本
 * @author Administrator
 *
 */
public class GenerateSqlSyncScript {
	public static void main(String[] args) throws IOException {
		String inputFileName = "d:/tmp/升级数据库脚本工作区/需要执行的脚本.txt";
		String outputFileName = "d:/tmp/升级数据库脚本工作区/需要执行的脚本.sql";
		String sqlDirName = "d:/tmp/scripts";
		
		System.out.println("脚本清单文件为：" + inputFileName);
		System.out.println("生成的文件为：" + outputFileName);
		System.out.println("确认后请按任意键");
		System.in.read();
		
		String rawLines = FileUtil.readFileAsString(new File(inputFileName));
		String[] lines = rawLines.split("\r\n");
		StringBuffer sb = new StringBuffer();
		for (String fileName : lines) {
			sb.append("prompt 'begin " + fileName + ";'\r\n");
			sb.append("insert into db_scriptPatch(id,Scriptname,startTime)values(seq_db_scriptPatch.Nextval,'" + fileName + "',sysdate);\r\n");
			sb.append("commit;\r\n");
			sb.append("@" + sqlDirName + "\\" + fileName + ";\r\n");
			sb.append("update db_scriptPatch set endTime=sysdate where id=(select max(id) from db_scriptPatch);\r\n");
			sb.append("commit;\r\n");
			sb.append("prompt 'end " + fileName + ";'\r\n\r\n");
		}
		FileUtil.save(sb.toString(), new File(outputFileName));
	}

}

