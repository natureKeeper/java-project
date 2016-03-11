<!--
   Licensed Materials - Property of IBM
   5655-FLW
   (C) Copyright IBM Corporation 2008. All Rights Reserved.
   US Government Users Restricted Rights- Use, duplication or disclosure
   restricted by GSA ADP Schedule Contract with IBM Corp.
-->

<%-- Page template for dialogs: Adapt 
			- additionalTaglibs
			- pageTitle
			- panelScripts
			- panelTitle, panelHelp
			- panelContent
			- panelCommandBar
--%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
-->

<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page errorPage="/error.jsp"%>

<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@taglib uri="http://com.ibm.bpe.jsf/taglib" prefix="bpe"%>
<%@taglib uri="http://com.ibm.bpe/contexthelp" prefix="hlp"%>
<f:view locale="#{user.locale}">

<html>
	<f:loadBundle basename="com.ibm.bpe.jsf.application.resources.ClientUI" var="bundle" />

	<head>
	  <TITLE>
		<h:outputText id="explorer" value="#{bundle['TITLE.EXPLORER']}" /> <h:outputText value=" - " />
		<h:outputText value="#{bundle['TITLE.KEY']}" />
	</TITLE>

	  <LINK rel="stylesheet" href="<%= request.getContextPath()%>/theme/<h:outputText value='#{user.styleName}'/>.css" type="text/css">
	  <LINK rel="stylesheet" href="<%= request.getContextPath()%>/theme/<h:outputText value='#{user.localeStyleName}'/>.css" type="text/css">
      <LINK href="<%= request.getContextPath()%>/fbpc/theme/Master.css" rel="stylesheet" type="text/css">
	</head>

	<body>
	 	<script>
			showPageInDialog = true;
		</script>
				
		<bpe:div id="panelContainer" styleClass="dialogPanelContainer">

		<%-- Headline of Content frame --%>

			<bpe:div id="title" styleClass="dialogPanelTitle">
				<f:verbatim>
					<A href="#navskip"><IMG id="blank" src="<%= request.getContextPath()%>/images/blank.gif" alt="Skip to main content"></A>
					<A name="navskip">
				</A></f:verbatim>
					<h:outputText value="Migrate To Process Template" />
				<f:verbatim>
					<A></A>
				</f:verbatim>
			</bpe:div>
			<bpe:div id="panelHelp" styleClass="dialogPanelHelp">
					<h:outputText value="Select a process template." />
				</bpe:div>
	
			<%-- End of Headline of Content frame --%>
	
			<bpe:div id="dialog" styleClass="dialogPanelGroup">
				<h:form styleClass="dialogPanelContainer" id="container">
				
					<h:outputText escape="false" value="#{ProcessEditorBean.availableTemplates}" />

					<DIV class="commandBar editorCommandBar">
		                <span>
		                    <input class="button editorButton" type="button" value="Migrate" onClick="migrateToTemplate();"/>
		                    <input id="delayedMigration" class="button editorButton" type="button" value="Set start point..." onClick="migrateToTemplateDelayed();"/>
		                    <input class="button editorButton" type="button" value="Cancel" onClick="window.location.reload(true);"/>
		                </span>
					</DIV>
				</h:form>
			</bpe:div>
		</bpe:div>
	</body>
</html>
</f:view>
