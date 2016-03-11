<!--
   Licensed Materials - Property of IBM
   5655-FLW
   (C) Copyright IBM Corporation 2008. All Rights Reserved.
   US Government Users Restricted Rights- Use, duplication or disclosure
   restricted by GSA ADP Schedule Contract with IBM Corp.
-->


<%-- Page template for all views: Adapt 
			- html
			- additionalHeadTags
			- title
			- included layout jsp
--%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
-->

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page errorPage="/error.jsp"%>

<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@taglib uri="http://com.ibm.bpe.jsf/taglib" prefix="bpe"%>

<f:view locale="#{user.locale}">
<HTML>
</HTML><f:loadBundle basename="com.ibm.bpe.jsf.application.resources.ClientUI" var="bundle" />

	<HEAD>

		<TITLE><h:outputText value="#{bundle['TITLE.EXPLORER']}" /> <h:outputText value=" - " /><h:outputText value="Process Editor" /></TITLE>
	
		<LINK rel="stylesheet" href="<%= request.getContextPath()%>/theme/<h:outputText value='#{user.styleName}'/>.css" type="text/css">
		<LINK rel="stylesheet" href="<%= request.getContextPath()%>/theme/<h:outputText value='#{user.localeStyleName}'/>.css" type="text/css">
		<LINK href="<%= request.getContextPath()%>/bpc/graph/theme/Graph.css" rel="stylesheet" type="text/css">
		<LINK href="<%= request.getContextPath()%>/bpc/bpel/theme/Bpel.css" rel="stylesheet" type="text/css">
		<LINK href="<%= request.getContextPath()%>/bpc/admin/theme/Admin.css" rel="stylesheet" type="text/css">
		<LINK href="<%= request.getContextPath()%>/bpc/dynamicity/theme/Dynamicity.css" rel="stylesheet" type="text/css">
		
		<LINK href="<%= request.getContextPath()%>/dojo1.0.2/dijit/themes/tundra/tundra.css" rel="stylesheet" type="text/css">
	    <script type="text/javascript" src="<%= request.getContextPath()%>/dojo1.0.2/dojo/dojo.js" djConfig="parseOnLoad: true, isDebug: true"></script>
	
		<script type="text/javascript" >
	        dojo.registerModulePath("bpc.graph","<%= request.getContextPath()%>/bpc/graph");
	        dojo.registerModulePath("bpc.bpel","<%= request.getContextPath()%>/bpc/bpel");
	        dojo.registerModulePath("bpc.admin","<%= request.getContextPath()%>/bpc/admin");
	        dojo.registerModulePath("bpc.dynamicity","<%= request.getContextPath()%>/bpc/dynamicity");
	        dojo.registerModulePath("bpc.wfg","<%= request.getContextPath()%>/bpc/wfg");
		</script>
	    <script type="text/javascript" src="<%= request.getContextPath()%>/bpc/dynamicity/DynamicityDecorator.js"></script>
	    <script type="text/javascript" src="<%= request.getContextPath()%>/bpc/dynamicity/EventHandler.js"></script>
	    <script type="text/javascript" src="<%= request.getContextPath()%>/bpc/bpel/ProcessParser.js"></script>
        <script type="text/javascript" src="<%= request.getContextPath()%>/bpc/bpel/Utils.js"></script>
	
		<script src="<%= request.getContextPath()%>/js/common.js" type="text/javascript"></script>
		<script src="<%= request.getContextPath()%>/js/popupDialog.js" type="text/javascript"></script>
	</HEAD>

	<BODY class="tundra">
	<%-- Check for valid session --%>
	<h:outputText value="#{user.validSession}" />
	<bpe:div id="pageDiv" styleClass="page">
		<h:panelGrid id="rootGrid" columns="1" styleClass="page">
			<bpe:div id="navMenubar" styleClass="menubar">
				<jsp:include page="/pages/includes/Menubar.jsp" flush="false" />
			</bpe:div>
	
			<h:panelGrid id="mainGrid" columns="2" styleClass="pageBody" columnClasses="pageBodyNavigator,pageBodyContent">
				<h:form id="pageNavigation">
					<bpe:div id="navDiv" styleClass="navigator">
						<jsp:include page="/pages/includes/Navigator.jsp" flush="false" />
					</bpe:div>
				</h:form>
	
				<h:form id="pageContent">
					<bpe:div id="contentDiv" styleClass="content"><jsp:include page="/bpc/dynamicity/pages/ProcessEditor.jsp" flush="false" /></bpe:div>
				</h:form>
			</h:panelGrid>
		</h:panelGrid>
	</bpe:div>
	</BODY>

	<HTML></HTML>
</f:view>
