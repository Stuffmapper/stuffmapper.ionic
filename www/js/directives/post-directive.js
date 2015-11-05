angular.module('stuffmobile')
.directive('ngpost', function(){
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: [
      '$state', '$scope', function($state, $scope){
        console.log('post from post dir', $scope.post);
        $scope.getDetails = function(post) {
          console.log('going to', post.id)
          $state.go('details', {id: post.id.toString()}, {reload: true});
        }
      }
    ],
    templateUrl: 'templates/post.html'
  }
});