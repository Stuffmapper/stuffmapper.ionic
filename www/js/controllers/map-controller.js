angular.module('stuffmobile')
.controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', 'Map', 'PostsService', function($scope, $state, $cordovaGeolocation, Map, PostsService) {
  console.log('map ctrl')
  Map.getInit();
  $scope.posts = PostsService.getLoadedPosts().then(function(data) {
    console.log('asfhasdhuf', data);
  })
}]);