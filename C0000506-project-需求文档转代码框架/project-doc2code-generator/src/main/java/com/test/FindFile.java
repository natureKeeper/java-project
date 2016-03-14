package com.test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FindFile {
	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) {
	// TODO Auto-generated method stub
		//2013/5/27 10:12:58
		Date d = new Date();
		d.setYear(113);
		d.setMonth(4);
		d.setDate(27);
		d.setHours(10);
		d.setMinutes(12);
		d.setSeconds(58);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		System.out.println(sdf.format(d));
		System.out.println(d.getTime());
	
		/*File dir = new File("D:\\wusuirong\\workspace\\dev_workspace\\workspace_irm_branch\\irm-web");
		findFile(dir);*/
	}
	
	public static void findFile(File f) {
		File[] files = f.listFiles();
		for (int i=0; i<files.length; i++) {
			if (files[i].isDirectory()) {
				findFile(files[i]);					
			} else {
				if ("Root".equals(files[i].getName())) {
					BufferedReader br = null;
					try {
						br = new BufferedReader(new InputStreamReader(new FileInputStream(files[i])));
						String line = br.readLine();
						if (!":pserver:wusuirong@135.251.223.174:/home/cvs/repo".equals(line)) {
							System.out.println(files[i].getAbsolutePath() + File.separator + files[i].getName());
						}
					} catch (FileNotFoundException e) {
						System.err.println("FileNotFoundException, file=" + files[i].getAbsolutePath());
					} catch (IOException e) {
						System.err.println("IOException, file=" + files[i].getAbsolutePath() + File.separator + files[i].getName());
					} finally {
						if (null != br) {
							try {
								br.close();
							} catch (IOException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							br = null;
						}
					}
					
				}
			}
		}
	}
}
