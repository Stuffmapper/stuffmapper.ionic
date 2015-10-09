angular.module('stuffmobile')
.factory('Markers', function($http, ApiEndpoint) {
 
  var markers = [];
 
  return {
    getMarkers: function(boundObj){

      var url =  ApiEndpoint.url + "/posts/geolocated";
      console.log('post url ', url);
      return $http.get({url: url,
                        params: {
                          nwLat: boundObj.nwLat,
                          seLat: boundObj.seLat,
                          nwLng: boundObj.nwLng,
                          seLng: boundObj.seLng
                        }
          }).then(function(response){
          markers = response;
          return markers;
      }, function (err) {
        console.log('err ', err);
      });
 
    }
  }
})