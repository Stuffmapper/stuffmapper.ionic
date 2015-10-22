angular.module('stuffmobile')
.controller('DetailCtrl', ['$stateParams', '$scope', 'Post', 'PostsService', function($stateParams, $scope, Post, PostsService) {
  var detailCtrl = this;
  console.log($stateParams);
  PostsService.get($stateParams.id).then(function(post) {
    console.log('post data in detail', post)
    $scope.post = post.data.post;
  }, function(err){
    throw err;
  });
}])