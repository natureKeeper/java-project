package com.asb.cdd.scriptmanage.service.util;

import java.util.Date;

import org.springframework.jdbc.core.JdbcTemplate;

public class DateUtil {
	private JdbcTemplate jdbcTemplate;
	
	private static DateUtil instance;
	
	public void init() {
		instance = this;
	}
	
	public static Date getCurrentDate() {
		if (null == instance) {
			throw new IllegalStateException("应用未正确配置时间获取器");
		}
		return instance.getJdbcTemplate().queryForObject("select systimestamp from dual", Date.class);
	}

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
}
