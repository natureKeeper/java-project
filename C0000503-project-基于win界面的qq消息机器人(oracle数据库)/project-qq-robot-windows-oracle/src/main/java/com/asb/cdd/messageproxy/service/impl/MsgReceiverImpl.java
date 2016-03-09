package com.asb.cdd.messageproxy.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.asb.cdd.messageproxy.dao.access.MessageAccessService;
import com.asb.cdd.messageproxy.dao.access.model.Message;
import com.asb.cdd.messageproxy.service.MsgReceiver;
import com.irm.system.authorization.vo.UserContext;

public class MsgReceiverImpl implements MsgReceiver {
	
	MessageAccessService messageAccessService;
	
	int msgSegmentSize = 100;

	public List<Message> saveMessage(String destination, String message,
			UserContext userContext) {		
		String[] messages = splitMessage(message);
		List<Message> result = new ArrayList<Message>();
		for (String str : messages) {
			Message msg = new Message();
			msg.setType(1);
			msg.setStatus(1);
			msg.setDestination(destination);
			msg.setContent(str);
			msg.setCreateDate(new Date());
			msg = messageAccessService.create(msg, userContext);
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

	public void setMessageAccessService(MessageAccessService messageAccessService) {
		this.messageAccessService = messageAccessService;
	}

	public void setMsgSegmentSize(int msgSegmentSize) {
		this.msgSegmentSize = msgSegmentSize;
	}

}
