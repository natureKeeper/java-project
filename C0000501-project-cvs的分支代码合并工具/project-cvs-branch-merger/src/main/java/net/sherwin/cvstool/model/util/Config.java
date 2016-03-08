package net.sherwin.cvstool.model.util;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Config {
	static Properties prop;
	
	static final String CONFIG_FILE = "config.properties";
	
	static public final String CVS_ENTRIES_FILE_ENCODING = "cvs.entries.file.encoding";
	
	static public final String KEY_CVS_TIMESTAMP_FORMAT = "cvs.timestamp.format";
	
	static public final String KEY_MERGE_CMD = "merge.cmd";
	
	static public final String KEY_MERGE_CMD_PARAM = "merge.cmd.param";
	
	private static final transient Log log = LogFactory.getLog(Config.class);
	
	static {
		prop = new Properties();
		try {
			prop.load(new FileInputStream(new File(CONFIG_FILE)));
		} catch (Exception e) {
			log.error("", e);
			System.exit(1);
		}
	}
	
	static public String getConfigValue(String key) {
		return prop.getProperty(key, "");
	}
}
