/* global angular */
angular.module('jsonToCSV')
  .controller('ParseController', ['$rootScope', '$scope', 'PapaParse', 'FileDownloadService' ,
  function($rootScope, $scope, PapaParse, FileDownloadService) {
    $rootScope.OBJECT_ROOT_ELEMENT = "<Root>";
    
    $scope.jsonFileLoaded = function() {
      var obj = JSON.parse($scope.file.data);
      //var fieldCollector = obj instanceof Array ? [$rootScope.OBJECT_ROOT_ELEMENT] : [];
      // fieldCollector = fieldCollector.concat(processObject(obj));
      //TODO: Deduplicate into a tree structure or with subscripts.
      //console.log("Fields:" + fieldCollector.join(','));
      //$scope.$apply($scope.file.roots = fieldCollector);
      if(obj instanceof Array)
      {
        $scope.processFile();
      }
      else
      {
        alert("Root of document must be an array.");
        $scope.$apply(function(){
            $scope.csv = null;
            /* global jsonFileForm */
            jsonFileForm.reset();
        }
        );
      }
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
      var result = FileDownloadService.writeFile(data);
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
]);