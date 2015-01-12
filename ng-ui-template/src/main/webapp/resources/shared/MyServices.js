var app = angular.module('Services', ['ngResource']);

app.factory('MyService', ['$http', '$rootScope', 'toaster',
                           function($http, $rootScope, toaster) {	
	var myService = {
		find:function (id, callback) {
			$http({method: 'GET', url: $rootScope.serviceURL+'find/'+id}).
			
			success(function(data, status, headers, config){
				callback(data);
			}).
			error(function(data, status, headers, config){
				callback();
				//some error message
				toaster.pop('error', 'Status', status + ' - ' + data);
			});
		}
	};
	return myService;
}]);