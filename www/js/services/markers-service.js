angular.module('stuffmobile')
.factory('Markers', function($http, ApiEndpoint) {
 
  var markers = [];
 
  return {
    getMarkers: function(box){
      var url =  ApiEndpoint.url + "/posts/geolocated";
      return $http({
        url: url,
        params: box
      }).then(function(response, err){
        if (err) {
          console.log('error ', err);
          return err;
        }
          markers = response.data.posts;
          return markers;
      });
 
    }
  }
})