angular.module('stuffmobile')
.directive('mywant', function() {
  function link(scope, element) {
  }
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: ['$scope', 'ChatService', '$interval', '$state', function($scope, ChatService, $interval, $state) {
      $scope.unread = false;
      $scope.showChat = false;
        var interval = $interval(function() {
          var dibs = $scope.post.currentDib.id;
          if(dibs) {
            ChatService.getUnread(dibs).then(function(data) {
              if(data.data.dibs.length > 0) {
                $scope.unread = true;
              }
            });
          }
        }, 10000)
        $scope.btnAction = function(){
          throw new Error('not implemented')
        }
        $scope.toggleChat = function() {
          if ($scope.showChat) {
            $scope.showChat = false;
          } else {
            $scope.showChat = true;
            $scope.unread = false
          }
          console.log($scope.showChat);
        }

        $scope.getDetails = function(){
          $state.go('details', {id: $scope.post.id.toString()}, {reload: true});
        }
        $scope.$on('$destroy', function() {
          if(interval) {
            $interval.cancel(interval);
          }
        })
      }
    ],
    replace: true,
    templateUrl: 'templates/my-stuff/my-wants.html',
    link: link
  };
});

