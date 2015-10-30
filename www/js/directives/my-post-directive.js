
angular.module('stuffmobile')
.directive('mypost', function() {
  var linker = function(scope, element, attrs) {
    //some jquery on element to change btn color
  }
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: ['$scope', 'ChatService', '$interval', function($scope, ChatService, $interval) {
      $scope.unread = false;
      $scope.showChat = false;
      var interval = $interval(function() {
        var dibs = $scope.post.currentDib.id;
        if(dibs) {
          console.log('check');
          ChatService.getUnread(dibs).then(function(data) {
            console.log('undread data for', $scope.post.title, data);
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
            $scope.unread = false;
          }
          console.log($scope.showChat);
        }
        $scope.$on('$destroy', function() {
          if(interval){
            $interval.cancel(interval);
          }
        })
      }
    ],
    replace: true,
    link: linker,
    templateUrl: 'templates/my-stuff/my-posts.html' 
  };
});

