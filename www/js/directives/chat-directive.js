angular.module('stuffmobile')
.directive('chat', ['$http', function($http){
  return {
    restrict: 'A',
    scope: {
      chat: '='
    },
    templateUrl: 'templates/chat.html',
  }
}])