angular.module('jsonToCSV')
  .controller('ParseController', ['$rootScope', '$scope', 'PapaParse', 'FileDownloadService' ,
  function($rootScope, $scope, PapaParse, FileDownloadService) {
    $rootScope.OBJECT_ROOT_ELEMENT = "<Root>";
    
    $scope.jsonFileLoaded = function() {
      var obj = JSON.parse($scope.file.data);
      var fieldCollector = obj instanceof Array ? [$rootScope.OBJECT_ROOT_ELEMENT] : [];
      fieldCollector = fieldCollector.concat(processObject(obj));
      console.log("Fields:" + fieldCollector.join(','));
    };
    
    $scope.processFile = function() {
      $scope.$apply(function() {
        var fileControl = document.getElementById("jsonFileInput");
        $scope.file.name = fileControl.files[0].name;
        var data = PapaParse.parse($scope.file.data);
        $scope.csv = data;
      });
    };
    
    
    $scope.handleError = function($error) {
      alert('$error');
    };
    $scope.downloadFile = function(data) {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style="display: none";
      result = FileDownloadService.writeFile(data);
      a.href = result;
      a.download = $scope.file.name + ".csv";
      a.click();
    };
    
    function processObject(obj){
      var fieldCollector = [];
      for(var fieldName in obj){
        var field = obj[fieldName];
        if(field instanceof Array){
          fieldCollector.push(fieldName);
        }
        if(typeof field === 'object' && field !== null && field !== undefined){
          fieldCollector = fieldCollector.concat(processObject(field));
        }
      }
      return fieldCollector;
    }
  }
]).directive('fileSelect', ['$window', 
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