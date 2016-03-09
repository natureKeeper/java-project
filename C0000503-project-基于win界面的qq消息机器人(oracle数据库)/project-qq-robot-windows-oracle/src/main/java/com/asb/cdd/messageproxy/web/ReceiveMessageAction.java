package com.asb.cdd.messageproxy.web;

import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.messageproxy.dao.access.MessageAccessService;
import com.asb.cdd.messageproxy.dao.access.model.Message;
import com.asb.cdd.messageproxy.service.MsgReceiver;
import com.irm.system.authorization.vo.UserContext;
import com.irm.web.system.common.action.AbstractAction;
import common.util.Detect;

/**
 * 接受消息发送请求，并把消息保存到数据库
 * @author Administrator
 *
 */
public class ReceiveMessageAction extends AbstractAction {
	
	String postEncoding;
	String getEncoding;
//	int msgMaxSize = 100;
	
	String destination;
	String message;
	
	String result;
	
//	MessageAccessService messageAccessService;
	MsgReceiver msgReceiver;
	
	private static final transient Log log = LogFactory.getLog(ReceiveMessageAction.class);

	public String execute() throws Exception {
		log.info("destination=" + destination + ", message=" + message);
		if (Detect.notEmpty(destination) && Detect.notEmpty(message)) {
			msgReceiver.saveMessage(destination, message, this.getUserContext());
			
			result = "message " + message + " sended to " + destination;
		} else {
			result = "destination and message can't be null.";
		}		
		return SUCCESS;
	}
	
	public String getPostEncoding() {
		return postEncoding;
	}

	public void setPostEncoding(String postEncoding) {
		this.postEncoding = postEncoding;
	}

	public String getGetEncoding() {
		return getEncoding;
	}

	public void setGetEncoding(String getEncoding) {
		this.getEncoding = getEncoding;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public void setMsgReceiver(MsgReceiver msgReceiver) {
		this.msgReceiver = msgReceiver;
	}

}
