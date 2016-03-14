package com.irm.utils.codegen.utils;

import java.io.File;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import common.freemarker.FreeMarkerUtil;

/**
 * @author Administrator
 *
 */
public class TemplateUtil {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(TemplateUtil.class);

	public static String process(Class<?> clazz, String templateName, Map<String, Object> map) {
		String packageName = clazz.getPackage().getName();
		String className = clazz.getSimpleName();
		packageName = packageName.replace(".", File.separator);
		return FreeMarkerUtil.processPath(packageName + File.separator + className + "_" + templateName + ".ftl", map);
	}
}
