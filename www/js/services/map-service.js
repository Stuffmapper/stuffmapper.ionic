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
 
        var records = markers.data.result;
 
        for (var i = 0; i < records.length; i++) {
 
          var record = records[i];   
          var markerPos = new google.maps.LatLng(record.lat, record.lng);
 
          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });
 
          var infoWindowContent = "<h4>" + record.name + "</h4>";          
 
          addInfoWindow(marker, infoWindowContent, record);
 
        }
 
      }); 
 
  }

  function getLatLon(map) {
    var bounds = map.getBounds();
    console.log('get bounds response ', bounds);
    console.log('seLon ', bounds.Qa.J);
    console.log('seLat ', bounds.Ma.J);
    console.log('nwLat ', bounds.Qa.j);
    console.log('nwLat ', bounds.Ma.j);
    return {
      seLng: bounds.Qa.J,
      seLat: bounds.Ma.J,
      nwLng: bounds.Qa.j,
      nwLat: bounds.Ma.j
    }
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