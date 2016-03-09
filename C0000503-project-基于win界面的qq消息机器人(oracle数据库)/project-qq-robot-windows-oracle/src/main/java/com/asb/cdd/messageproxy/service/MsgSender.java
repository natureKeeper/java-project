package com.asb.cdd.messageproxy.service;

public interface MsgSender {

	public boolean send(String destination, String message);
}
