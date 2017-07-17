
angular.module('jsonToCSV').config(['$provide',
function($provide){
  $provide.factory('FileDownloadService',
  function()
  {
    var writeOutFile = function(text) {
      var fileHref = null;
      var data = new Blob([text], {type: 'text/csv'});
      if(fileHref !== null){
        URL.revokeObjectURL(fileHref);
      }
      fileHref = URL.createObjectURL(data);
      return fileHref;
    };
    return {
      writeFile : function writeFile(text) {
        return writeOutFile(text);
      }
    };
  });
}]);