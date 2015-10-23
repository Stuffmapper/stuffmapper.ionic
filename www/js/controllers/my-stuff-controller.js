angular.module('stuffmobile')
.controller('MyCtrl', [
    '$scope', '$timeout', '$window', '$q',
    '$resource', 'ImageService','LocalService', 
    'Map','PostsService', 'UserService', '$ionicPopup','$rootScope',
    '$http', 'ImageService', 'Post', 'ApiEndpoint', 'Post', function($scope, $timeout, $window,
      $q, $resource, ImageService, LocalService,
      Map, PostsService, UserService, $ionicPopup, $rootScope,
      $http, ImageService, Post, ApiEndpoint, Post) {
      var myCtrl = this;
      console.log('my stuff controller');
      myCtrl.loadMyStuff  = function(currentUser){
        if(!currentUser){ throw new Error('currentUser must be defined') };  
        return $http.get(ApiEndpoint.url + '/my-dibs')
        .then( 
          function(data){ 
            console.log(data.data.posts);
            var mydibs = data.data.posts;
            $scope.myDibs = [];
            for(var i = 0; i < mydibs.length; i++) {
              $scope.myDibs.push(new Post(mydibs[i]));
            }
          },
          function(err){
            return err
          }
        )
        .then(
          function(){
            return $http.get(ApiEndpoint.url + '/my-stuff')
            .then(function(data){
              var myposts = data.data.posts;
              $scope.myPosts = [];
              for(var i = 0; i < myposts.length; i++) {
                $scope.myPosts.push(new Post(myposts[i]));
              }
              console.log($scope.myPosts);
            })

          },
          function(err){
            return err
          }
        )
      }
      myCtrl.loadMyStuff(UserService.getCurrentUser());
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


      $scope.showDetails = function(id){

      };
    }
  ]);

