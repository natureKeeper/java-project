package com.asb.cdd.scriptmanage.service.entity;

import com.irm.system.bigdata.vo.BigDataLocator;

/**
 * 文件系统数据定位子
 * 大数据存取器根据它访问数据，保存数据后返回定位子供上层使用
 * @author Administrator
 *
 */
public class BigDataFsLocator implements BigDataLocator {

	private String path;

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
}
