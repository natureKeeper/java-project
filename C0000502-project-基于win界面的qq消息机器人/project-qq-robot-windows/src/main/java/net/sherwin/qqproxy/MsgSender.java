package net.sherwin.qqproxy;

public interface MsgSender {

	public boolean send(String destination, String message);
}
