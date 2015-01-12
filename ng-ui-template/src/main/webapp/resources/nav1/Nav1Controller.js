'use strict';
angular.module('App').controller('Nav1Ctrl', ['GridService',
                                                    function(GridService) {
	this.data = "Hello World";
	
    this.myData = [{ name: "aMoroni", age: 50, birthday: "Oct 28, 1970", obj: {salary: "60000"}},
                    { name: "Tiaancum", age: 43, birthday: "Feb 12, 1985",  obj: {salary: "70000"} },
                    { name: "Jacaob", age: 27, birthday: "Aug 23, 1983",  obj: {salary: "50000"} },
                    { name: "Nephai", age: 29, birthday: "May 31, 2010",  obj: {salary: "40000"} },
                    { name: "Enoss", age: 34, birthday: "Aug 3, 2008",  obj: {salary: "30000"} },
                    { name: "zzMordoni", age: 50, birthday: "Oct 28, 1970",  obj: {salary: "60000"} },
                    { name: "Tiadncum", age: 43, birthday: "Feb 12, 1985",  obj: {salary: "70000"} },
                    { name: "Jacgob", age: 27, birthday: "Aug 23, 1983",  obj: {salary: "40000"} },
                    { name: "Nephi", age: 29, birthday: "May 31, 2010",  obj: {salary: "50000"} },
                    { name: "Enos", age: 34, birthday: "Aug 3, 2008",  obj: {salary: "30000"} },
                    { name: "Moroni", age: 50, birthday: "Oct 28, 1970",  obj: {salary: "60000"} },
                    { name: "Tiancum", age: 43, birthday: "Feb 12, 1985",  obj: {salary: "70000"} },
                    { name: "Jacob", age: 27, birthday: "Aug 23, 1983",  obj: {salary: "40000"} },
                    { name: "Nephi", age: 29, birthday: "May 31, 2010",  obj: {salary: "50000"} },
                    { name: "bEnos", age: 34, birthday: "Aug 3, 2008",  obj: {salary: "30000"} }];
}]);