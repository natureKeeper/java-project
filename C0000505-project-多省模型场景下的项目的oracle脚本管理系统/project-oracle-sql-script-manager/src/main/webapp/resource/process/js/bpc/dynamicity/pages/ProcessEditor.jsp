<!--
   Licensed Materials - Property of IBM
   5655-FLW
   (C) Copyright IBM Corporation 2008. All Rights Reserved.
   US Government Users Restricted Rights- Use, duplication or disclosure
   restricted by GSA ADP Schedule Contract with IBM Corp.
-->


<%-- Page template for lists: Adapt 
			- panel title and help, 
			- commandbar model and commands
			- list model and columns 
--%>
<%--
   Licensed Materials - Property of IBM
   5655-FLW (C) Copyright IBM Corporation 2005, 2006. All Rights Reserved.
   US Government Users Restricted Rights- Use, duplication or disclosure
   restricted by GSA ADP Schedule Contract with IBM Corp.
--%>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@taglib uri="http://com.ibm.bpe.jsf/taglib" prefix="bpe"%>
<%@taglib uri="http://com.ibm.bpe/contexthelp" prefix="hlp"%>

<f:verbatim>
	<h:outputText escape="false" value="#{ProcessEditorBean.javascriptVariables}" />
</f:verbatim>
<f:subview id="content">
	
	<bpe:div id="panelContainer" styleClass="panelContainer">

	    <%-- Headline of Content frame --%>
	    
	    <bpe:div id="panelTitle" styleClass="panelTitle">
			<f:verbatim>
	    		<A href="#navskip"><IMG src="<%= request.getContextPath()%>/images/blank.gif" alt="Skip to main content"></A>
				<A name="navskip"></A>
			</f:verbatim>
	    </bpe:div>
		
		<bpe:div id="panelHelp" styleClass="panelHelp">
		<h:outputText value="Use this page to view the structure of a process." rendered="#{!ProcessEditorBean.editMode}"/>
		<h:outputText value="Use this page to modify a single process instance." rendered="#{ProcessEditorBean.editMode}"/>
			<hlp:help id="helpIcon" contextId="hugo" />
			</bpe:div>
		
		<%-- End of Headline of Content frame --%>
		
		<bpe:div id="panelGroup" styleClass="panelGroup">
		<DIV class="commandBar editorCommandBar">
            <table>
                <tbody>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <input id="undoButton" class="button editorButton" type="button" value="Undo" onClick="window.location.reload(true);"/>
                        </td>
                        <td>
                            <input id="migrateButton" class="button editorButton" type="button" value="Save" onClick="startMigration();"/>
                        </td>
                        <td>
                            <input class="button editorButton" type="button" value="Show BPEL" onClick="showBpelInBox();"/>
                        </td>

                        <td>
                        	<span class="editorSliderLabel">Detail level:</span>
                        </td>
                        <td>
                    		<div dojoType="dijit.form.HorizontalSlider" class="editorSlider" name="style"
                    			onChange="dijit.byId('processWidget').setDetailLevel(9 - arguments[0]);"
                    			value="9"
                    			maximum="9"
                    			minimum="0"
                    			discreteValues="10"
                    			showButtons="true"
                    			id="slider2">
                    			
                    			<div dojoType="dijit.form.HorizontalRule" container="bottomDecoration" count=10 style="height:5px"></div>
                    			<ol dojoType="dijit.form.HorizontalRuleLabels" container="bottomDecoration" style="height:10px;font-size:10px;color:gray;">
        				            <li>less details</li>
        				            <li>more details</li>
        				        </ol>
                    		</div>
                        </td>
    
                        <td>
                        	<span class="editorSliderLabel">Zoom:</span>
                        </td>
                        <td>
                    		<div dojoType="dijit.form.HorizontalSlider" class="editorSlider" name="style"
                    			onChange="dijit.byId('processWidget').setZoomLevel(arguments[0]);"
                    			value="10"
                    			maximum="14"
                    			minimum="3"
                    			discreteValues="12"
                    			showButtons="true"
                    			id="slider1">
                    			
                    			<div dojoType="dijit.form.HorizontalRule" container="bottomDecoration" count=12 style="height:5px"></div>
                    			<ol dojoType="dijit.form.HorizontalRuleLabels" container="bottomDecoration" style="height:10px;font-size:10px;color:gray;">
        				            <li>small</li>
        				            <li>large</li>
        				        </ol>
                    		</div>
                        </td>
    
                    </tr>
                </tbody>
            </table>
		</DIV>
			

		<script type="text/javascript" >
            dojo.registerModulePath("bpc.graph","<%= request.getContextPath()%>/bpc/graph");
            dojo.registerModulePath("bpc.bpel","<%= request.getContextPath()%>/bpc/bpel");
            dojo.registerModulePath("bpc.admin","<%= request.getContextPath()%>/bpc/admin");
            dojo.registerModulePath("bpc.dynamicity","<%= request.getContextPath()%>/bpc/dynamicity");
            dojo.registerModulePath("bpc.wfg","<%= request.getContextPath()%>/bpc/wfg");
			
            dojo.require("bpc.graph.GraphWidget");
			dojo.require("bpc.bpel.ProcessParser");
			dojo.require("bpc.dynamicity.EventHandler");
			dojo.require("bpc.graph.DefaultCoordinator");
			dojo.require("bpc.graph.DefaultLinkRenderer");
			dojo.require("bpc.graph.DefaultTransformer");
			dojo.require("bpc.bpel.BpelLinkRenderer");
			dojo.require("bpc.bpel.BpelNodeRenderer");
			dojo.require("bpc.bpel.BpelLayouter");
			dojo.require("bpc.bpel.WFGTransformer");
			dojo.require("bpc.bpel.WFGLayouter");
			dojo.require("bpc.bpel.WFGNodeRenderer");
			dojo.require("bpc.bpel.Adapter");
			dojo.require("bpc.dynamicity.DynamicityDecorator");

			dojo.require("dijit.form.Slider");

			dojo.addOnLoad(init);
			
			function init() {
				var widget = dijit.byId("processWidget");
           		widget.graphicalViewMode = 255;

                // init event handler
                var eventHandler = new bpc.dynamicity.EventHandler(widget);
                eventHandler.initialize();

                // init layouts
				var coordinator = new bpc.graph.DefaultCoordinator(widget, false, dojo.byId("pageDiv"));
				var linkRenderer = new bpc.bpel.BpelLinkRenderer(widget);
				var nodeRenderer = new bpc.bpel.BpelNodeRenderer(widget);
				var layouter = new bpc.bpel.BpelLayouter(widget, true);
                var decorator = new bpc.dynamicity.DynamicityDecorator(widget);
                var layouts = [ 
								{transformer: new bpc.graph.DefaultTransformer(widget,0),
                				layouter: layouter,
                				nodeRenderer: nodeRenderer,
                				linkRenderer: linkRenderer,
								coordinator: coordinator,
                                decorator: decorator},
								
								{transformer: new bpc.bpel.BpelTransformer(widget,1),
                				layouter: layouter,
                				nodeRenderer: nodeRenderer,
                				linkRenderer: linkRenderer,
								coordinator: coordinator,
                                decorator: decorator},
								
								{transformer: new bpc.bpel.BpelTransformer(widget,2),
                				layouter: layouter,
                				nodeRenderer: nodeRenderer,
                				linkRenderer: linkRenderer,
								coordinator: coordinator,
                                decorator: decorator},
								
								{transformer: new bpc.bpel.BpelTransformer(widget,3),
                				layouter: layouter,
                				nodeRenderer: nodeRenderer,
                				linkRenderer: linkRenderer,
								coordinator: coordinator,
                                decorator: decorator}];
								
                var visualizations = new bpc.graph.VisualizationManager(widget, layouts);
				widget.layouts = visualizations;
				widget.adapter = new bpc.bpel.Adapter(widget);
				// end of experimental code
		
                // init parser
                widget.setParser(new bpc.bpel.ProcessParser(widget, widget.model));

                // set attributes
//                widget.store.localFolder = "bpel/dynamicity/";
 //               widget.store.componentFile = "DynamicityProcess5.component";
//                widget.store.localFolder = "bpel/LoanRequest/";
//                widget.store.componentFile = "LoanRequestProcess.component";
//				widget.store.localFileSystem = true;

                widget.store.setLoadURL('fbpcREST?action=getFileFromEAR&');
				widget.load(ptid);			
//				widget.loadTemplate('_PT:90010116.f71b7b76.feffff80.e1df0000');			
			}

            function startMigration() {
                var widget = dijit.byId("processWidget");
                widget.parser.deploy();

            }
		</script>	

		
        <div id="processWidget" dojoType="bpc.graph.GraphWidget">
        </div>	

        <div dojoType="dijit.Dialog" id="propertiesDialog" title="Properties" execute="dijit.byId('propertiesDialog').propertyManager.close();" onLoad="dijit.byId('propertiesDialog').propertyManager.init();">
        </div>
		</bpe:div>
	
	</bpe:div>
		
</f:subview>
