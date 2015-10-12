angular.module('stuffmobile')
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, Map) {
  console.log('map ctrl')
  Map.getInit();
});