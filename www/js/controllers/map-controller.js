angular.module('stuffmobile')
.controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', 'Map', 'PostsService', function($scope, $state, $cordovaGeolocation, Map, PostsService) {

  if($scope.getMap) {
    Map.loadMarkers($scope.getMap).then(function(posts) {
      $scope.posts = posts;
    });
  }
  console.log('get ctrl')
  $scope.getMap = false;
  Map.getInit().then(function(map) {
    Map.loadMarkers(map).then(function(posts){
      $scope.posts = posts;
      $scope.getMap = map;
    });
  });




  $scope.listOpen = true;
  $scope.openState = 'open';

  $scope.toggleList = function() {
    if ($scope.listOpen) {
      $scope.listOpen = false;
      $scope.openState = 'closed';
    } else {
      $scope.listOpen = true;
      $scope.openState = 'open';
    }
    Map.resizeMap();
  }

}]);