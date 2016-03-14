package com.asb.cdd.scriptmanage.service.impl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.service.entity.BigDataFsLocator;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.irm.system.bigdata.service.BigDataAccessService;

import common.util.FileUtil;

public class BigDataFsAccessServiceImpl implements BigDataAccessService<BigDataFsLocator> {
	
	private String storagePath;
	
	private static final transient Log log = LogFactory.getLog(BigDataFsAccessServiceImpl.class);
	
	public void init() {
		if (!storagePath.endsWith(File.separator)) {
			storagePath = storagePath + File.separator;
		}
	}
	
	public byte[] loadAsBytes(BigDataFsLocator locator) {
		String fullPath = locator.getPath();
		File f = new File(fullPath);
		byte[] bytes = FileUtil.readFileAsBytes(f);
		return bytes;
	}
	
	public String loadAsString(BigDataFsLocator locator) {
		return loadAsString(locator, "gbk");
	}

	public ByteArrayInputStream load(BigDataFsLocator locator) {
		byte[] bytes = loadAsBytes(locator);
		if (null != bytes) {
			return new ByteArrayInputStream(bytes);
		} else {
			return null;
		}		
	}

	public BigDataFsLocator save(String fileName, ByteArrayInputStream bais) {
		String path = getCurrentPath();
		
		File dir = new File(path);
		dir.mkdirs();
		
		File file = new File(path + fileName);
		while (file.exists()) {
			fileName = "1_" + fileName;
			file = new File(path + fileName);
		}

		try {
			FileUtil.save(bais, file);
		} catch (IOException e) {
			log.error("保存文件失败, file=" + file.getAbsolutePath(), e);
			return null;
		}

		BigDataFsLocator locator = new BigDataFsLocator();
		locator.setPath(file.getAbsolutePath());
		return locator;
	}

	public String getCurrentPath() {
		DateFormat df = new SimpleDateFormat("yyyy-MM/dd/");
		return storagePath + df.format(DateUtil.getCurrentDate());
	}

	public void setStoragePath(String storagePath) {
		this.storagePath = storagePath;
	}

	public BigDataFsLocator save(String fileName, String content) {
		String path = getCurrentPath();
		
		File dir = new File(path);
		dir.mkdirs();
		
		File file = new File(path + fileName);
		while (file.exists()) {
			fileName = "1_" + fileName;
			file = new File(path + fileName);
		}

		try {
			FileUtil.save(content, file);
		} catch (IOException e) {
			log.error("保存文件失败, file=" + file.getAbsolutePath(), e);
			return null;
		}

		BigDataFsLocator locator = new BigDataFsLocator();
		locator.setPath(file.getAbsolutePath());
		return locator;
	}

	public String loadAsString(BigDataFsLocator locator, String encoding) {
		String fullPath = locator.getPath();
		File f = new File(fullPath);
		
		String str = null;
		try {
			str = FileUtil.readFileAsString(f, encoding);
		} catch (Exception e) {
			log.error(e, e);
			str = "";
		}
		
		return str;
	}

	@Override
	public BigDataFsLocator save(String arg0, InputStream arg1) {
		// TODO Auto-generated method stub
		return null;
	}

	
}
