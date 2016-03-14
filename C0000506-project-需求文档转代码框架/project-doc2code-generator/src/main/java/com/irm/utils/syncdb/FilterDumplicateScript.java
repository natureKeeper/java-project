package com.irm.utils.syncdb;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import common.util.FileUtil;


/**
 * 脚本系统中是把脚本放入提交日期对应的文件夹中的
 * 如果一个mr的某个脚本因为执行失败而在当天重新提交的话，因为文件夹中已经有同名文件，所以会加前缀"1_"重命名然后存到磁盘上
 * 比如a.sql再提交时，就会命名为1_a.sql
 * 当现场导库到公司时，要同步未执行的脚本时，会发现mr里有a.sql和1_a.sql，这时需要根据提交时间过滤出1_a.sql，忽略a.sql
 * @author Administrator
 *
 */
public class FilterDumplicateScript {
	public static void main(String[] args) throws IOException {
		String inputDirName = "D:/tmp/升级数据库脚本工作区/带1_前缀的脚本";
		System.out.println("本程序功能是把带1_前缀的脚本进行筛选，把修改日期最新的脚本的1_前缀去掉");
		System.out.println("工作目录：" + inputDirName);
		System.out.println("确认脚本都放在工作目录后请按任意键");
		System.in.read();
		
		List<File> files = FileUtil.list(inputDirName);
		Map<String, File> maps = new HashMap<String, File>();
		for (File f : files) {
			String fileName = f.getName();
			int idx = fileName.lastIndexOf("_");
			String newFileName = fileName.substring(idx+1);
			if (maps.containsKey(newFileName)) {
				File tmpFile = maps.get(newFileName);
				if (f.lastModified() > tmpFile.lastModified()) {
					maps.put(newFileName, f);
				}
			} else {
				maps.put(newFileName, f);
			}
		}
		
		Iterator<Entry<String, File>> it = maps.entrySet().iterator();
		for (;it.hasNext();) {
			Entry<String, File> entry = it.next();
			File f = entry.getValue();
			String fileName = f.getName();
			int idx = fileName.lastIndexOf("_");
			String newFileName = fileName.substring(idx+1);
			FileUtil.rename(f.getAbsolutePath(), newFileName);
		}
		
		System.out.println("执行完毕，请到\r\n目录“D:/tmp/升级数据库脚本工作区/带1_前缀的脚本”\r\n提取改好的脚本覆盖回\r\n目录“删除重复scripts后结果”");
	}

}
