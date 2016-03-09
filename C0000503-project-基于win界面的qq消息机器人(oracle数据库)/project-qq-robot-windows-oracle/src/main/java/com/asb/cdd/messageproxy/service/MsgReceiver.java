package com.asb.cdd.messageproxy.service;

import java.util.List;

import com.asb.cdd.messageproxy.dao.access.model.Message;
import com.irm.system.authorization.vo.UserContext;

public interface MsgReceiver {

	public List<Message> saveMessage(String destination, String message, UserContext userContext);
}
