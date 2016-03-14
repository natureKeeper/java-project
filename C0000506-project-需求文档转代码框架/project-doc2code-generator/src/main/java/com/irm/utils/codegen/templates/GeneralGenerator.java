package com.irm.utils.codegen.templates;

import java.io.File;
import java.util.HashSet;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.irm.utils.codegen.utils.Comment;
import com.irm.utils.codegen.utils.InformationContainer;
import com.irm.utils.codegen.utils.MessageContainer;
import com.irm.utils.codegen.utils.PropertiesLoader;
import com.irm.utils.codegen.utils.TemplateUtil;
import common.util.Detect;
import common.util.FileUtil;

public class GeneralGenerator implements CodeGenerator {
	@SuppressWarnings("unused")
	private static final transient Log log = LogFactory.getLog(GeneralGenerator.class);

	public void execute(InformationContainer infoContainer, MessageContainer msgContainer) throws Exception {
		System.out.println("执行");
	}

	public void inputInformation(InformationContainer infoContainer) {
		System.out.println("输入参数：未实现");
	}

	public void printUsage() {
		String usage = null;
		try {
			Comment comment = this.getClass().getAnnotation(Comment.class);
			if (null != comment) {
				usage = comment.value();
			} else {
				log.error("读取类注释异常" + this.getClass().getCanonicalName());
				System.exit(1);
			}
		} catch (Exception e) {
			log.error("读取说明文件异常");
			System.exit(1);
		}
		if (null == usage) {
			log.error("读取说明文件异常");
			System.exit(1);
		}
		System.out.println(usage);
	}

	public void init() {
		PropertiesLoader.load(this.getClass());
	}
	
	/**
	 * 使用模板创建或更新targetFileFullPath<br>
	 * createTemplateName为创建模板<br>
	 * updateTemplateName为更新模板<br>
	 * 使用更新模板时，在insertBeforeString前插入<br>
	 * map是模板使用的参数<br>
	 * msgContainer用于返回信息
	 * @param targetFileFullPath
	 * @param createTemplateName
	 * @param updateTemplateName
	 * @param insertBeforeString
	 * @param map
	 * @param msgContainer
	 * @throws Exception
	 */
	protected void createOrUpdateFile(String targetFileFullPath, String createTemplateName, String updateTemplateName, String insertBeforeString, Map<String, Object> map, MessageContainer msgContainer) throws Exception {	
		int idx1 = targetFileFullPath.lastIndexOf("/");
		int idx2 = targetFileFullPath.lastIndexOf("\\");
		int index = idx1>idx2?idx1:idx2;
		String targetDirFullPath = targetFileFullPath.substring(0, index);
		File dir = new File(targetDirFullPath);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		File file = new File(targetFileFullPath);
		if (!file.exists()) {
			System.out.println("文件" + targetFileFullPath + "不存在，将创建新文件");
			String result = TemplateUtil.process(this.getClass(), createTemplateName, map);
			
			FileUtil.save(result, file);
		} else {
			System.out.println("文件" + targetFileFullPath + "已存在，将在文件最后一处出现(" + insertBeforeString + ")的地方插入");
			String result = TemplateUtil.process(this.getClass(), updateTemplateName, map);
			
			String content = FileUtil.readFileAsString(file, "utf-8");
			int idx = content.lastIndexOf(insertBeforeString);
			String content1 = content.substring(0, idx);
			String content2 = content.substring(idx);
			content = content1 + result + "\r\n" + content2;
			FileUtil.save(content, file);
		}
		
		msgContainer.getMessages().add(targetFileFullPath + "已更新");
	}
	
	/**
	 * 当目标文件中不包含matchKey指定的关键字时才进行更新，以防覆盖以前写好的内容
	 * @param targetFileFullPath
	 * @param createTemplateName
	 * @param updateTemplateName
	 * @param insertBeforeString
	 * @param map
	 * @param matchKey
	 * @param msgContainer
	 * @throws Exception
	 */
	protected void createOrUpdateFileWhenNotMatch(String targetFileFullPath, String createTemplateName, String updateTemplateName, String insertBeforeString, Map<String, Object> map, String matchKey, MessageContainer msgContainer) throws Exception {	
		int idx1 = targetFileFullPath.lastIndexOf("/");
		int idx2 = targetFileFullPath.lastIndexOf("\\");
		int index = idx1>idx2?idx1:idx2;
		String targetDirFullPath = targetFileFullPath.substring(0, index);
		File dir = new File(targetDirFullPath);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		File file = new File(targetFileFullPath);
		if (file.exists()) {
			String content = FileUtil.readFileAsString(file, "utf-8");
			if (content.contains(matchKey)) {
				System.out.println("目标文件内容包含" + matchKey + "，将不会被更新");
				return;
			}
		}
		createOrUpdateFile(targetFileFullPath, createTemplateName, updateTemplateName, insertBeforeString, map, msgContainer);
	}
	
	protected void createFile(String targetFileFullPath, String createTemplateName, Map<String, Object> map, MessageContainer msgContainer) throws Exception {	
		int idx1 = targetFileFullPath.lastIndexOf("/");
		int idx2 = targetFileFullPath.lastIndexOf("\\");
		int index = idx1>idx2?idx1:idx2;
		String targetDirFullPath = targetFileFullPath.substring(0, index);
		File dir = new File(targetDirFullPath);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		File file = new File(targetFileFullPath);
		if (!file.exists()) {
			System.out.println("文件" + targetFileFullPath + "不存在，将创建新文件");
		} else {
			System.out.println("文件" + targetFileFullPath + "已存在，将覆盖文件");
			file.delete();
		}
		
		String result = TemplateUtil.process(this.getClass(), createTemplateName, map);
		
		FileUtil.save(result, file);
		
		msgContainer.getMessages().add(targetFileFullPath + "已更新");
	}
	
	protected void inputInfo(String hint, InformationContainer infoContainer, String key) {
		if (null == infoContainer.getInformations().get(key)) {
			Scanner scaner = new Scanner(System.in);

			System.out.println(hint);
			String value = scaner.nextLine();
			infoContainer.getInformations().put(key, value);
		}
	}
	
	protected void inputInfoWithEmptyCheck(String hint, InformationContainer infoContainer, String key) {
		if (null == infoContainer.getInformations().get(key)) {
			Scanner scaner = new Scanner(System.in);

			System.out.println(hint + "(不能为空)");
			String value = scaner.nextLine();
			while (!Detect.notEmpty(value)) {
				System.out.println("输入值不能为空");
				System.out.println(hint);
				value = scaner.nextLine();
			}
			infoContainer.getInformations().put(key, value);
		}
	}
	
	/**
	 * 限制输入值在options之中
	 * @param hint
	 * @param infoContainer
	 * @param key
	 * @param options
	 */
	protected void inputInfo(String hint, InformationContainer infoContainer, String key, String[] options) {
		if (null == infoContainer.getInformations().get(key)) {
			Set<String> set = new HashSet<String>();
			StringBuffer sb = new StringBuffer();
			for (String s : options) {
				set.add(s);
				sb.append(s).append(",");
			}
			String list = sb.toString();
			
			Scanner scaner = new Scanner(System.in);

			System.out.println(hint);
			System.out.println("取值范围: " + list);
			String value = scaner.nextLine();
			while (!Detect.notEmpty(value) || !set.contains(value)) {
				System.out.println("输入值必须在列表范围内: " + list);
				System.out.println(hint);
				value = scaner.nextLine();
			}
			infoContainer.getInformations().put(key, value);
		}
	}
	
	/**
	 * 允许输入多行,并以endingKey结束
	 * @param hint
	 * @param infoContainer
	 * @param key
	 * @param endingKey
	 */
	protected void inputInfoWithMultiLines(String hint, InformationContainer infoContainer, String key, String endingKey) {
		if (null == infoContainer.getInformations().get(key)) {
			Scanner scaner = new Scanner(System.in);

			System.out.println(hint);
			StringBuffer sb = new StringBuffer();
			String tmp = scaner.nextLine();
			sb = sb.append(tmp);
			while (!tmp.endsWith(endingKey)) {
				tmp = scaner.nextLine();
				sb = sb.append("\r\n").append(tmp);
			}
			while (endingKey.length() >= sb.length()) {
				System.out.println("输入不能为空");
				System.out.println(hint);
				tmp = scaner.nextLine();
				sb = sb.append("\r\n").append(tmp);
				while (!tmp.endsWith(endingKey)) {				
					tmp = scaner.nextLine();
					sb = sb.append("\r\n").append(tmp);
				}
			}
			infoContainer.getInformations().put(key, sb.substring(0, sb.length()-endingKey.length()).toString());
		}
	}
	
	protected void inputInfoAutomatically(InformationContainer infoContainer, String key, String value) {
		if (null == infoContainer.getInformations().get(key)) {
			infoContainer.getInformations().put(key, value);
		}
	}
}
