package net.danny.qqmsgagent.dao;

import java.util.List;

import net.danny.qqmsgagent.model.Message;

public interface MessageMapper {

	public int create(Message message);
	
	public List<Message> find(Message message);
	
	public int update(Message message);
}
