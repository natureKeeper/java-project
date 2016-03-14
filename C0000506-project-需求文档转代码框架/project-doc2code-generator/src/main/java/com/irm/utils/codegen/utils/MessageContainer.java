package com.irm.utils.codegen.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 执行日志存放容器
 * @author Administrator
 *
 */
public class MessageContainer {
	
	private List<String> messages;
	
	public MessageContainer() {
		messages = new ArrayList<String>();
	}

	public List<String> getMessages() {
		return messages;
	}

	public void setMessages(List<String> messages) {
		this.messages = messages;
	}
}
