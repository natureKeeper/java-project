package com.asb.cdd.messageproxy.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.asb.cdd.messageproxy.service.MsgReceiver;

/**
 * Servlet implementation class QqProxyServlet
 */
public class QqProxyServlet extends HttpServlet {

	private static final transient Log log = LogFactory.getLog(QqProxyServlet.class);

//	String urlEncoding;
//	String srcEncoding;
	String postEncoding;
	String getEncoding;
/*	MessageAccessService messageAccessService;
	int msgMaxSize = 100;*/
	MsgReceiver msgReceiver;

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	@Override
	public void init() throws ServletException {
		Properties prop = new Properties();
		try {
			InputStream is = this.getClass().getClassLoader().getResourceAsStream("applicationContext.properties");
			prop.load(is);
		} catch (Exception e) {
			throw new ServletException(e.getMessage());
		}

		getEncoding = prop.getProperty("http.get.encoding");
		postEncoding = prop.getProperty("http.post.encoding");
		
		ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext-server-index.xml");
		msgReceiver = (MsgReceiver)ac.getBean("msgReceiver");
	}
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//http://135.251.23.92:58080/qqHttpProxy/QqProxyServlet?qqlist=wusuirong&msg=%E4%BD%A0%E5%A5%BD
		String str = request.getQueryString();
		str = URLDecoder.decode(str, getEncoding);
		log.info("input: " + str);
		
		String destination = null;
		String message = null;
		StringTokenizer st = new StringTokenizer(str, "=&");
		while (st.hasMoreTokens()) {
			String key = st.nextToken();
			if ("destination".equals(key)) {
				destination = st.nextToken();
			} else if ("message".equals(key)) {
				message = st.nextToken();
			}
		}

		if (null != destination && !"".equals(destination) && null != message && !"".equals(message)) {
			msgReceiver.saveMessage(destination, message, null);
			
			PrintWriter pw = response.getWriter();
			pw.write("message " + message + " sended to " + destination);
		} else {
			PrintWriter pw = response.getWriter();
			pw.write("qqlist and message can't be null.");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding(postEncoding);
		String destination = request.getParameter("destination");
		String message = request.getParameter("message");
		if (null != destination && !"".equals(destination) && null != message && !"".equals(message)) {
			//new String(m.getBytes(urlEncoding), srcEncoding);
			//new String(qqlist.getBytes(urlEncoding), srcEncoding);
			log.info("qqlist: " + destination + "\nmsg: " + message);

			msgReceiver.saveMessage(destination, message, null);
			
			PrintWriter pw = response.getWriter();
			pw.write("message " + message + " sended to " + destination);
		} else {
			PrintWriter pw = response.getWriter();
			pw.write("qqlist and message can't be null.");
		}

	}

	@Override
	public void destroy() {
		super.destroy();
		log.info("qq proxy destroyed.");
	}
}
