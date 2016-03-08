package net.sherwin.qqproxy;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class WapQqMsgSender implements MsgSender {
	
	private static final transient Log log = LogFactory.getLog(WapQqMsgSender.class);

	String proxyAddress;
	String proxyPort;
	String qqNumber;
	String qqPassword;
	
	String jvmEncoding;
	int sendInterval;
	int sendIntervalInError;
	int maxRetry;
	int maxLoginRetry;
	int loginInterval;
	HttpClient client;
	Map<String, String[]> groups;

	String sid;
	
	public WapQqMsgSender() throws Exception {
		groups = new HashMap<String, String[]>();
		client = new HttpClient();
		sendInterval = 200;
		sendIntervalInError = 1000;
		maxRetry = 3;
		maxLoginRetry = 10;
		loginInterval = 10000;
		
		init();
	}
	public boolean send(String destination, String message) {
		loginAndSendMessage(destination, message);
		return true;
	}
	
	public void init() throws Exception {
		Properties prop = new Properties();
		try {
			InputStream is = this.getClass().getClassLoader().getResourceAsStream("config_wapqq.properties");
			prop.load(is);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

		proxyAddress = prop.getProperty("proxyAddress");
		proxyPort = prop.getProperty("proxyPort");
		qqNumber = prop.getProperty("qqNumber");
		qqPassword = prop.getProperty("qqPassword");
		jvmEncoding = prop.getProperty("jvmEncoding");

		String sendIntervalStr = prop.getProperty("sendInterval");
		if (null != sendIntervalStr && !"".equals(sendIntervalStr)) {
			try {
				sendInterval = Integer.parseInt(sendIntervalStr);
			} catch (Throwable e) {
				log.error(e, e);
			}
		}
		String sendIntervalInErrorStr = prop.getProperty("sendIntervalInError");
		if (null != sendIntervalInErrorStr && !"".equals(sendIntervalInErrorStr)) {
			try {
				sendIntervalInError = Integer.parseInt(sendIntervalInErrorStr);
			} catch (Throwable e) {
				log.error(e, e);
			}
		}
		String maxRetryStr = prop.getProperty("maxRetry");
		if (null != maxRetryStr && !"".equals(maxRetryStr)) {
			try {
				maxRetry = Integer.parseInt(maxRetryStr);
			} catch (Throwable e) {
				log.error(e, e);
			}
		}
		String maxLoginRetryStr = prop.getProperty("maxLoginRetry");
		if (null != maxLoginRetryStr && !"".equals(maxLoginRetryStr)) {
			try {
				maxLoginRetry = Integer.parseInt(maxLoginRetryStr);
			} catch (Throwable e) {
				log.error(e, e);
			}
		}
		String loginIntervalStr = prop.getProperty("loginInterval");
		if (null != loginIntervalStr && !"".equals(loginIntervalStr)) {
			try {
				loginInterval = Integer.parseInt(loginIntervalStr);
			} catch (Throwable e) {
				log.error(e, e);
			}
		}

		// 设置代理服务器地址和端口
		if (null != proxyAddress && !"".equals(proxyAddress) && null != proxyPort && !"".equals(proxyPort)) {
			int port = Integer.parseInt(proxyPort);
			client.getHostConfiguration().setProxy(proxyAddress, port);
		}

		Enumeration keys = prop.keys();
		groups.clear();
		for (; keys.hasMoreElements();) {
			String key = (String) keys.nextElement();
			if (key.startsWith("group-")) {
				String value = prop.getProperty(key);
				if (null != value && !"".equals(value)) {
					String[] qqList = value.split(",");
					if (0 < qqList.length) {
						groups.put(key, qqList);
					}
				}
			}
		}

		StringBuffer sb = new StringBuffer();
		String br = System.getProperty("line.separator", "\n");
		sb.append(br + "jvmEncoding: " + jvmEncoding)
		.append(br + "sendInterval: " + sendInterval)
		.append(br + "sendIntervalInError: " + sendIntervalInError)
		.append(br + "maxRetry: " + maxRetry)
		.append(br + "maxLoginRetry: " + maxLoginRetry)
		.append(br + "loginInterval: " + loginInterval);

		log.info(sb.toString());

		log.info("qq proxy started");
	}
	
	private void loginAndSendMessage(String qq, String msg) {
		try {
			sid = this.login();
			this.getMessage();
			this.sendMessage(qq, msg);
		} catch (Exception e) {
			log.error(e, e);
		}
	}
	

	private String login() throws Exception {
		// 使用 GET 方法 ，如果服务器需要通过 HTTPS 连接，那只需要将下面 URL 中的 http 换成 https
		// HttpMethod method = new GetMethod("http://java.sun.com");
		// 使用POST方法

		HttpMethod method = new PostMethod("http://pt.3g.qq.com/psw3gqqLogin?r=634752595&amp;vdata=C0B496C5DC569C73E496281673C99BD8");// "http://pt.3g.qq.com/s?aid=nLogin3gqq&sid=AR9WMsNZljw2SOCFAlp3_ds9&loginTitle=%E6%89%8B%E6%9C%BA%E8%85%BE%E8%AE%AF%E7%BD%91&hiddenPwd=true");

		NameValuePair[] pairs = new NameValuePair[10];

		NameValuePair pair = null;

		pair = new NameValuePair();
		pair.setName("qq");
		pair.setValue(qqNumber);
		pairs[0] = pair;

		pair = new NameValuePair();
		pair.setName("pwd");
		pair.setValue(qqPassword);
		pairs[1] = pair;

		pair = new NameValuePair();
		pair.setName("bid_code");
		pair.setValue("3GQQ");
		pairs[2] = pair;

		pair = new NameValuePair();
		pair.setName("toQQchat");
		pair.setValue("true");
		pairs[3] = pair;

		pair = new NameValuePair();
		pair.setName("login_url");
		pair.setValue("http://pt.3g.qq.com/s?aid=nLoginnew&amp;q_from=3GQQ");
		pairs[4] = pair;

		pair = new NameValuePair();
		pair.setName("q_from");
		pair.setValue("");
		pairs[5] = pair;

		pair = new NameValuePair();
		pair.setName("modifySKey");
		pair.setValue("0");
		pairs[6] = pair;

		pair = new NameValuePair();
		pair.setName("loginType");
		pair.setValue("1");
		pairs[7] = pair;

		pair = new NameValuePair();
		pair.setName("aid");
		pair.setValue("nLoginHandle");
		pairs[8] = pair;

		pair = new NameValuePair();
		pair.setName("i_p_w");
		pair.setValue("qq%7Cpwd%7C");
		pairs[9] = pair;

		String qqid = null;
		method.setQueryString(pairs);
		int count = 0;
		while (true) {
			client.executeMethod(method);

			// 打印服务器返回的状态
			// System.out.println(method.getStatusLine());
			// 打印返回的信息
			// System.out.println(method.getResponseBodyAsString());
			String response = method.getResponseBodyAsString();

			int start = response.indexOf(";sid=") + 5;
			int end = response.indexOf("&amp;myqq=");

			if (5 < start && 0 < end) {
				qqid = response.substring(start, end);
				break;
			}
			if (maxLoginRetry < count) {
				throw new Exception("多次登录失败，放弃登录 login time out.");
			}
			try {
				log.info("登录失败，准备重试 login failed, retry later.\r\n" + response);
				Thread.sleep(sendIntervalInError);
			} catch (InterruptedException e) {
				log.error(e, e);
			}
			count++;
		}
		log.info("login successful, sid=" + qqid);
		
		// 释放连接
		method.releaseConnection();
		return qqid;
	}

	private void getMessage() throws HttpException, IOException {
		HttpMethod method = new PostMethod("http://q32.3g.qq.com/g/s?sid=" + sid + "&aid=nqqChat&saveURL=0&r=XXXXXXX&g_f=1653");
		client.executeMethod(method);
		// 释放连接
		method.releaseConnection();
		method = null;
	}

	private void sendMessage(String target, String message) throws Exception {
		String msg = URLEncoder.encode(message, jvmEncoding);
		String[] targets = target.split(",");
		List<String> qqList = new ArrayList<String>();
		for (int i = 0; i < targets.length; i++) {
			String alias = targets[i];
			if (alias.startsWith("group-")) {
				String[] qqs = groups.get(alias);
				if (null != qqs && 0 < qqs.length) {
					for (int j = 0; j < qqs.length; j++) {
						qqList.add(qqs[j]);
					}
				}
			} else {
				qqList.add(alias);
			}
		}

		HttpMethod method = null;
		for (int i = 0; i < qqList.size(); i++) {
			boolean success = false;
			int count = 0;
			while (!success && maxRetry > count) {
				method = new PostMethod("http://q32.3g.qq.com/g/s?" + "sid=" + sid + "&msg=" + msg + "&u=" + qqList.get(i) + "&saveURL=0&do=send&on=1&saveURL=0&aid=%E5%8F%91%E9%80%81" + "&num="
						+ qqList.get(i) + "&do=sendsms");
				client.executeMethod(method);
				String response = method.getResponseBodyAsString();
				
				try {
					Thread.sleep(sendInterval);
				} catch (InterruptedException e) {
					log.error(e, e);
				}
				
				if (!response.contains("消息发送成功")) {
					log.error("消息发送失败 send message fail. resend it. qq: " + qqList.get(i) + ", msg: " + msg);
					//log.error(response);
					count++;
					try {
						Thread.sleep(sendIntervalInError);
					} catch (InterruptedException e) {
						log.error(e, e);
					}
//					sid = this.login();
//					this.getMessage();
				} else {
					log.info("消息发送成功 send message success. qq: " + qqList.get(i) + ", msg: " + msg);
					success = true;
				}
			}
			if (null != method) {
				// 释放连接
				method.releaseConnection();
				method = null;
			}
		}
	}
}
