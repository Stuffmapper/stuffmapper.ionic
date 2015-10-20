angular.module('stuffmobile')
.directive('ngpost', function(){
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: [
      '$state', '$scope', function($state, $scope){
        console.log($scope.post);
        $scope.getDetails = function(post) {
          $state.go('details/' + post.id);
        }
      }
    ],
    templateUrl: 'templates/post.html'
  }
});