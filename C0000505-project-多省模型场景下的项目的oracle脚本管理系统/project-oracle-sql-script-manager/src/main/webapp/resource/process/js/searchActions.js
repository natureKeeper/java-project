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
* 	Special Logic for SourceTargetSelect used for the available actions list boxes.
*
*
*/

SearchActions.prototype = new SourceTargetSelect;

function SearchActions(subViewId, subViewIdSummary) {
	this.base = SourceTargetSelect;
	this.base(subViewId,true);	
	this.idPrefixSummary = subViewIdSummary || "";
	if (this.idPrefixSummary != null && this.idPrefixSummary != "") {
		this.idPrefixSummary = this.idPrefixSummary + ":";
	}
}
	
/* initialize summary table from hidden input */
SearchActions.prototype.initializeSummarySelectedColumns = SearchActions_initializeSummarySelectedColumns;
function SearchActions_initializeSummarySelectedColumns() {
	/* add selected items from hidden input to target select */
	var summaryTable = createSummaryTable(this.spanSummarySelectedColumns.getElement());
	if (summaryTable) {
		var values = this.targetItems.getValues();
		for (var i = 0; i < values.length; i++) {
			var row = this.createSelectedColumnsSummaryRow(values[i]);
			summaryTable.childNodes[0].appendChild(row);
		}
	}
}


SearchActions.prototype.initializeTargetItems = SearchActions_initializeTargetItems;
function SearchActions_initializeTargetItems() {
	SourceTargetSelect.prototype.initializeTargetItems.call(this);
	if (hasPaneSearchSummary()) {
		this.initializeSummarySelectedColumns();
	}
}

	
SearchActions.prototype.initializeTargetElements = SearchActions_initializeTargetElements;
function SearchActions_initializeTargetElements() {
	SourceTargetSelect.prototype.initializeTargetElements.call(this);
	//
	// summary
	//
	if (hasPaneSearchSummary()) {
		this.spanSummarySelectedColumns = new Element(this.idPrefixSummary + "selectedActions", "span", null);
	}
}

/********************/
/* Helper functions */
/********************/

SearchActions.prototype.createSelectedColumnsSummaryRow = function(columnObject) {
	var row = createSummaryRow();
	var label = columnObject.getLabel();
	if (row && row.firstChild) {
		row.firstChild.innerHTML = label;		
	}
	return row;
};

