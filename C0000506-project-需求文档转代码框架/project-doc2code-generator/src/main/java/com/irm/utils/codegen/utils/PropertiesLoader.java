package com.irm.utils.codegen.utils;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.CollectionUtils;

public class PropertiesLoader {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(PropertiesLoader.class);

	private static Properties p;
	
	private static final String CONFIG_FILE_NAME = "config.properties";
	
	static {
		p = new Properties();
		try {
			p.load(ClassLoader.getSystemResourceAsStream(CONFIG_FILE_NAME));
		} catch (IOException e) {
			log.error("加载配置文件" + CONFIG_FILE_NAME + "失败");
			System.exit(1);
		}
	}
	
	public static void load(Class<?> clazz) {
		Properties tmpProp = new Properties();
		String packageName = clazz.getPackage().getName();
		packageName = packageName.replace(".", File.separator);
		try {	
			tmpProp.load(ClassLoader.getSystemResourceAsStream(packageName + File.separator + CONFIG_FILE_NAME));
		} catch (IOException e) {
			log.error("加载配置文件" + packageName + File.separator + CONFIG_FILE_NAME + "失败");
			System.exit(1);
		}
		CollectionUtils.mergePropertiesIntoMap(tmpProp, p);
	}
	
	public static String get(String key) {
		return p.getProperty(key, "");
	}
}
