angular.module('stuffmobile')
.controller('MyCtrl', [
    '$scope', '$timeout', '$window', '$q',
    '$resource', 'ImageService','LocalService', 
    'Map','PostsService', 'UserService', '$ionicPopup','$rootScope',
    '$http', 'ImageService', 'Post', function($scope, $timeout, $window,
      $q, $resource, ImageService, LocalService,
      Map, PostsService, UserService, $ionicPopup, $rootScope,
      $http, ImageService, Post) {
      console.log('stuff controller');
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

      //WATCHES

      $scope.$watchCollection('UserService', function() {
        $scope.currentUser = UserService.currentUser;
        console.log($scope.currentUser)
      });

      // $SCOPE FUNCTIONS
      $scope.takePicture = function() {
        ImageService.takePicture().then(function(imageURI) {
          $scope.imgSrc = imageURI;
          console.log('image uri', imageURI);
        }, function(err) {
          console.err(err);
        });      
      }

      $scope.selectPicture = function() {
        ImageService.selectPicture().then(function(imageURI) {
          $scope.imgSrc = imageURI;
          console.log('imageURI', imageURI);
        }, function(err) {
          console.err(err);
        });   
      };

      $scope.uploadPicture = function(imgUri){
        ImageService.uploadPicture(imgUri);
        //will need to make a callback when able
        //to upload pictures
        $scope.pictureUploaded = true;
      }

      $scope.cancelUpload = function() {
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

      $scope.giveNext = function(id) {
        var stat = String(id);
        $scope.mapHeight = 'map-1-' + stat
        $scope.menuHeight = 'menu-1-' + stat;
        return MapsService.resizeMap() 
        .then(function(){ 
          return $q.when( MapsService.panToMarker(
          PostsService.getMarker('giveStuff').marker) ) })
        .then(function(){  
          return PostsService.clearMarkers('giveStuff'); 
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


      $scope.showDetails = function(id){
        //TODO delete code and "mydetails.html" if it is never used
        //var template = ( $location.search().tab === 'ms' ?
        // 'mydetails' : 'details'); 
        // PostsService.updateWindow(id);
        // PostsService.clearWindows(id, $scope.ma)
        var template = 'details';
        
        //TODO have the state use another service or write own solution
        //the current hack on $location and the $route is so that the page doesn't 
        //render the page and attempt to reload the google map
        $scope.menuHeight = 'menu-0';
        $scope.mapHeight = 'map-0';
        $scope.stuff = PostsService.getMarker(id);
        if (!$scope.stuff ){
          PostsService.getMarkerAsync(id)
          .then( function(){ 
              //NOT TESTED TEST ME
              $scope.stuff = PostsService.getMarker(id);
              $state.go('/post/' + id);
            },
              function(){ 
                console.log("this is not found")
                alert('404 Marker not found') }
          );
        } else {
          $state.go('/post/' + id);
        }
      };

      $scope.showEdit = function(id){
        $state.go('/details/' + id + '/edit')
        var template = 'editing';
        $scope.mapHeight = 'map-1-2';
        $scope.menuHeight = 'menu-1-2';
        $scope.editItem = PostsService.getMarker(id);
          if (!$scope.editItem ){
            PostsService.getMarkerAsync(id)
            .then( function(){ 
              //NOT TESTED TEST ME
                $scope.editItem = PostsService.getMarker(id);
                $scope.showTab(template)
              },
              function(){ 
                console.log("this is not found")
                alert('404 Marker not found') 
              }
          );
        } else {
          $scope.showTab(template);
        }
      };

      $scope.submitPost = function() {
        //TODO move this into marker service resource
        var latLng = Map.getCenter();
        console.log(latLng);
        var post = new Post();
        post.category = $scope.category;
        post.title = $scope.title;
        post.description = $scope.description;
        post.image_url = $scope.imgUrl;

        return post.create()
        .then(
          function(post){
            $ionicPopup.add('success', "Your post has been added");
            PostsService['delete']('giveStuff');

            return PostsService.setMarker(post)
            .then( function(){
              PostsService.getMarker(post.id).image_url = image;
              $scope.showDetails(post.id);
            })
            .then(
              function(){
                return ImageService.upload(image,post.id,'post')
              }
            )
          },
          function(error){
            console.log(error);
            $ionicPopup.add('danger', "Something went wrong");
          }
        );
 
      };
      $scope.updateStuff = function() {
        //TODO move to marker servicee
        return UserService.check()
        .then( function() {
          var formdata;
          if (UserService.currentUser) {
            angular.forEach(PostsService.editProperties, function(value){
              if($scope.editItem[value]){
                formdata.append(value, $scope.editItem[value]);
              }
            });
            if ($scope.file) {
              formdata.append('image', $scope.file);
              $scope.loading = true;
            }
          return $http.post("/api/posts/" + $scope.editItem.id + "/update", formdata, {
            headers: {
              'Content-Type': void 0
            },
            transformRequest: angular.identity })
            .success(function(data, status, headers, config) {
              if ($scope.editMarker) {
                $scope.editItem.marker.setPosition($scope.editMarker.getPosition());
                $scope.editMarker.setMap(null);
              }
              $ionicPopup.add('success', "Your post has been updated");
              $scope.attached = false;
              delete $scope.file;
              $scope.loading = false;
              return $scope.current_image = '';})
            .error(function(data) {
              var key, results, value;
              results = [];
              for (key in data) {
                value = data[key];
                results.push($ionicPopup.add('danger', key + ' ' + value));
              }
            });
          }
        },
        function(){
          $ionicPopup.add('danger', 'Please sign in to continue');
          $modal.open({
            templateUrl: 'signIn.html',
            controller: 'SignUpCtrl'
           });
         }
        );
      };

      //not sure why this is here... wkc
      $scope.updateMarkers = function(coords) {
        var defer = $q.defer();
        //TODO turn 15 into a variable
        var box = MapsService.getBoundingBox(coords, 15);
        $http({
          url: '/api/posts/geolocated',
          params: {
            nwLat: box.nw.lat,
            seLat: box.se.lat,
            nwLng: box.nw.lng,
            seLng: box.se.lng
          }
        })
        .success(function(data) {
          var i, len, marker, ref, results;
          ref = data.posts;
          for (i = 0, len = ref.length; i < len; i++) {
            marker = ref[i];
            if (marker.originalImage === 'missing') {
              // marker.originalImage = '<%= asset_path('processing.png')%>';
              marker.image_url = 'https://pixabay.com/static/uploads/photo/2013/10/28/05/11/kaleidoscopes-201646_640.jpg';//'<%= asset_path('processing.png')%>';
            }
            marker.currentUser = UserService.currentUser;
            PostsService.setMarker(marker);
          };
          defer.resolve('markers updated')
        });
        return defer.promise;
      };

      //LISTENERS

      $rootScope.$on("detailsWanted", function(event, args) {
          var id = args.markerId;
          $scope.showDetails(id);
      });

      $rootScope.$on("editWanted", function(event, args) {
          var id = args.markerId;
          $scope.showEdit(id);
      });
      
      $scope.$on("fileSelected", function(event, args) {
        args.origin = args.location.split('/')[2]
        ImageService.createGroup(args)
        .then(function(){
          if (args.origin === 'giveStuff'){
            $scope.giveNext(2);
          } 
        })
      });

      $scope.$on('mapChanged', function(evt, args) {
        $scope.updateMarkers(args);
      });
      $scope.$on('markersUpdated', function(){
        $scope.mapped = PostsService.where({status: 'new'}, {temporary:true});
      });
      //HELPER FUNCTIONS 
      var addImageGroup = function(id) {
        var image = PostsService.getMarker(id) && PostsService.getMarker(id).image_url;
        ImageService.addImageGroup(id, image)
      };


      var loadCache = function(){
        //TODO put this in the Main controller
        var markers = LocalService.getJSON('markers'); 
        angular.forEach(markers, function(marker, key){
            PostsService.setMarker(marker)
        })
        $scope.$emit('markersUpdated', function(){})
      };

      var loadMyStuff  = function(currentUser){
        if(!currentUser){ throw new Error('currentUser must be defined') };  
        return $http.get('/api/my-dibs')
        .then( 
          function(data){ 
            var promises = [] 
            angular.forEach(data.data.posts, function(marker) {
              marker.type = 'want';
              marker.icon = 'dibber';//TODO not working 
              marker.currentUser = UserService.currentUser;
              marker.dibber = UserService.currentUser;
              promises.push( PostsService.setMarker(marker)
                .then(function(marker){ $scope.myWants[marker.id] = marker }) );
            });
            return $q.all(promises)
          },
          function(err){
            return err
          }
        )
        .then(
          function(){
            return $http.get('/api/my-stuff')
            .then(function(data){
              var promises = [] 
              angular.forEach(data.data.posts, function(marker) {
                marker.type = 'myPost'; 
                marker.icon = 'creator'; //TODO not working
                marker.currentUser = UserService.currentUser;
                promises.push( PostsService.setMarker(marker)
                  .then(function(marker){ $scope.myPosts[marker.id]  = marker }) );
              });
              return $q.all(promises)
            })

          },
          function(err){
            return err
          }
        )
      }
    }
  ]);

