angular.module('stuffmobile')
.controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', 'Map', 'PostsService', function($scope, $state, $cordovaGeolocation, Map, PostsService) {

  if(Map.getMap) {
    Map.loadMarkers(Map.getMap).then(function(posts) {
      $scope.posts = posts;
    });
  } else {
    Map.getInit().then(function(map) {
      Map.loadMarkers(map).then(function(posts){
        $scope.posts = posts;
      });
    });
  }
  console.log('get ctrl')





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