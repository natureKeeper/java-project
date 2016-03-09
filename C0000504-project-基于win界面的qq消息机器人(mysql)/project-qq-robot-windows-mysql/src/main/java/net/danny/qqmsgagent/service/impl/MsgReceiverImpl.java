package net.danny.qqmsgagent.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import net.danny.qqmsgagent.dao.MessageMapper;
import net.danny.qqmsgagent.model.Message;
import net.danny.qqmsgagent.service.MsgReceiver;

public class MsgReceiverImpl implements MsgReceiver {

	private MessageMapper messageMapper;
	int msgSegmentSize = 100;

	public List<Message> saveMessage(String destination, String message) {		
		String[] messages = splitMessage(message);
		List<Message> result = new ArrayList<Message>();
		for (String str : messages) {
			Message msg = new Message();
			msg.setType(1);
			msg.setStatus(1);
			msg.setDestination(destination);
			msg.setContent(str);
			msg.setCreateDate(new Date());
			messageMapper.create(msg);
			result.add(msg);
		}
		return result;
	}
	
	String[] splitMessage(String message) {
		String[] result = null;
		if (message.length() > msgSegmentSize) {
			int size = (int)Math.round(Math.ceil(message.length()*1.0 / msgSegmentSize));
			result = new String[size];
			for (int i=0; i<size; i++) {
				String tmp = null;
				if ((i+1)*msgSegmentSize > message.length()) {
					tmp = message.substring(i*msgSegmentSize);
				} else {
					tmp = message.substring(i*msgSegmentSize, (i+1)*msgSegmentSize);
				}
				
				result[i] = tmp;
			}
			
		} else {
			result = new String[]{message};
		}
		return result;
	}

	public void setMsgSegmentSize(int msgSegmentSize) {
		this.msgSegmentSize = msgSegmentSize;
	}

}
