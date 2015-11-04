angular.module('stuffmobile')
.controller('DetailCtrl', ['$stateParams', '$ionicPopup', '$scope', '$state', 'Post', 'PostsService', 'BackService', 'UserService', function($stateParams, $ionicPopup, $scope, $state, Post, PostsService, BackService, UserService) {
  var detailCtrl = this;
  console.log($stateParams);
  PostsService.get($stateParams.id).then(function(post) {
    console.log('post data in detail', post)
    $scope.post = new Post(post.data.post);
  }, function(err){
    throw err;
  });
  
  $scope.dib = function() {
    console.log('dibbing')
    if (!UserService.getCurrentUser()) {
      $ionicPopup.alert({title: 'Alert', template: 'Sign in to Dibs items'})
    } else {
      var post = $scope.post;
      post.dib().then(function(data) {
        $ionicPopup.alert({title: 'Dibbed', template: 'Item has been dibbed!'})
      }, function(err) {
        throw err;
      });
    }
  }
  

  $scope.back = function() {
    BackService.back();
  }

  $scope.unDib = function() {
    var post = $scope.post;
    post.unDib();
  }

  $scope.goChat = function() {
    var post = $scope.post;
    $state.go('tabs.mystuff');
  }


}])