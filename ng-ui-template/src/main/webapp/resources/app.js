'use strict';

var App = {};

var App = angular.module ('App', ['ui.bootstrap', 'ui.router', 'ngGrid', 'ngRoute', 'ngCookies', 
                                  'chieffancypants.loadingBar', 'duScroll', 'ngAnimate', 'toaster',
                                  'GridServices', 'Services']);

// Declare app level module which depends on filters, and services
App.config (['$stateProvider', '$urlRouterProvider', 
             function ($stateProvider, $urlRouterProvider) {
    //default
    $urlRouterProvider.otherwise ("/login");

    $stateProvider
    	.state ('login', {
    		url: '/login',
    		views: {
    			"master": {
    				templateUrl: 'resources/logIn/logIn.html'
    			}
    		}
    	})
    	.state ('dashboard', {
    		url: '/',
    		views: {
    			"master": {
    				templateUrl: 'resources/dashboard/dashboard.html'
    			},
    			"content@dashboard": {
					templateUrl: 'resources/home/home.html'
				},
				"navbar@dashboard": {
					templateUrl: 'resources/navigation/navigation.html'
				}
    		}
    	})
    	.state ('dashboard.home', {
    		url: "home",
    		views: {
    			"content@dashboard": {
					templateUrl: 'resources/home/home.html'
				}
    		}
    	})
    	.state ('dashboard.nav1', {
    		url: "nav1",
    		views: {
    			"content@dashboard": {
    				templateUrl: "resources/nav1/nav1.html",
				}
    		}
    	})
    	.state ('dashboard.nav2', {
    		url: "nav2",
    		views: {
    			"content@dashboard": {
    				templateUrl: "resources/nav2/nav2.html",
				}
    		}
    	});
    

}]).run (function ($rootScope, $state) {
	$rootScope.protocol = 'http';
	$rootScope.host = window.location.host;
	$rootScope.service = 'myServiceName';
	$rootScope.serviceURL = $rootScope.protocol+'://'+$rootScope.host+'/'+$rootScope.serviceName+'/';
	
	$rootScope.encode_utf8 = function (string) {
		return unescape(encodeURIComponent(string));
	};
	
    $rootScope.gridFix = function () {
        window.setTimeout (function () {
            $(window).resize();
            $(window).resize();
        }, 500);
    };
    
    $rootScope.collapseNavigation = function(){//when in mobile view collapse hamburger
		$('#myNav').collapse('hide');
	};
    
    $rootScope.isActive = function (viewLocation) { 
        return $state.is(viewLocation);
    };
});