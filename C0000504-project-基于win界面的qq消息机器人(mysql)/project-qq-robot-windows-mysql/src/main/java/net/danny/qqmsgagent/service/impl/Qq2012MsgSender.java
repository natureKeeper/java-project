package net.danny.qqmsgagent.service.impl;

import net.danny.qqmsgagent.service.MsgSender;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class Qq2012MsgSender implements MsgSender {
	
	private String command;
	
	private static final transient Log log = LogFactory.getLog(Qq2012MsgSender.class);

	public synchronized boolean send(String destination, String message) {
		String[] qqs = destination.split(",");
		
		for (int i=0; i<qqs.length; i++) {
			Process process = null;
			try {
				ProcessBuilder pb = new ProcessBuilder(command, qqs[i], message);
				process = pb.start();
				int resultCode = process.waitFor();
				if (0 != resultCode) {
					return false;
				}
			} catch (Exception e) {
				log.error(e, e);
				return false;
			}
		}
		return true;
	}

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}
}
