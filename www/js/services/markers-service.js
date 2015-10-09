angular.module('stuffmobile')
.factory('Markers', function($http, ApiEndpoint) {
 
  var markers = [];
 
  return {
    getMarkers: function(box){

      var url =  ApiEndpoint.url + "/posts/geolocated";
      return $http({
        url: url,
        params: box
      }).success(function(response){
        console.log('response from get markers ', response);
          markers = response;
          return markers;
      }).error(function(err) {
        console.log('err ', err);
      });
 
    }
  }
})