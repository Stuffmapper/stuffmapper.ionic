angular.module('stuffmobile')
.factory('Map', function($cordovaGeolocation, Markers){
 
  var apiKey = false;
  var map = null;
 
  function mapInit(){
 
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
 
        //Load the markers
        loadMarkers();
 
      });
 
    }, function(error){
      console.log("Could not get location");
 
        //Load the markers
        loadMarkers();
    });
 
  }
 
  function loadMarkers(){
      var NeSwBounds = getLatLon(map); 
      //Get all of the markers from our Markers factory
      Markers.getMarkers(NeSwBounds).then(function(markers){
 
        console.log("Markers: ", markers);
 
 
        for (var i = 0; i < markers.length; i++) {
 
          var marker = markers[i];   
          var markerPos = new google.maps.LatLng(marker.latitude, marker.longitude);
 
          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });
 
          var infoWindowContent;          
 
          addInfoWindow(marker, infoWindowContent, marker);
 
        }
 
      }); 
 
  }

  function getLatLon(map) {
    var center = map.getCenter();
    var box = map.getBounds(center, 30);
    console.log('box ', box);
    var params = {
        nwLng: box.Ma.j - 1,
        seLng: box.Ma.J + 1,
        nwLat: box.Qa.j + 1,
        seLat: box.Qa.J -1
      }
    return params;
  }
 
  function addInfoWindow(marker, message, record) {
 
      var infoWindow = new google.maps.InfoWindow({
          content: message
      });
 
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
 
  }
 
  return {
    init: function(){
      mapInit();
    }
  }
 
})