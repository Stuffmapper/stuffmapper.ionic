angular.module('stuffmobile')
.factory('Map', ['$cordovaGeolocation', '$q', 'PostsService', function($cordovaGeolocation, $q, PostsService){

  //need two maps because in different states
  //therefore need two mapInits :(
 
  var apiKey = false;
  var getMap = null, giveMap = null;
  var options = {timeout: 10000, enableHighAccuracy: true};
  function getMapInit(){
    var deferred = $q.defer(); 
    
 
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
        google.maps.event.trigger(getMap, 'resize');
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
    var deffered = $q.defer();
    var NeSwBounds = getLatLon(map); 
    //Get all of the markers from our Markers factory
    PostsService.getPosts(NeSwBounds).then(function(posts){



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
      deffered.resolve(posts)
    }); 
    return deffered.promise;
  }

  function getLatLon(map) {
    var center = map.getCenter();

    var box = map.getBounds(center, 30);
    var ne = box.getNorthEast();
    var sw = box.getSouthWest();
    var params = {
        nwLng: sw.lng() - .5,
        seLng: ne.lng() + .5,
        nwLat: ne.lat() + .5,
        seLat: sw.lat() - .5
      }
    return params;
  }
 
  function addInfoWindow(marker, post, map) {
 
      var infoWindow = PostsService.getInfoWindow(post);
 
      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });
 
  }

  function panToLocation(){
    console.log('panning home....')
    var latLng;
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      giveMap.panTo(latLng);
    }, function(error) {
      return error;
    })
  }

  function getCenter(){
    return giveMap.getCenter();
  }
  function resizeMap() {
      google.maps.event.trigger(getMap, 'resize');
  }
//the give and get keep the two maps strait 
  return {
    getInit: getMapInit,
    loadMarkers: loadMarkers,
    giveInit: function(){
      if (giveMap == null){
        console.log('init give map')
        giveMapInit();
      }
    },
    panToLocation: panToLocation,
    getCenter: getCenter,
    resizeMap: resizeMap 
  }
 
}])