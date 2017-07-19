/* global angular */
angular.module('jsonToCSV').config(['$provide',
function($provide){
  $provide.factory('PapaParse', function() {
      var config =
      {
          quotes: true,
          quoteChar: '"',
          delimiter: ",",
          header: true,
          newline: "\r\n"
      };
      var parseJson = function(jsonFile) {
        if(jsonFile)
        {
          /* global Papa */
          return Papa.unparse(jsonFile, config);
        }
      };
      return {
        parse: function parse(jsonFile) {
          return parseJson(jsonFile);
        }
      };
    });
}]);