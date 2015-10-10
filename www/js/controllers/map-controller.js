angular.module('stuffmobile')
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  console.log('logging from map user: ', $scope.user)
});