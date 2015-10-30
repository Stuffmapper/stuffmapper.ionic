angular.module('stuffmobile')
.directive('chat', function() { 
  return {
    restrict: 'E',
    scope: {
      dibs: '=',
      showChat: '='
    },
    controller: ['ChatService', '$scope', '$interval', function(ChatService, $scope, $interval) {
      console.log('scope inside chat directive', $scope.dibs)
      var ctrl = this;
      var dibId = $scope.dibs
      if (dibId && $scope.showChat) {
        ChatService.getChat(dibId).then(function(data) {
          console.log('getting chat in chat dir', data.data.dibs);
          ChatService.markRead($scope.dibs);
          $scope.chat = data.data.dibs;
        })
      }
      var interval = $interval(function(dibs) {
        if (dibId && $scope.showChat) {
          ChatService.getChat(dibId).then(function(data) {
            console.log('getting chat in chat dir', data.data.dibs);
            ChatService.markRead(dibId);
            $scope.chat = data.data.dibs;
          })
        }
      }, 10000)

      $scope.send = function() {
        console.log('sending')
        ChatService.sendMessage(dibId, $scope.message).then(function(data) {
          $scope.chat = data.data.dibs;
        })
        $scope.message = undefined;
      }

      $scope.$on('$destroy', function() {
        if(interval) {
          $interval.cancel(interval);
        }
      })
    }],
    templateUrl: 'templates/chat.html',
  }
})