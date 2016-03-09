package net.danny.qqmsgagent.service;

import java.util.List;

import net.danny.qqmsgagent.model.Message;

public interface MsgReceiver {

	public List<Message> saveMessage(String destination, String message);
}
