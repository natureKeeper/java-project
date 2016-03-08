package net.sherwin.qqproxy;

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

/**
 * Servlet implementation class QqProxyServlet
 */
public class QqProxyServlet extends HttpServlet {

	private static final transient Log log = LogFactory.getLog(QqProxyServlet.class);

//	String urlEncoding;
//	String srcEncoding;
	String postEncoding;
	String getEncoding;
	
	MsgSender msgSender;

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	@Override
	public void init() throws ServletException {
		Properties prop = new Properties();
		try {
			InputStream is = this.getClass().getClassLoader().getResourceAsStream("config.properties");
			prop.load(is);
		} catch (Exception e) {
			throw new ServletException(e.getMessage());
		}

		getEncoding = prop.getProperty("getEncoding");
		postEncoding = prop.getProperty("postEncoding");
		
		try {
			msgSender = new Qq2012MsgSender();
		} catch (Exception e) {
			throw new ServletException(e);
		}
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
		
		String qqlist = null;
		String msg = null;
		StringTokenizer st = new StringTokenizer(str, "=&");
		while (st.hasMoreTokens()) {
			String key = st.nextToken();
			if ("qqlist".equals(key)) {
				qqlist = st.nextToken();
			} else if ("msg".equals(key)) {
				msg = st.nextToken();
			}
		}

		if (null != qqlist && !"".equals(qqlist) && null != msg && !"".equals(msg)) {
			synchronized (this) {
				msgSender.send(qqlist, msg);
			}
			PrintWriter pw = response.getWriter();
			pw.write("message " + msg + " sended to " + qqlist);
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
		String qqlist = request.getParameter("qqlist");
		String m = request.getParameter("msg");
		if (null != qqlist && !"".equals(qqlist) && null != m && !"".equals(m)) {
			String msg = m;//new String(m.getBytes(urlEncoding), srcEncoding);
			String destination = qqlist;//new String(qqlist.getBytes(urlEncoding), srcEncoding);
			log.info("qqlist: " + destination + "\nmsg: " + msg);
			synchronized (this) {
				msgSender.send(destination, msg);
			}
			PrintWriter pw = response.getWriter();
			pw.write("message " + msg + " sended to " + qqlist);
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
