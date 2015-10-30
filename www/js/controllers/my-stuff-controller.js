angular.module('stuffmobile')
.controller('MyCtrl', [
    '$scope', '$q',
    '$resource', 'ImageService','LocalService', 
    'Map','PostsService', 'UserService', '$ionicPopup','$rootScope',
    '$http', 'ImageService', 'Post', 'ApiEndpoint', 'Post', 'ChatService', function($scope,
      $q, $resource, ImageService, LocalService,
      Map, PostsService, UserService, $ionicPopup, $rootScope,
      $http, ImageService, Post, ApiEndpoint, Post, ChatService) {
      var myCtrl = this;
      console.log('my stuff controller');

      myCtrl.loadMyStuff = function() {
        PostsService.getMyPosts().then(function(data) {
          console.log('myposts', data)
          $scope.myPosts = data;
        })
        PostsService.getMyDibs().then(function(data) {
          console.log('mydibs', data)
          $scope.myDibs = data;
        })
      }
      myCtrl.loadMyStuff();
       // $SCOPE OBJECTS

      $scope.categories = PostsService.categories;
      //should really open a socket connection for this one...
      $scope.messageButton = function(post) {
        if(post.currentDib) {
          if(post.newMessage) {
           return '[button-balanced newMessage]';
          } else {
            return 'button-calm noNewMessage';
          }
        } else {
          return 'button-stable listed';
        }
      }



    }
  ]);

