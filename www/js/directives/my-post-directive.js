
angular.module('stuffmobile')
.directive('mypost', function() {
  var linker = function(scope, element, attrs) {
    //some jquery on element to change btn color
    scope.post.chat = [{user:'asdfuiahsdfa', message:'asdufhaosdfhja'},{user:'asdfuiahsdfa', message:'asdufhaosdfhja'},{user:'asdfuiahsdfa', message:'asdufhaosdfhja'},{user:'asdfuiahsdfa', message:'asdufhaosdfhja'}];
  }
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: ['$scope', function($scope) {
      $scope.post.chat = [{user:'asdfuiahsdfa', message:'asdufhaosdfhja'},{user:'asdfuiahsdfa', message:'asdufhaosdfhja'},{user:'asdfuiahsdfa', message:'asdufhaosdfhja'},{user:'asdfuiahsdfa', message:'asdufhaosdfhja'}];
        $scope.msg= function()  {  
          var msg = $scope.post.showWanted() ? 'Wanted' : 'Listed';
          return msg; 
        };
        $scope.btnClass =  function() {
          var btncolor = $scope.post.showWanted() ? 'green' : 'grey';
          return btncolor; 
        };
        
        $scope.btnAction = function(){
          throw new Error('not implemented')
        }
      }
    ],
    replace: true,
    link: linker,
    templateUrl: 'templates/my-stuff/my-posts.html' 
  };
});

