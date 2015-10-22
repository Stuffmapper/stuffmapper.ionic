angular.module('stuffmobile')
.controller('DetailCtrl', ['$stateParams', '$ionicPopup', '$scope', 'Post', 'PostsService', 'BackService', function($stateParams, $ionicPopup, $scope, Post, PostsService, BackService) {
  var detailCtrl = this;
  console.log($stateParams);
  PostsService.get($stateParams.id).then(function(post) {
    console.log('post data in detail', post)
    $scope.post = new Post(post.data.post);
    console.log('show dib result' , $scope.post.showDib());
    console.log('show edit result' , $scope.post.showEdit());
  }, function(err){
    throw err;
  });
  
  $scope.dib = function(post) {
    post.dib().then(function(data) {
      $ionicPopup.alert({title: 'Dibbed', template: 'Item has been dibbed!'})
    }, function(err) {
      throw err;
    });
  }

  $scope.back = function() {
    BackService.back();
  }
}])