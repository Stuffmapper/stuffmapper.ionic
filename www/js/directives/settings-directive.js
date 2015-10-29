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
      
    },
    controller: [
      '$ionicPopup', '$state', '$scope', function($ionicPopup, $state, $scope){
        $scope.remove = function() {
          $scope.post.remove().then(function(data) {
            $scope.post.status = 'deleted';
            $ionicPopup.alert({title: 'notice', template: 'Post has been deleted'});
          })
        }

        $scope.undib = function() {
          $scope.post.undib().then(function(data) {
            $post.status = 'new';
            $ionicPopup.alert({title: 'notice', template: 'Post has been undibbed'});
          })
        }

        $scope.gone = function() {
          $scope.post.markGone().then(function(data) {
            $scope.ipost.status = 'gone';
            $ionicPopup.alert({title: 'notice', template: 'Post has been marked as picked up'});
          })
        }

        $scope.reject = function() {
          $scope.post.rejectDibber().then(function(data) {
            $scope.post.status = 'new';
            $ionicPopup.alert({title: 'notice', template: 'Dib rejected'});
          })
        }
      }
    ],
  }
}])