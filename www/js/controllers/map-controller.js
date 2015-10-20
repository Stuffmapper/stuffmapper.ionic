angular.module('stuffmobile')
.controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', 'Map', 'PostsService', function($scope, $state, $cordovaGeolocation, Map, PostsService) {
  console.log('map ctrl')
  Map.getInit().then(function(map) {
    Map.loadMarkers(map).then(function(posts){
      $scope.posts = posts;
    });
  });
}]);