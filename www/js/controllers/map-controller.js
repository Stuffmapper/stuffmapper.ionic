angular.module('stuffmobile')
.controller('MapCtrl', ['$scope', '$state', 'Map', 'PostsService', function($scope, $state, Map, PostsService) {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
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
  }


  console.log('get ctrl')

  $scope.getDetails = function(post) {
    console.log('going to', post.id)
    $state.go('details', {id: post.id.toString()}, {reload: true});
  }



  $scope.categories = PostsService.categories;
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