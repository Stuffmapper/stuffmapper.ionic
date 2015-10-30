angular.module('stuffmobile')
.directive('dib', function() {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: [
      '$scope', '$http', 'UserService', function($scope, $http, UserService) {
        return $scope.giveMe = function(post) {
          return post.dib()
          .then(
            function(results) {
              return;
            },
            function(err) {
              throw err;
            }
          );
        };
      }
    ],
    replace: true,
    template: "<button class= 'dib-button dib-button-details' ng-click=giveMe(post)>I want this stuff! &gt;&gt;</button>"
  };
});