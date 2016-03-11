package com.asb.cdd.scriptmanage.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.dao.access.model.DictScriptType;
import com.asb.cdd.scriptmanage.service.util.DateUtil;
import com.asb.cdd.scriptmanage.service.util.StringUtilEx;

import common.exception.WrapperException;

public class SqlScriptExecutor {

	private static final transient Log log = LogFactory.getLog(SqlScriptExecutor.class);
	
	private String sqlplusOutputEncoding = "gbk";
	private String sqlplusPath;
	private String sqlplusEnvEncoding;
	/**
	 * 生成临时sql文件的目录，因为要动态给sql添加rollback;exit;或commit;exit;指令，所以要生成临时sql文件
	 */
	private String sqlTmpPath;
	
	public void init() {
		if (!sqlTmpPath.endsWith(File.separator)) {
			sqlTmpPath = sqlTmpPath + File.separator;
		}
	}
	
	public void setSqlplusEnvEncoding(String sqlplusEnvEncoding) {
		this.sqlplusEnvEncoding = sqlplusEnvEncoding;
	}

	public void setSqlplusPath(String sqlplusPath) {
		this.sqlplusPath = sqlplusPath;
	}

	private static final String SYSTEM_ENV_NLS_LANG = "NLS_LANG"; 
	
	/**
	 * @param dbAlias 数据库别名
	 * @param dbUsername 数据库用户名
	 * @param dbPassword 数据库密码
	 * @param sqlPath 要执行的脚本的路径
	 * @param sqlType 脚本类型，DDL,DML,PROC 3种
	 * @return
	 */
	public synchronized String execute(String dbAlias, String dbUsername, String dbPassword, String sqlPath, int sqlType) {
		String output = null;
		//只有DML脚本能进行预执行操作，DDL和PROC执行后没法回滚，只能直接执行
		if (DictScriptType.Type.DML == sqlType) {
			output = innerExecute(dbAlias, dbUsername, dbPassword, sqlPath, true);
			if (validateSqlExecResult(output)) {
				output = innerExecute(dbAlias, dbUsername, dbPassword, sqlPath, false);
			}
		} else {
			output = innerExecute(dbAlias, dbUsername, dbPassword, sqlPath, false);
		}
	
		return output;
	}
	
	protected String getCurrentPath() {
		DateFormat df = new SimpleDateFormat("yyyy-MM/dd/");
		String path = sqlTmpPath + df.format(DateUtil.getCurrentDate());
		File dir = new File(path);
		dir.mkdirs();
		return path;
	}
	
	/**
	 * @param dbAlias 数据库别名
	 * @param dbUsername 数据库用户名
	 * @param dbPassword 数据库密码
	 * @param sqlPath 要执行脚本的路径
	 * @param justTest 是否在执行后回滚
	 * @return
	 */
	private String innerExecute(String dbAlias, String dbUsername, String dbPassword, String sqlPath, boolean justTest) {
		String tmpFilePath;
		
		log.error("ready to execute sql=" + sqlPath);
		try {
			tmpFilePath = SqlFormatter.convertFileEncodingToUTF8WithoutBom(sqlPath, getCurrentPath(), "-" + dbAlias + "-" + dbUsername+".sql", justTest);
		} catch (IOException e) {
			log.error(e, e);
			return "转换文件编码失败, error=" + WrapperException.getStackTrace(e);
		}
		String cmd = sqlplusPath;
		String arg1 = dbUsername + "/" + dbPassword + "@" + dbAlias;
		String arg2 = "@" + tmpFilePath;
		Process process = null;
		try {
			ProcessBuilder pb = new ProcessBuilder(cmd, arg1, arg2);
			Map<String, String> env = pb.environment();
			env.put(SYSTEM_ENV_NLS_LANG, sqlplusEnvEncoding);
			pb.redirectErrorStream(true);
			process = pb.start();
//			process.waitFor();
		} catch (IOException e) {
			log.error(e, e);
			return "执行sqlplus失败, error=" + WrapperException.getStackTrace(e);
		}
		InputStream stdin = process.getInputStream();
		ByteArrayOutputStream baos = null;
		byte[] buffer = new byte[4096];
		int byteread = 0;
		try {
			baos = new ByteArrayOutputStream();
			log.error("脚本执行输出\r\n");
			while ((byteread = stdin.read(buffer)) != -1) {
				baos.write(buffer, 0, byteread);
				String sqllog = new String(buffer);
				log.error(sqllog);
			}
			log.error("脚本执行结束\r\n");
			String result = new String(baos.toByteArray(), sqlplusOutputEncoding);
			if (0 != process.exitValue()) {
				result = "sqlplus进程返回码不为0，执行有错误，可能人为kill进程，以下是进程输出\r\n" + result;
			}
			
			if (!validateSqlExecResult(result)) {
				result = "错误发生在大概" + getErrorLineNum(result) + "行\r\n" + result;
			}
			return result;
		} catch (Exception e) {
			log.error(e, e);
			return "获取sqlplus执行结果输出失败, error=" + WrapperException.getStackTrace(e);
		} finally {
			if (null != baos) {
				try {
					baos.close();
				} catch (IOException e) {
					log.error(e, e);
				}
				baos = null;
			}
		}
	}

	public void setSqlplusOutputEncoding(String sqlplusOutputEncoding) {
		this.sqlplusOutputEncoding = sqlplusOutputEncoding;
	}
	
	public boolean validateSqlExecResult(String output) {
		String[] strs = StringUtilEx.splitByLinebreak(output);
		for (String str : strs) {
			if (str.startsWith("ERROR at")) {
				return false;
			}
			if (str.startsWith("ORA-")) {
				return false;
			}
			if (str.startsWith("PLS-")) {
				return false;
			}
			if (str.startsWith("SP2-")) {
				return false;
			}
			if (str.contains("sqlplus进程返回码不为0")) {
				return false;
			}	
		}
		
		return true;
	}
	
	private int getErrorLineNum(String output) {
		String[] strs = StringUtilEx.splitByLinebreak(output);
		for (int i=0; i<strs.length; i++) {
			if (strs[i].startsWith("ERROR at")) {
				return i;
			}
			if (strs[i].startsWith("ORA-")) {
				return i;
			}
			if (strs[i].startsWith("PLS-")) {
				return i;
			}
			if (strs[i].startsWith("SP2-")) {
				return i;
			}
			if (strs[i].contains("sqlplus进程返回码不为0")) {
				return 1;
			}	
		}

		return strs.length;
	}

	public void setSqlTmpPath(String sqlTmpPath) {
		this.sqlTmpPath = sqlTmpPath;
	}

/*	@Deprecated
	public synchronized void executeOld(String dbDriverName, String dbUrl, String dbUsername, String dbPassword, String content, int sqlType) throws Exception {
		Connection conn = null;
		String sql = null;
		try {
			Class.forName(dbDriverName);
			conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
			conn.setAutoCommit(false);
			Statement s = conn.createStatement();

			String[] sqls = SqlFormatter.format(content, sqlType);
			for (int i=0; i<sqls.length; i++) {
				boolean status = s.execute(sqls[i]);
			}

			conn.commit();
		} catch (Exception e) {
			if (e instanceof SQLException) {
				log.error("SQL State: " + ((SQLException)e).getSQLState() + ", sql=" + sql, e);
			} else {
				log.error("sql=" + sql, e);
			}
			conn.rollback();
			throw e;
		} finally {
			SQLWarning w;
			for (w = conn.getWarnings(); w != null; w = w.getNextWarning()) {
				log.error("WARNING: " + w.getMessage() + ":" + w.getSQLState() + ",sql=" + sql, w);
			}
			if (null != conn) {
				try {
					conn.close();
				} catch (Exception e) {
				}
			}
		}
	}*/
}
