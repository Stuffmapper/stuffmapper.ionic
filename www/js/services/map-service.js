angular.module('stuffmobile')
.factory('Map', ['$cordovaGeolocation', '$q', '$timeout', 'PostsService', 'UserService', function($cordovaGeolocation, $q, $timeout, PostsService, UserService){
  var Map = this;
  //need two maps because in different states
 
  var apiKey = false;
  var getMap = null;
  var giveMap = null;
  // var centerMarkers = []; // use if center marker css stops working
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
      var mapEl = document.getElementById("getMap")
      getMap = new google.maps.Map(mapEl, mapOptions);


      //Wait until the map is loaded
      google.maps.event.addListenerOnce(getMap, 'idle', function(){
        getMap.addListener('dragend', function(){
          // getMap.getCenter();
          loadMarkers(getMap);
          console.log('dragend');
        })
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
      getMap.addListener('draggend', function(){
        // getMap.getCenter();
        loadMarkers(getMap);
      })
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
        // //Use if css centering of marker stops working

        // var marker = new google.maps.Marker({
        //   position: giveMap.getCenter(), 
        //   map: giveMap, 
        //   icon: "img/pin.svg"
        // })
        // centerMarkers.push(marker);
        // giveMap.addListener('center_changed', function() {
        // if (centerMarkers.length > 0) {
        //   centerMarkers[centerMarkers.length - 1].setMap(null);
        // }
        //   var marker = new google.maps.Marker({
        //     position: giveMap.getCenter(),
        //     map: giveMap,
        //     icon: "img/pin.svg"
        //   })
        //   centerMarkers.push(marker);
        // })
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
        var icon = 'img/darkblue-pin.svg';
        console.log('post.creator', post.creator, 'currentUser', UserService.getCurrentUser())
        if(post.creator === UserService.getCurrentUser()){
          icon = 'img/salmon-pin.svg';
        }
        var marker = new google.maps.Marker({
            map: map,
            position: markerPos,
            icon: icon
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

  function setUndraggable() {
    giveMap.setOptions({draggable: false});
  }

  function setDraggable() {
    giveMap.setOptions({draggable: true});
  }

  function getCenter(){
    return giveMap.getCenter();
  }
  function resizeMap() {
    $timeout(function() {
      google.maps.event.trigger(getMap, 'resize');
    }, 50)
  }
//the give and get keep the two maps strait 
  return {
    getInit: function(){
      var deffered = $q.defer();
      // if (getMap == null){
        console.log('init get map')
        deffered.resolve(getMapInit());
      // } else {
      //   deffered.resolve(getMap);
      // }
      return deffered.promise;
    },
    loadMarkers: loadMarkers,
    giveInit: function(){
      // if (giveMap == null){
        console.log('init give map')
        giveMapInit();
      // }
    },
    panToLocation: panToLocation,
    getCenter: getCenter,
    resizeMap: resizeMap,
    getMap: getMap,
    giveMap: giveMap,
    setDraggable: setDraggable,
    setUndraggable: setUndraggable
  }
 
}])