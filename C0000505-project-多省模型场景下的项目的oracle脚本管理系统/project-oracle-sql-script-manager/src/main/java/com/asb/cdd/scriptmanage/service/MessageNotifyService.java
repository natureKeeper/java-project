package com.asb.cdd.scriptmanage.service;

import com.irm.model.system.User;
import com.irm.system.authorization.vo.UserContext;

public interface MessageNotifyService {

	/**
	 * 通知用户
	 * @param user
	 * @param message
	 */
	public void notify(User user, String message, UserContext uc);
	
	/**
	 * 通知用户并广播到管理员
	 * @param user
	 * @param message
	 */
	public void notifyUserAndAdministrators(User user, String message, UserContext uc);
	
	/**
	 * 通知管理员
	 * 用于一些不是很重要的消息
	 * @param user
	 * @param message
	 * @param uc
	 */
	public void notifyAdministrators(User user, String message, UserContext uc);
}
