var app = angular.module('GridServices', ['ngResource']);
app.factory('GridService', ['$templateCache',
                           function ($templateCache) {	
	var cache = { 
		grids:[]
	};
	
	var service = {
		maxHeight:function () {
			return 700;
		},
	
		minHeight:function () {
			return 150;
		},
	
		headerHeight:function () {
			return 55;
		},
		
		csvOpts:function () {
			return {
				columnOverrides: { //https://groups.google.com/forum/#!topic/angular/CJd36aS84dI
					object:function (obj, prop) {
						var list = (prop.split("."));
						var tempObj = obj;
						
						for (var x = 0; x < list.length; x++) {
							if (tempObj == undefined){
								return "";
							}
							tempObj = tempObj[list[x]];
						}
						
						return tempObj;
				    }
				}
			};
		},
		
    	pagingOptions:function () {
    		return new Object({
		        pageSizes: [5, 10, 15],
		        pageSize: 5,
		        currentPage: 1
    		});
    	},
    	
    	sortInfo:function () {
    		return new Object({
    			fields: [''], 
    			directions: ['']
    		});
    	},
		
    	gridOptions:function () {
			return new Object ({ multiSelect:false, enableColumnReordering:true, enablePinning:true, 
				showGroupPanel: true, showFooter: true, enableColumnResize:true, showColumnMenu: true, 
				headerRowHeight: service.headerHeight(), maintainColumnRatios:true, showFilter:true,
				plugins: [new ngGridCsvExportPlugin(service.csvOpts()), 
				          new ngGridFlexibleHeightPlugin({minHeight: service.minHeight(), 
				        	  							  maxHeight: service.maxHeight()})
						 ]
			});
		},
		
		getTemplate:function (url) { //caches grid template files.
			var view = $templateCache.get(url);
			
			if (!view) {
				var result =  $.ajax({
					type: "GET",
			        url: url,
			        async: false
				}).responseText;
			    $templateCache.put(url, result);
			    view = result;
			}
			return view;
		},
				
		grid1:function () {
			return [{field:'name', displayName:'Cell header word wrap yo', 
						headerCellTemplate:service.getTemplate('resources/shared/cellTemplate/columnHeader.html'), 
						cellTemplate:service.getTemplate('resources/shared/cellTemplate/cell.html')},
					{field:'age', displayName:'Age', 
						headerCellTemplate:service.getTemplate('resources/shared/cellTemplate/columnHeader.html'), 
						cellTemplate:service.getTemplate('resources/shared/cellTemplate/cell.html')},
					{field:'birthday', displayName:'Birthday', 
						headerCellTemplate:service.getTemplate('resources/shared/cellTemplate/columnHeader.html'), 
						cellTemplate:service.getTemplate('resources/shared/cellTemplate/cell.html')},
					{field:'obj.salary', displayName:'Salary', 
						headerCellTemplate:service.getTemplate('resources/shared/cellTemplate/columnHeader.html'), 
						cellTemplate:service.getTemplate('resources/shared/cellTemplate/cellCurrency.html')}
				   	];
		}
	};
	return service;
}]);