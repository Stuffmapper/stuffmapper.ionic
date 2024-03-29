angular.module('stuffmobile')
.controller('GiveCtrl', [
    '$scope',  
    'ImageService','LocalService', 
    'Map','PostsService', 'UserService', '$ionicPopup',
    '$http', 'Post', '$state', function($scope, 
      ImageService, LocalService,
      Map, PostsService, UserService, $ionicPopup, 
      $http, Post, $state) {
      console.log(' give stuff controller');
      Map.giveInit();
       // $SCOPE OBJECTS
      $scope.locationSelected = false;
      $scope.pictureChosen = false;
      $scope.categories = PostsService.categories;
      // $SCOPE FUNCTIONS
      $scope.takePicture = function() {
        if(!UserService.getCurrentUser()) {
          $ionicPopup.alert({title: 'Alert', template: 'Please login to list an item!'})
        } else {
          ImageService.takePicture().then(function(imageURI) {
            $scope.imgSrc = imageURI;
          }, function(err) {
            console.err(err);
          });      
        }
      }

      $scope.selectPictureStorage = function() {
        if(!UserService.getCurrentUser()) {
          $ionicPopup.alert({title: 'Alert', template: 'Please login to list an item!'})
        } else {
          ImageService.selectPicture().then(function(imageURI) {
            $scope.imgSrc = imageURI;
          }, function(err) {
            throw err;
          });   
        }
      };

      $scope.uploadPicture = function(imgUri, id){
        ImageService.uploadPicture(imgUri, id);
        //will need to make a callback when able
        //to upload pictures
      }

      $scope.choosePicture = function(imgSrc) {
        if(!UserService.getCurrentUser()) {
          $ionicPopup.alert({title: 'Alert', template: 'Please login to list an item!'})
        } else {
          $scope.imgSrc = imgSrc;
          $scope.pictureChosen = true;
          $scope.selectLocation();
        }
      }

      $scope.selectLocation = function() {
        $scope.locationSelected = true;
        Map.setUndraggable();
      }

      $scope.unselectPicture = function() {
        $scope.imgSrc = undefined;
        $scope.pictureChosen = false;
      }

      $scope.returnToSelectLocation = function() {
        $scope.locationSelected = false;
        Map.setDraggable();
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
        if(!UserService.getCurrentUser()) {
          $ionicPopup.alert({title: 'Alert', template: 'Please login to list an item!'})
        } else if (postParams == undefined || postParams.title == "") {
          $ionicPopup.alert({title: 'Alert', template:"Title is required"})
        } else {
          //TODO move this into marker service resource
          var latlng = Map.getCenter();
          postParams.latitude = latlng.lat()
          postParams.longitude = latlng.lng()
          var post = new Post(postParams);
          post.create()
            .then(function(post){
              return ImageService.uploadPicture($scope.imgSrc, post.id)
              .then(function(){
                $ionicPopup.alert({title: 'Success', template: "Your stuff is now mapped"});
              })
              .then(function(){
                $state.go('tabs.map', {}, {reload: true});
              });
              //need to add error handling for pic upload

              return PostsService.setMarker(post);
            })
        }
 
      };

      $scope.showLogin = function() {
        $state.go('user');
      }

    }
  ]);

