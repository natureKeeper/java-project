package net.sherwin.cvstool.model.util;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class MergeFileHelper {
	
	private static final transient Log log = LogFactory.getLog(MergeFileHelper.class);

	public static void mergeFiles(String file1, boolean lock1, String file2, boolean lock2, boolean sync) throws IOException, InterruptedException {
		if (null != file1 && !"".equals(file1)
				&& !"".equals(file2) && null != file2) {
			
			String param = Config.getConfigValue(Config.KEY_MERGE_CMD_PARAM);
			if (lock1) {
				param += " /wl ";
			}
			if (lock2) {
				param += " /wr ";
			}
			String command = new String(Config.getConfigValue(Config.KEY_MERGE_CMD) + " "
					+ param + " " 
					+ file1 + " " + file2);

			Process process;
			try {
				process = Runtime.getRuntime().exec(command);
				int exitcode = process.waitFor();
			} catch (IOException e) {
				log.error("", e);
			} catch (InterruptedException e) {
				log.error("", e);
			}
		}
	}
}
