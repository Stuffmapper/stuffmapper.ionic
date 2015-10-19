angular.module('stuffmobile')
.directive('settings', ['UserService', 'Post', function(UserService, Post){
  return {
    restrict: 'E',
    templateUrl: 'templates/settings-dropdown.html',
    scope: {
      post: '=',
    },
    link: function(scope, el, attrs) {
      var post = scope.post;
      
    }
  }
}])