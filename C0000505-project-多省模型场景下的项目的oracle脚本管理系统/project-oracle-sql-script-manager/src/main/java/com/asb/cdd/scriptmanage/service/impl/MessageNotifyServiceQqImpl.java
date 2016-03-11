package com.asb.cdd.scriptmanage.service.impl;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.service.MessageNotifyService;
import com.irm.model.system.User;
import com.irm.model.system.criteria.UserCriteria;
import com.irm.system.access.namespace.service.UserAccessService;
import com.irm.system.authorization.vo.UserContext;
import common.util.Detect;

public class MessageNotifyServiceQqImpl implements MessageNotifyService {
	
	private static final transient Log log = LogFactory.getLog(MessageNotifyServiceQqImpl.class);
	
	private String baseUrl;
	private UserAccessService userAccessService;
	private String serviceEncoding;

	public synchronized void notify(User user, String message, UserContext uc) {
		String qqName = user.getOfficePhone();
		if (!Detect.notEmpty(qqName)) {
			return;
		}
		
		String requestUrl = baseUrl;// + "?qqlist=" + qqName + "&msg=" + message;
		
		BufferedInputStream bis = null;
		GetMethod getMethod = null;
		PostMethod postMethod = null;
		ByteArrayOutputStream baos = null;
        try {   
            URI uri = new URI(requestUrl, false, serviceEncoding);//serviceEncoding
            HttpClient hc = new HttpClient();
            hc.setConnectionTimeout(3000);
            hc.setTimeout(10000);
//            getMethod = new GetMethod(uri.toString());
//            URLEncoder.encode(message, "iso-8859-1")
            postMethod = new PostMethod(uri.toString());
            postMethod.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, serviceEncoding);
            postMethod.addParameter("destination", qqName);
            postMethod.addParameter("message", user.getName() + "，你好\r" + message);
            int status = hc.executeMethod(postMethod);
            if (status == 200) {   
                bis = new BufferedInputStream(postMethod.getResponseBodyAsStream());   
                baos = new ByteArrayOutputStream();
  
                byte[] buffer = new byte[1024];   
                int len = 0;   
                while ((len = bis.read(buffer)) != -1) {   
                	baos.write(buffer, 0, len);
                }
            }
        } catch (Exception e) {
        	
        } finally {   
            if(getMethod != null){   
                getMethod.releaseConnection();   
            }   
            if(bis != null){   
                try {
					bis.close();
				} catch (IOException e) {
					log.error(e, e);
				}   
            }   
        }
	}

	public String getBaseUrl() {
		return baseUrl;
	}

	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}
	
	public synchronized void notifyUserAndAdministrators(User user, String message, UserContext uc) {
		//通知脚本所属用户
		this.notify(user, message, uc);
		//通知管理层
		this.notifyAdministrators(user, message, uc);
	}
	
	public synchronized void notifyAdministrators(User user, String message, UserContext uc) {
		//通知执行者
//		this.notify(uc.getUser(), message, uc);
		//通知管理员
		UserCriteria criteria = new UserCriteria();
		criteria.setMemo("admin");
		List<User> admins = userAccessService.find(criteria, uc);

		if (Detect.notEmpty(admins)) {
			for (User admin : admins) {
				if (admin.getUsername().equals(user)) {
					continue;
				} else if (admin.getUsername().equals(uc.getUser().getUsername())) {
					continue;
				}
				this.notify(admin, message, uc);
			}
		}
	}

	public void setUserAccessService(UserAccessService userAccessService) {
		this.userAccessService = userAccessService;
	}

	public void setServiceEncoding(String serviceEncoding) {
		this.serviceEncoding = serviceEncoding;
	}


}
