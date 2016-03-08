package net.sherwin.qqproxy;

import java.io.InputStream;
import java.util.Properties;

public class Qq2012MsgSender implements MsgSender {
	
	private String command;
	
	public Qq2012MsgSender() throws Exception {
		Properties prop = new Properties();
		try {
			InputStream is = this.getClass().getClassLoader().getResourceAsStream("config_qq2012.properties");
			prop.load(is);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

		command = prop.getProperty("command");
	}

	public synchronized boolean send(String destination, String message) {
		String[] qqs = destination.split(",");
		
		for (int i=0; i<qqs.length; i++) {
			Process process = null;
			try {
				ProcessBuilder pb = new ProcessBuilder(command, qqs[i], message);
				process = pb.start();
				process.waitFor();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return true;
	}
}
