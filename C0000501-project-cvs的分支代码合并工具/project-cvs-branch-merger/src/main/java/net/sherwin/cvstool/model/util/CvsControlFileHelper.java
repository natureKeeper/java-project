package net.sherwin.cvstool.model.util;

import java.io.File;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import net.sherwin.cvstool.model.data.CvsEntry;

public class CvsControlFileHelper {
	
	private static final transient Log log = LogFactory.getLog(CvsControlFileHelper.class);

	static DateFormat df;
	
	static {		
		df = new SimpleDateFormat(Config.getConfigValue(Config.KEY_CVS_TIMESTAMP_FORMAT), Locale.US);
		df.setTimeZone(TimeZone.getTimeZone("GMT"));
	}
	/**
	 * 提供cvsentry，根据其中的timestamp和文件的修改时间比对判断file是否在本地修改过
	 * @param file
	 * @param cvsentry
	 * @return
	 */
	public static boolean isFileModifiedLocally(File file, CvsEntry cvsentry) {
//		String systemDateTimeStr = df.format(new Date(file.lastModified()));
//		String cvsDateTimeStr = cvsentry.date;

		Date sysDate = new Date(file.lastModified());
		Date cvsDate = null;
		try {
			cvsDate = df.parse(cvsentry.date);
		} catch (ParseException e) {
			log.error("", e);
			return true;
		}
		if (Math.abs(sysDate.getTime() - cvsDate.getTime()) < 1000) {
			return false;
		} else {
			return true;
		}
	}
	
	public static void main(String[] args) {
		Calendar gmtCal = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
		
		DateFormat df = new SimpleDateFormat("E MMM dd HH:mm:ss yyyy", Locale.US);
		df.setTimeZone(TimeZone.getTimeZone("GMT"));
		File dir = new File("E:/dba88/workspace_irm_head/head-irm-server/src/main/java/com/irm/integration/business/eoms/message");
		File[] files = dir.listFiles();
		for (File f : files) {
			System.out.println(f.getName() + ":" + df.format(new Date(f.lastModified())));
		}
	}
}
