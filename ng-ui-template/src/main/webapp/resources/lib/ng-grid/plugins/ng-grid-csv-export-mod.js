// Todo:
// 1) Make the button prettier
// 2) add a config option for IE users which takes a URL.  That URL should accept a POST request with a
//    JSON encoded object in the payload and return a CSV.  This is necessary because IE doesn't let you
//    download from a data-uri link
//    http://plnkr.co/edit/keci2Y?p=preview
// Notes:  This has not been adequately tested and is very much a proof of concept at this point
function ngGridCsvExportPlugin (opts) {
    'use strict';

    var self = this;
    self.grid = null;
    self.scope = null;
    self.services = null;

    self.init = function(scope, grid, services) {
        self.grid = grid;
        self.scope = scope;
        self.services = services;

        function showDs() {
            // CUSTOMIZATION: Only display columns that are visible (ie not hidden via the showColumnMenu dropdown)
            // and also only display columns that have a non-blank displayName, because we use a blank display name
            // for things like delete buttons, which we don't want to export
            // BEFORE:
            // var keys = [];
            // for (var f in grid.config.columnDefs) {
            //     if (grid.config.columnDefs.hasOwnProperty(f))
            //     {
            //         keys.push(grid.config.columnDefs[f].field);
            //      }
            // }
            // AFTER:
            var keys = [];
            var displayNames = [];

            angular.forEach(self.scope.columns, function (col) {
                if (col.visible && col.displayName !== '' && col.field != undefined) {
                    displayNames.push(col.displayName);
                    keys.push(col.field);
                }
            });
            // END CUSTOMIZATION

            var csvData = '';
            function csvStringify(str) {
                //noinspection JSLint
                if (str == null) { // we want to catch anything null-ish, hence just == not ===
                    return '';
                }
                if (typeof str === 'number') {
                    return str.toString();
                }
                if (typeof str === 'boolean') {
                    return (str ? 'TRUE' : 'FALSE') ;
                }
                if (typeof str === 'string') {
                    return str.replace(/"/g,'""');
                }

                return JSON.stringify(str).replace(/"/g,'""');
            }

            function swapLastCommaForNewline(str) {
                var newStr = str.substr(0,str.length - 1);
                return newStr + "\n";
            }

            // CUSTOMIZATION: output the displayName for each headers instead of the field
            // BEFORE: 
            // for (var k in keys) {
            //     csvData += '"' + csvStringify(keys[k]) + '",';
            // }
            // AFTER:
            for (var k in displayNames) {
                csvData += '"' + csvStringify(displayNames[k]) + '",';  
            }
            // END CUSTOMIZATION
            
            csvData = swapLastCommaForNewline(csvData);

            // CUSTOMIZATION: Export filtered rows only, rather than all
            // BEFORE:
            // var gridData = grid.data;
            // for (var gridRow in gridData) {
            // 	for ( k in keys) {
            // 		var curCellRaw;
            // 		if (opts != null && opts.columnOverrides != null && opts.columnOverrides[keys[k]] != null) {
            // 			curCellRaw = opts.columnOverrides[keys[k]](self.services.UtilityService.evalProperty(gridData[gridRow], keys[k]));
            // 		} else {
            // 			curCellRaw = self.services.UtilityService.evalProperty(gridData[gridRow], keys[k]);
            // 		}
            // 		csvData += '"' + csvStringify(curCellRaw) + '",';
            // 	}
            // 	csvData = swapLastCommaForNewline(csvData);
            // }
            // AFTER: (lines 123, 129 & 131 are the only changes)
            var gridData = self.grid.filteredRows;
            for (var gridRow in gridData) {
                for (k in keys) {
                        var curCellRaw;

                        if (opts != null && opts.columnOverrides != null && opts.columnOverrides[keys[k]] != null) {
                            curCellRaw = opts.columnOverrides[keys[k]](self.services.UtilityService.evalProperty(gridData[gridRow].entity, keys[k]));
                        } else {
                            curCellRaw = self.services.UtilityService.evalProperty(gridData[gridRow].entity, keys[k]);
                        }

                        csvData += '"' + csvStringify(curCellRaw) + '",';
                }
                csvData = swapLastCommaForNewline(csvData);
            }
            // END CUSTOMIZATION

            var fp = self.grid.$root.find(".ngFooterPanel");
            var csvDataLinkPrevious = self.grid.$root.find('.ngFooterPanel .csv-data-link-span');
            if (csvDataLinkPrevious != null) {csvDataLinkPrevious.remove() ; }
            //            var csvDataLinkHtml = "<span class=\"csv-data-link-span\">";
            //            csvDataLinkHtml += "<br><a href=\"data:text/csv;charset=UTF-8,";
            //            csvDataLinkHtml += encodeURIComponent(csvData);
            //            csvDataLinkHtml += "\" download=\"Export.csv\">CSV Export</a></br></span>" ;

            var csvDataLinkHtml = "<a class=\"csv-data-link-span btn btn-sm btn-primary\" href=\"data:text/csv;charset=UTF-8,";
            csvDataLinkHtml += encodeURIComponent(csvData);
            csvDataLinkHtml += "\" download=\"Export.csv\" style='margin-top:5px; margin-right:5px;'>Export to CSV</a>";
            
            fp.append(csvDataLinkHtml);
        }

        setTimeout(showDs, 0);

        scope.catHashKeys = function() {
            var hash = '';
            for (var idx in self.grid.filteredRows) {
                hash += self.grid.filteredRows[idx].$$hashKey;
            }
            //            for (var idx in grid.columns) {
            //                if (grid.columns[idx].visible) {
            //                    hash += grid.columns[idx].$$hashKey;
            //                }
            //            }
            return hash;
        };

        if (opts && opts.customDataWatcher) {
            scope.$watch(opts.customDataWatcher, showDs);
        } else {
            scope.$watch(scope.catHashKeys, showDs);
        }

        // CUSTOMIZATION: only export filtered rows and visible columns.
        // to do this, we need to react when the filter changes or the visible columns change
        // NEW:
        scope.$parent.$on('ngGridEventFilter', showDs);
        scope.$parent.$on('ngGridEventColumns', showDs);
        // END CUSTOMIZATION
    };
}