package com.asb.cdd.messageproxy.service.util;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.messageproxy.dao.access.MessageAccessService;
import com.asb.cdd.messageproxy.dao.access.model.Message;
import com.asb.cdd.messageproxy.dao.access.model.criteria.MessageCriteria;
import com.asb.cdd.messageproxy.service.MsgSender;
import common.util.Detect;

public class QqMessageSenderDaemon implements Runnable {

	MessageAccessService messageAccessService;
	MsgSender msgSender;
	boolean sendMsgOnStartup;//是否启动消息发送
	boolean pauseSendingMsg;//是否暂停发送消息
	int scanMsgIntervalSeconds = 3;//扫描未发送消息的间隔
	static boolean inited = false;
	
	private static final transient Log log = LogFactory.getLog(QqMessageSenderDaemon.class);
	
	public synchronized void init() {
		if (!inited) {
			inited = true;
			scanMsgIntervalSeconds *= 1000;
			if (sendMsgOnStartup) {
				Thread t = new Thread(this);
				t.start();
			}
		}		
	}

	public void run() {
		MessageCriteria findWaitToSendMsgCriteria = new MessageCriteria();
		findWaitToSendMsgCriteria.setStatus(1);
		findWaitToSendMsgCriteria.setType(1);
		while (true) {
			try {
				Thread.sleep(scanMsgIntervalSeconds);
			} catch (InterruptedException e) {
				log.error(e, e);
			}
			
			List<Message> waitToSendMsgs = messageAccessService.find(findWaitToSendMsgCriteria, null);
			while (Detect.notEmpty(waitToSendMsgs)) {
				
				Set<Message> messageSet = new TreeSet<Message>(new Comparator<Message>() {

					public int compare(Message o1, Message o2) {
						if (null == o1.getCreateDate()) {
							return 1;
						}
						if (null == o2.getCreateDate()) {
							return -1;
						}
						if (o1.getCreateDate().after(o2.getCreateDate())) {
							return 1;
						} else {
							return -1;
						}
					}
					
				});
				messageSet.addAll(waitToSendMsgs);
				
				for (Message msg : messageSet) {
					boolean success = msgSender.send(msg.getDestination(), msg.getContent());
					msg.setFinishDate(new Date());
					if (success) {
						msg.setStatus(2);
						messageAccessService.update(msg, null);
						log.debug("qq msg sended. to=" + msg.getDestination() + ", text=" + msg.getContent());
					} else {
						log.error("qq msg send fail. to=" + msg.getDestination() + ", text=" + msg.getContent());
						msg.setStatus(3);
						messageAccessService.update(msg, null);
					}
				}
				waitToSendMsgs = messageAccessService.find(findWaitToSendMsgCriteria, null);
			}
		}
		
	}

	public MessageAccessService getMessageAccessService() {
		return messageAccessService;
	}

	public void setMessageAccessService(MessageAccessService messageAccessService) {
		this.messageAccessService = messageAccessService;
	}

	public MsgSender getMsgSender() {
		return msgSender;
	}

	public void setMsgSender(MsgSender msgSender) {
		this.msgSender = msgSender;
	}

	public boolean isSendMsgOnStartup() {
		return sendMsgOnStartup;
	}

	public void setSendMsgOnStartup(boolean sendMsgOnStartup) {
		this.sendMsgOnStartup = sendMsgOnStartup;
	}

	public boolean isPauseSendingMsg() {
		return pauseSendingMsg;
	}

	public void setPauseSendingMsg(boolean pauseSendingMsg) {
		this.pauseSendingMsg = pauseSendingMsg;
	}

	public int getScanMsgIntervalSeconds() {
		return scanMsgIntervalSeconds;
	}

	public void setScanMsgIntervalSeconds(int scanMsgIntervalSeconds) {
		this.scanMsgIntervalSeconds = scanMsgIntervalSeconds;
	}

	
}
