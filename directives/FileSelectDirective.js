/* global angular */
angular.module('jsonToCSV')
.directive('fileSelect', ['$window', 
  function($window) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attr, ctrl) {
        var fileReader = new $window.FileReader();
        fileReader.onload = function () {
          ctrl.$setViewValue(fileReader.result);
          if('fileLoaded' in attr) {
            scope.$eval(attr['fileLoaded']);
          }
        };
        
        fileReader.onprogress = function (event) {
          if('fileProgress' in attr) {
            scope.$eval(attr['fileProgress'],
            {'$total': event.total, '$loaded': event.loaded });
          }
        };
        
        fileReader.onerror = function () {
          if('fileError' in attr){
            scope.$eval(attr['fileProgress'], 
            {'$error' : fileReader.error });
          }
        };
        
        var fileType = attr['fileSelect'];
        
        elm.bind('change', function (e) {
          var fileName = e.target.files[0];
          
          if(fileType === '' || fileType === 'text'){
            fileReader.readAsText(fileName);
          } else if (fileType === 'data') {
            fileReader.readAsDataURL(fileName);
          }
        });
      }
    };
  }
]);