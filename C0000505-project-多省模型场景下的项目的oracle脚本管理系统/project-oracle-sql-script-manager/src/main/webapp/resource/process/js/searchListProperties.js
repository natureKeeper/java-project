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
 * Scripts for Search Pages - List Properties
 *
*/

/********************/
/* Helper functions */
/********************/

function appendOption(selectElement, option) {
    if (selectElement) {
        try {
            selectElement.add(option, null);
        } catch(ex) {
            selectElement.add(option);  // IE only
        }
    }
}

function insertOption(selectElement, option, beforeIndex) {
    if (selectElement) {
        if (beforeIndex >= 0 && beforeIndex < selectElement.options.length) {
            var beforeOption = selectElement.options[beforeIndex];
            try {
                selectElement.add(option, beforeOption);
            } catch(ex) {
                selectElement.add(option, beforeIndex);
            }
        } else {
            appendOption(selectElement, option);
        }
    }
}

/**
 *  move selected elements up or down
 *
 * returns true if elements have been moved
 *
 */
function moveSelect(selectElement, up) {
    if (selectElement && selectElement.selectedIndex != -1 && selectElement.options.length > 0) {
        /* copy options */
        var oldOptions = new Array(selectElement.options.length);
        for (var i = 0; i < selectElement.options.length; i++) {
            var option = selectElement.options[i];
            var newOption = new Option(option.text, option.value, option.defaultSelected, option.selected);
            newOption.title = option.title;
            oldOptions[i] = newOption;
        }
        /* clear target select */
        selectElement.options.length = 0;
        if (up) {
            /* move up */
            var move = false;
            var prevIndex = -1;
            for (var i = 0; i < oldOptions.length; i++) {
                var option = oldOptions[i];
                var beforeIndex = i;
                if (option.selected) {
                    if (move || i - 1 != prevIndex) {
                        move = true;
                        beforeIndex = i - 1;
                    } else {
                        prevIndex = i;
                    }
                }
                insertOption(selectElement, option, beforeIndex);
            }
        } else {
            /* move down */
            var move = false;
            var prevIndex = oldOptions.length;
            for (var i = oldOptions.length - 1; i >= 0; i--) {
                var option = oldOptions[i];
                var beforeIndex = 0;
                if (option.selected) {
                    if (move || i + 1 != prevIndex) {
                        move = true;
                        beforeIndex = 1;
                    } else {
                        prevIndex = i;
                    }
                }
                insertOption(selectElement, option, beforeIndex);
            }
        }
        return true;
    }
    return false;
}

