app.directive('ctgGrid', function() {
	return {
		restrict: 'E',
		scope: {
	    	//required
	    	gridData: '=',
	    	gridType: '=',
	    	//not required
	    	gridOptions: '=?',
	    	pagingOptions: '=?',
	    	sortInfo: '=?'
		},
		template: 
		    '<div class="container-fluid no-padding ng-hide" ng-show="true">'+
		    	'<div class="input-group input-group-sm col-sm-offset-7 col-md-offset-8 col-md-4 col-lg-offset-9 col-lg-3"'+
		    		'ng-class="{\'has-success\': gridOptions.filterOptions.filterText.length > 0'+
		    					'&& filteredCount > 0, \'has-error\': filteredCount == 0 && totalItemCount > 0}">'+
		    		
			    	'<span class="glyphicon glyphicon-search input-group-addon"></span>'+
			    	'<input type="text" class="form-control"'+ 
			    		'ng-model="gridOptions.filterOptions.filterText" placeholder="Search...">'+
		    		'<span class="input-group-addon">{{filteredCount | number:0}}/{{totalItemCount | number:0}}</span>'+
		    	'</div>'+
		    '</div>'+
		    '<div class="grid-style" ng-grid="gridOptions"></div>',
		 controller: ['$scope', 'GridService', '$filter',
                 function($scope, GridService, $filter) {
    	
			$scope.totalItemCount = 0;
	    	$scope.filteredCount = 0;
	    	
	    	$scope.filterOptions = {filterText: "",
    	        	useExternalFilter: false};
	    	
	    	//allow for custom paging options to be passed in.
	    	if (angular.isUndefined($scope.pagingOptions)) {
	    		$scope.pagingOptions = GridService.pagingOptions();
	    	}
		    
		    $scope.setPageData = function (data, page, pageSize) {	
		    	if (data) {
		    		var pageData = data.slice((page - 1) * pageSize, page * pageSize);
			        $scope.currentPageData = pageData;
			        $scope.filteredCount = data.length;
			        $scope.totalItemCount = $scope.gridData.length;
			        if (!$scope.$$phase) {
			            $scope.$apply();
			        }
		    	}
		    };
	    	    
		    $scope.fillGrid = function (page, pageSize, searchText) {
		    	setTimeout(function () {
			    	var data;
			    	
			        if (searchText) {
		                data = $scope.gridData.filter($scope.filterData);
		                $scope.sortData(data);
		                $scope.setPageData(data, page, pageSize);
			        } 
			        else {
			        	$scope.sortData($scope.gridData);
		                $scope.setPageData($scope.gridData, page, pageSize);
			        }
			    }, 100);
			};
	    		
			$scope.filterData = function (item) {
				var ft = $scope.gridOptions.filterOptions.filterText.toLowerCase();
				return $scope.searchObjectsForText(item, ft);
	        };
	        
	        $scope.searchObjectsForText = function (item, ft) {
	        	for (var prop in item) {
	        		if (typeof item[prop] == "object") {
						if ($scope.searchObjectsForText(item[prop], ft)) {
							return true;
						}
					}
					else {
						if (item[prop]) {
							if (item[prop].toString().toLowerCase().indexOf(ft.toLowerCase()) > -1) {
								return true;
							}
						}
					}
	        	}
	        	return false;
	        };
	    		
	    	// Watch for page and page size changes, re-fill the grid using the new options when they change
		    $scope.$watch(
		        function () {
		            return {
		                currentPage: $scope.pagingOptions.currentPage,
		                pageSize: $scope.pagingOptions.pageSize
		            };
		        },
		        function (newVal, oldVal) {
		            // Reset to page 1 when the page size changes
		            if (newVal.pageSize !== oldVal.pageSize) {
		                $scope.pagingOptions.currentPage = 1;
		            }
	
		            $scope.fillGrid($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize, 
		            		$scope.gridOptions.filterOptions.filterText);
		        },
		    true);
	    	
		    //listen for the Filter Event on the grid
		    $scope.$on('ngGridEventFilter', function (event) {
		    	$scope.fillGrid($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize, 
		    			$scope.gridOptions.filterOptions.filterText);
		    });
		    
		    //http://stackoverflow.com/questions/18585346/angularjs-ng-grid-with-paging-sorting-the-whole-data
		    if (angular.isUndefined($scope.sortInfo)) {
	    		$scope.sortInfo = GridService.sortInfo();
	    	}
		    
		 // sort over all data
		    $scope.sortData = function (data) {
		    	var field = $scope.sortInfo.fields[0];
		    	var direction = $scope.sortInfo.directions[0];
		    	if(field == undefined || field == ""){return;} //dont remove the default sorts form service
		    	if (data) {
		    		data.sort(function (a, b) {
		    			var fieldA = $scope.findField(a, field);
		    			var fieldB = $scope.findField(b, field);
		    			if (typeof fieldA === "string") {//if it is a string compare lowercase
		    				fieldA = fieldA.toLowerCase();
		    			}
		    			if (typeof fieldB === "string") {//if it is a string compare lowercase
		    				fieldB = fieldB.toLowerCase();
		    			}
		    			if (direction == "asc") {
		    				return fieldA > fieldB ? 1 : -1;
		    			} 
		    			else {
		    				return fieldA > fieldB ? -1 : 1;
		    			}
		    		});
		    	}
		    };
		    
		    $scope.findField = function (obj, prop) {
				var list = (prop.split("."));
				var tempObj = obj;
				
				for (var x = 0; x < list.length; x++) {
					if (tempObj == undefined){
						return "";
					}
					tempObj = tempObj[list[x]];
				}
				
				return tempObj;
		    };
		    
		    // sort over all data, not only the data on current page
		    $scope.$watch('sortInfo', function (newVal, oldVal) {
		    	$scope.pagingOptions.currentPage = 1;
		    	$scope.fillGrid($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize, 
		    			$scope.gridOptions.filterOptions.filterText);
		    }, true);
		    
		    $scope.$watch('gridData', function () {
		    	$scope.pagingOptions.currentPage = 1;
		    	$scope.fillGrid($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize, 
		    			$scope.gridOptions.filterOptions.filterText);
		    });
		    
	        $scope.initGrid = function (){
	        	//allow for custom grid options to be passed in
	        	if (angular.isUndefined($scope.gridOptions)) {
	        		$scope.gridOptions = GridService.gridOptions();
	        	}
	        	$scope.gridOptions.data = 'currentPageData';
	        	$scope.gridOptions.columnDefs = GridService[$scope.gridType]();
	        	$scope.gridOptions.showFilter = false;
	        	$scope.gridOptions.enablePaging = true;
	        	$scope.gridOptions.totalServerItems = 'totalItemCount';
	        	$scope.gridOptions.pagingOptions = $scope.pagingOptions;
	        	$scope.gridOptions.useExternalSorting = true;
	        	$scope.gridOptions.sortInfo = $scope.sortInfo;
	        	$scope.gridOptions.filterOptions = $scope.filterOptions;
	        	$scope.gridOptions.showCounts = false;
	        };
	        
	        $scope.initGrid();
		}]
	};
});