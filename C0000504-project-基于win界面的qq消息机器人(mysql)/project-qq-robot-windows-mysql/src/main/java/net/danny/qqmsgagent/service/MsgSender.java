package net.danny.qqmsgagent.service;

public interface MsgSender {

	public boolean send(String destination, String message);
}
