angular.module('stuffmobile')
.directive('ngpost', function(){
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: [
      '$state', '$scope', function($state, $scope){
        $scope.getDetails = function(post) {
          console.log('going to', post.id)
          $state.go('details', {id: post.id.toString()});
        }
      }
    ],
    templateUrl: 'templates/post.html'
  }
});