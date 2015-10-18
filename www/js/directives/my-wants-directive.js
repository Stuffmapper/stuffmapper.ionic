angular.module('stuffmobile')
.directive('mywant', function() {
  function link(scope, element) {
  }
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: [
      '$scope', 'MessageService', function($scope, MessageService) {
        var getColor = function(){

        };
        $scope.msg= 'Wanted';
        $scope.btnClass = 'green';
        $scope.btnAction = function(){
          throw new Error('not implemented')
        }


      }
    ],
    replace: true,
    templateUrl: 'templates/my-stuff/my-wants.html',
    link: link
  };
});

