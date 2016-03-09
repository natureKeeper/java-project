package runtime;

//import java.io.File;

//import javax.management.MBeanServer;

//import java.lang.management.ManagementFactory;

//import javax.management.MBeanServer;

//import java.lang.management.ManagementFactory;
import java.util.Properties;

//import javax.management.MBeanServer;
//import javax.management.MBeanServerFactory;
//import javax.management.remote.JMXConnectorServer;
//import javax.management.remote.JMXConnectorServerFactory;
//import javax.management.remote.JMXServiceURL;

import org.mortbay.jetty.Connector; //import org.mortbay.jetty.NCSARequestLog;
import org.mortbay.jetty.Server; //import org.mortbay.jetty.handler.RequestLogHandler;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.webapp.WebAppContext;
//import org.mortbay.management.MBeanContainer;
import org.springframework.core.io.ClassPathResource;

//import org.mortbay.management.MBeanContainer;

//import org.mortbay.thread.BoundedThreadPool;
/**
 * @see <url>http://docs.codehaus.org/display/JETTY/Embedding+Jetty</url>
 * @see $ JETTY_HOME}\examples\embedded\src\main\java\org\mortbay\jetty\example\
 *      OneWebApp.java
 * 
 *      Using embedded mode for OneWebApp
 * 
 *      <p>
 *      dependencies: jasper-compiler-5.5.15.jar jasper-compiler-jdt-5.5.15.jar
 *      jasper-runtime-5.5.15.jar
 * 
 *      jetty-6.1.7.jar jetty-util-6.1.7.jar
 * 
 *      jsp-api-2.0.jar servlet-api-2.5-6.1.7.jar
 * 
 *      slf4j-api-1.3.1.jar slf4j-simple-1.3.1.jar
 * 
 *      xercesImpl-2.6.2.jar xmlParserAPIs-2.6.2.jar
 */
public class MessageForwardSystemStarter {

	public static void main(String[] args) throws Exception {

		ClassPathResource classPathResource = new ClassPathResource("jetty.properties");
		Properties properties = new Properties();
		properties.load(classPathResource.getInputStream());

		int port = Integer.parseInt(properties.getProperty("http.port"));// 8000;
		String contextPath = properties.getProperty("http.context.path");// "/irm";

		String warApp = "src/main/webapp";
		//
		long begin = System.currentTimeMillis();
		//
		Server server = new Server();

		// thread pool
		// BoundedThreadPool threadPool = new BoundedThreadPool();
		// threadPool.setMaxThreads(100);
		// server.setThreadPool(threadPool);

		//
		Connector connector = new SelectChannelConnector();
		connector.setPort(Integer.getInteger("jetty.port", port).intValue());
		// connector.setHost("127.0.0.1");
		server.setConnectors(new Connector[] { connector });

		//
		WebAppContext webAppContext = new WebAppContext(warApp, contextPath);
		// webAppContext.setContextPath(contextPath);
		// webAppContext.setWar(warUrl);
		/* Solving files are locked on Windows and can't be replaced */
		webAppContext.setDefaultsDescriptor("./src/test/resources/jetty.webdefault.xml");
		webAppContext.setExtraClasspath("./target/classes");
		server.setHandler(webAppContext);

		String host = (null == connector.getHost() ? "127.0.0.1" : connector.getHost());
		
		
		//RmiRegistry
		//new org.springframework.remoting.rmi.RmiRegistryFactoryBean().afterPropertiesSet();
		
		//jmx support
		/*
		 * An example of how to start up Jetty with JMX programatically:
		 * http://docs.codehaus.org/display/JETTY/JMX
		 */
//		MBeanServer mBeanServer = ManagementFactory.getPlatformMBeanServer();
//		if (null == mBeanServer) {
//			mBeanServer = MBeanServerFactory.createMBeanServer();
//		}
//		MBeanContainer mBeanContainer = new MBeanContainer(mBeanServer);
//		server.getContainer().addEventListener(mBeanContainer);
//		mBeanContainer.start();
		
//		JMXServiceURL jmxServiceURL = new JMXServiceURL("service:jmx:rmi:///jndi/rmi://127.0.0.1:1099/jmxconnector");		
//		JMXConnectorServer jmxConnectorServer = JMXConnectorServerFactory.newJMXConnectorServer(jmxServiceURL, null, mBeanServer);
//		jmxConnectorServer.start();

		/* jetty log */
		// RequestLogHandler requestLogHandler = new RequestLogHandler();
		// File logFile = new File(new File("").getAbsoluteFile(), "jetty.log");
		// logFile.createNewFile();
		// NCSARequestLog requestLog = new
		// NCSARequestLog(logFile.getAbsolutePath());
		// requestLog.setExtended(false);
		// requestLogHandler.setRequestLog(requestLog);
		// server.addHandler(requestLogHandler);

		/* */
		// server.setStopAtShutdown(true);
		// server.setSendServerVersion(true);

		// SslListener listener = new SslListener();
		// listener.setMinThreads(10);
		// listener.setMaxThreads(200);
		// String strUrl = LoadPath.getRootPath(null);
		// listener.setKeystore(strUrl+"etc/maxnet.store");
		// listener.setKeyPassword("maxnet");
		// listener.setPassword("maxnet");
		// //listener.setHost(addr.getHostAddress());
		// listener.setPort(httpsPort);
		// listener.setProtocol("SSL");
		// listener.setConfidentialScheme("https");
		// service.addListener(listener);

		try {
			server.start();
			String url = "http://" + host + ":" + port + contextPath;
			System.out.println("[Jetty Server started in " + (System.currentTimeMillis() - begin) + " ms]: " + url);
			//
			// server.join();
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(100);
		}

	}
}
