package com.asb.cdd.scriptmanage.web;

import java.io.File;
import java.util.Random;

import com.irm.web.system.common.action.AbstractAction;
import common.util.Detect;

/**
 * 系统的导航页
 * @author Administrator
 *
 */
public class SystemMainPageAction extends AbstractAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7956088208914284058L;
	
	private String picFileName;
	
	public String execute() throws Exception {
		String path = this.getServletContext().getRealPath("/");
		File dir = new File(path + "/resource/news");
		String[] picFileNames = dir.list();
		if (Detect.notEmpty(picFileNames)) {
			Random r = new Random(System.currentTimeMillis());
			int seq = r.nextInt(picFileNames.length);
			picFileName = picFileNames[seq];
		} else {
			picFileName = "default.jpg";
		}
		
		return SUCCESS;
	}

	public String getPicFileName() {
		return picFileName;
	}
	
}
