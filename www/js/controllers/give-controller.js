angular.module('stuffmobile')
.controller('GiveCtrl', [
    '$scope', '$timeout', '$window', '$q',
    '$resource', 'ImageService','LocalService', 
    'Map','PostsService', 'UserService', '$ionicPopup','$rootScope',
    '$http', 'ImageService', 'Post', '$state', function($scope, $timeout, $window,
      $q, $resource, ImageService, LocalService,
      Map, PostsService, UserService, $ionicPopup, $rootScope,
      $http, ImageService, Post, $state) {
      console.log(' give stuff controller');
      Map.giveInit();
       // $SCOPE OBJECTS

      $scope.categories = PostsService.categories;
      $scope.loading = false;
      $scope.menuHeight = 'menu-0';
      $scope.mapHeight = 'map-0'
      $scope.post = {};
      $scope.myPosts =  {};
      $scope.myWants = {};

      $scope.search = {};//NOTE am I used yet?
      $scope.stuff = {};

      // $SCOPE FUNCTIONS
      $scope.takePicture = function() {
        ImageService.takePicture().then(function(imageURI) {
          $scope.imgSrc = imageURI;
          console.log('image uri', imageURI);
        }, function(err) {
          console.err(err);
        });      
      }

      $scope.selectPictureStorage = function() {
        ImageService.selectPicture().then(function(imageURI) {
          $scope.imgSrc = imageURI;
          console.log('imageURI', imageURI);
        }, function(err) {
          console.err(err);
        });   
      };

      $scope.uploadPicture = function(imgUri, id){
        ImageService.uploadPicture(imgUri, id);
        //will need to make a callback when able
        //to upload pictures
      }

      $scope.choosePicture = function(imgSrc) {
        $scope.imgSrc = imgSrc;
        $scope.mapStatus = 'closed'
        $scope.pictureChosen = true;
      }

      $scope.unselectPicture = function() {
        $scope.imgSrc = undefined;
      }

      $scope.panToLocation= function(){
        return Map.panToLocation();
      };
      $scope.edit = function(){
        if($routeParams.next){
          $scope.showEdit($routeParams.next);
        } 
      }

      $scope.getStuff = function() {
        $scope.menuHeight = 'menu-0';
        $scope.mapHeight = 'map-0';
        return MapsService.getCenter()
        .then(function(center){
          $scope.updateMarkers(center)
          .then(function(){
            PostsService.setAll({status:'new'}, {temporary:true});//
            $scope.$emit('markersUpdated', function(){})
          });
        });
      };

      $scope.giveState = function(state){ 
        console.log('give state bein called yall');
        var current = '1'; 
        return current === String(state) 
      };

      $scope.giveStuff = function() {
        var state = innerState() || '1';
        addImageGroup('giveStuff');
        return PostsService.getSetTemporary('giveStuff')
        .then( function(marker){ 
          marker.images = ImageService.images['giveStuff']
          $scope.post = PostsService.getMarker('giveStuff');
          return $scope.giveNext(state); 
        })
      };


      $scope.markers = function(hasAttribute, hasNoAttribute){
        return PostsService.where( hasAttribute, hasNoAttribute );
      };


      $scope.menuToggle = function() {
        //TODO ake sure this is used
        return $scope.toggle = !$scope.toggle;
      };

      $scope.myStuff = function() {
        $scope.menuHeight = 'menu-2';
        $scope.mapHeight = 'map-2';
        return UserService.getCurrentUser()
        .then(
          function(user){
            return loadMyStuff(user)
          },
          function(err){
            console.warn('user not signed in')
            return
          }
        )
        .then(function(){
          PostsService.setAll([
            { type:'want' },
            { type: 'myPost' }
          ]);
        })
      };


      // $scope.publish = function(status) {
      //   //TODO move to Marker Resource
      //   if (UserService.currentUser) {
      //     return $http.post("/api/posts/" + $scope.editItem.id + "/update", {
      //       published: status
      //     }).success( console.log('success') )
      //     .error(console.log);
      //   }
      // };

      $scope.submitPost = function(postParams) {
        //TODO move this into marker service resource
        var latlng = Map.getCenter();
        console.log(latlng);
        postParams.latitude = latlng.lat(),
        postParams.longitude = latlng.lng()
        var post = new Post(postParams);
        post.create()
          .then(function(post){
            console.log('returned post after create', post);
            return ImageService.uploadPicture($scope.imgSrc, post.id)
            .then(function(){
              $ionicPopup.alert({title: 'success', template: "Your post has been added"});
            })
            .then(function(){
              $state.go('tabs.map');
            });
            //need to add error handling for pic upload

            return PostsService.setMarker(post);
          })
 
      };

    }
  ]);

