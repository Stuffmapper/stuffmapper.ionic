angular.module('stuffmobile')
.factory('Map', ['$cordovaGeolocation', '$q', 'PostsService', function($cordovaGeolocation, $q, PostsService){

  //need two maps because in different states
  //therefore need two mapInits :(
 
  var apiKey = false;
  var getMap = null, giveMap = null;
 
  function getMapInit(){
    var deferred = $q.defer(); 
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      getMap = new google.maps.Map(document.getElementById("getMap"), mapOptions);
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(getMap, 'idle', function(){
        deferred.resolve(getMap); 
      });
 
    }, function(error){
      console.log("Could not get location");

      var latLng = new google.maps.LatLng(47, -122);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      getMap = new google.maps.Map(document.getElementById("getMap"), mapOptions);
      deferred.resolve(getMap); 
    });
    return deferred.promise; 
  }
 
  function giveMapInit(){
    var deferred = $q.defer(); 
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      giveMap = new google.maps.Map(document.getElementById("giveMap"), mapOptions);
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(giveMap, 'idle', function(){
        deferred.resolve(giveMap);
      });
 
    }, function(error){
      console.log("Could not get location");

      var latLng = new google.maps.LatLng(47, -122);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      giveMap = new google.maps.Map(document.getElementById("giveMap"), mapOptions);
        deferred.resolve(giveMap); 
    });
    return deferred.promise; 
  }

  function loadMarkers(map){
      var NeSwBounds = getLatLon(map); 
      //Get all of the markers from our Markers factory
      PostsService.getPosts(NeSwBounds).then(function(posts){
 
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
 
          addInfoWindow(marker, post, map);
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
 
  function addInfoWindow(marker, post, map) {
 
      var infoWindow = PostsService.getInfoWindow(post);
 
      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });
 
  }
//the give and get parameters keep the two maps strait 
  return {
    getInit: function(){
      if (getMap == null){
        console.log('init get map')
        getMapInit().then(function(map){
          loadMarkers(map);
        });
      }
    },
    giveInit: function(){
      if (giveMap == null){
        console.log('init give map')
        giveMapInit();
      }
    }
  }
 
}])