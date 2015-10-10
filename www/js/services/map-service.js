angular.module('stuffmobile')
.factory('Map', function($cordovaGeolocation, Posts){
 
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

      var latLng = new google.maps.LatLng(47, -122);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        //Load the markers
        loadMarkers();
    });
 
  }
 
  function loadMarkers(){
      var NeSwBounds = getLatLon(map); 
      //Get all of the markers from our Markers factory
      Posts.getPosts(NeSwBounds).then(function(posts){
 
        console.log("posts: ", posts);
 
 
        for (var i = 0; i < posts.length; i++) {
 
          var post = posts[i];   
          var markerPos = new google.maps.LatLng(post.latitude, post.longitude);
 
          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });
 
          addInfoWindow(marker, post);
 
        }
 
      }); 
 
  }

  function getLatLon(map) {
    var center = map.getCenter();
    var box = map.getBounds(center, 30);
    console.log('box ', box);
    var params = {
        nwLng: box.Ma.j - .5,
        seLng: box.Ma.J + .5,
        nwLat: box.Qa.j + .5,
        seLat: box.Qa.J - .5
      }
    return params;
  }
 
  function addInfoWindow(marker, post) {
 
      var infoWindow = Posts.getInfoWindow(post);
 
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