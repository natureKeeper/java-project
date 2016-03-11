///BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation  2005, 2008. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT


/*
** Scripts for Customization Page
*/

var loginViewSelection = null;
var viewCollector = null;

	function debug() {}

    /* activate for logging
    function debug(s) {
        if (!document.getElementById('debug')) {
            var d=document.createElement("div");
            d.id="debug";
            d.style.position="absolute";
            d.style.top="0px";
            d.style.left="0px";
            d.style.color="black";
            d.style.background="yellow";
            d.style.Zindex="999";
            document.getElementsByTagName("body")[0].appendChild(d);
        }
        if (!s) s="yo";
        document.getElementById("debug").innerHTML+=s+"<br>";
    } */

	/** Initialize or reinitialize the view with the values from the view collector
	**  remove from collector if initial selection state is the same as the collector selection state
	**
	**  @param loginViewId the id specified for the hidden input field for the login view selection
	**  @param viewCollectorId the id specified for the hidden input field for the view collector
	**/
	function initializeCustomization( loginViewId, viewCollectorId ) {

		// initialize
		setLoginViewSelection( loginViewId );
		setViewCollector( viewCollectorId );

		var vc = getViewCollector();
		if( vc && vc.value ) {
			// Add any options stored in the view collector
			//
			var values = viewCollector.value.split(";");
			for( var i = 0; i < values.length; i++ ) {
				var pos1 = values[i].indexOf(":");
				var pos2 = values[i].indexOf(":", pos1 + 1);
				var pos3 = values[i].indexOf(":", pos2 + 1);
				var view = values[i].substring(0, pos1);
				var check = values[i].substring(pos1 + 1, pos2);
				var label = values[i].substring(pos2 + 1, pos3);
				var checkName = values[i].substr( pos3 + 1);
				if( view && view.length > 0 ) {
					// check/uncheck
					debug("Initializing view checkbox " + view + " check=" + check) ;
					var checkbox = document.getElementsByName(checkName);
					if (checkbox != null) {
						if (check == "true") {
							if (checkbox[0].checked) {
								// is initial value, remove from collector
								removeSelectedView(values[i]);
							} else {
								checkbox[0].checked = true;
								/* TODO remove if no fix for JSF validation
									done by getLoginViewItems
								if( label && label.length > 0 ) {
									// add to login views
									debug("Initializing login option " + label) ;
									addLoginViewOption(  view, label );
								}
								*/
							}
						} else {
							if (!checkbox[0].checked) {
								// is initial value, remove from collector
								removeSelectedView(values[i]);
							} else {
								checkbox[0].checked = false;
								/* TODO remove  if no fix for JSF validation
									done by getLoginViewItems
								if( label && label.length > 0 ) {
									// remove from login views
									debug("Removing login option " + label) ;
									removeLoginViewOption( view, label );
								}
								*/
							}
						}
					}
				}
			}
		}
	}

	/** Initialize the login selection element for this page
	**
	**  @param id the id specified for the hidden input field for the login selection
	**/
	function setLoginViewSelection( id ) {
		debug("id=" + id) ;
		loginViewSelection = getElement( id, "select");
		debugLoginViewSelection("setLoginViewSelection:");
	}

	/** Get the login selection element for this page
	**/
	function getLoginViewSelection() {
		if (loginViewSelection == null) {
			debug("initializing default loginViewSelection.") ;
			setLoginViewSelection( "loginView" );
		}
		return loginViewSelection;
	}

	/** Initialize the view collector element for this page
	**
	**  @param id the id specified for the hidden input field for the view collector
	**/
	function setViewCollector( id ) {
		debug("id=" + id) ;
		viewCollector = getElement( id, "input", "hidden");
		debugViewCollector("setViewCollector:");
	}

	/** Get the view collector element for this page
	**/
	function getViewCollector() {
		if (viewCollector == null) {
			debug("initializing default viewCollector.") ;
			setViewCollector( "viewCollect" );
		}
		return viewCollector;
	}

	/** Trace the settings
	**/
	function debugSettings(prefix) {
		debugViewCollector(prefix);
		debugLoginViewSelection(prefix);
	}

	/** Trace the viewCollector
	**/
	function debugViewCollector(prefix) {
		debug( prefix + " viewCollect=" + getViewCollector() );
	}

	/** Trace the loginViewSelection
	**/
	function debugLoginViewSelection(prefix) {
        var loginSelection = getLoginViewSelection();
        for( idx = 0; idx < loginSelection.options.length; idx++ ) {
            var option = loginSelection.options[ idx ] ;
            debug( prefix + " loginViewSelection.option[" + idx + "]=" + option.value );
        }
		debug( prefix + " loginViewSelection.selectedIndex=" + getLoginViewSelection().selectedIndex );
	}

	/** The user has selected/deselected a view
	**  @param view the selected view
	**  @param label the label for the view
	**  @param selected indicates if the view was initially selected or unselected
	**  @param checkbox the checkbox of the changed view
	**/
	function choose( view, label, selected, checkbox) {

		debugSettings("Before choose:");

		var check = checkbox.checked;
		var checkName = checkbox.name;
		var value = makeValue( view, check, checkName, label );
		debug( "choose( " + value + " )" );

		if( check ) {
			if (selected == "false") {
				addSelectedView( value );
			} else {
				removeSelectedView( value );
			}
			addLoginViewOption( view, label );
		}
		else {
			if (selected== "false") {
				removeSelectedView( value);
			} else {
				addSelectedView( value);
			}
			removeLoginViewOption( view, label );
		}

		debugSettings("After choose:");
	}

	/** Create a value string to be used internally
	**  @param view a view string
	**  @param check indicates if the view is selected or unselected
	**  @param checkName the name by which the checkbox is identified
	**  @param label the label for the view
	**  @return a formatted value of the form "{view}:{check}:{label}":{checkName}
	*/
	function makeValue( view, check, checkName, label ) {
		return view + ":" + check + ":" + label + ":" + checkName;
	}

	/**  Retrieve the view from a value string
	**  @param value a formatted value of the form "{view}:{check}:{label}":{checkName}
	**  @return the view
	*/
	function getView( value ) {
		var pos1 = value.indexOf(":");
		return value.substring(0, pos1);
	}

	/** Collect the selected view in a collector
	**  @param value the collector value string created with makeValue(...)
	**/
	function addSelectedView( value ) {
		var collector = getViewCollector();
		if( collector != null ) {
			var values = collector.value ;
			if( values.indexOf( getView(value) ) < 0 ) {
				values += (value + ";") ;
			}
			collector.value = values;
		}
	}

	/** Remove a view from a collector
	**  @param value the collector value string created with makeValue(...)
	**/
	function removeSelectedView( value ) {
		var collector = getViewCollector();
		if( collector != null ) {
			var values = collector.value ;
			var newValues = values;
			var view = getView(value);
			var start = values.indexOf(view);
			if( start >= 0 ) {
				var end = values.indexOf(";", start);
				newValues = values.substr(0, start) + values.substr(end + 1);
			}
			collector.value = newValues;
		}
	}

	/** Add a view in the login selector
	**  @param view the selected view
	**  @param label the label for the view
	**/
	function addLoginViewOption( view, label ) {
		var loginSelection = getLoginViewSelection();
		if( loginSelection != null ) {
			var newOption = new Option( label, view );
			loginSelection.options[loginSelection.options.length] = newOption;
		}
	}



	/** Remove a view from the login selector
	**  @param view the selected view
	**  @param label the label for the view
	**/
	function removeLoginViewOption( view, label ) {
		var loginSelection = getLoginViewSelection();
		if( loginSelection != null ) {
			// Iterate over the options of the selection and try to find the value
			//
			for( idx = 0; idx < loginSelection.options.length; idx++ ) {
				var option = loginSelection.options[ idx ] ;
				debug( "Comparing " + option.value + " with " + view );
				if( option.value == view ) {

					// Check if this is the selected item. If yes, select the default item ('0')
					if( idx == loginSelection.selectedIndex ) {
						loginSelection.selectedIndex = 0;
					}

					// Finally remove the item from the selection
					loginSelection.options[idx] = null;
					debug( "removed item #" + idx );
				}
			}
		}
	}

	function changeLoginView() {
		debug( "Login view selected " );
	}
