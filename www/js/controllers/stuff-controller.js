angular.module('stuffmobile')
.controller('StuffCtrl', [
    '$scope', '$timeout', '$routeParams', '$window', '$q',
    '$resource', 'ImageService','LocalService', 'LocationService',
    'Map','MarkerService', 'UserService', '$ionicPopup','$rootScope',
    '$http', function($scope, $timeout, $location, $window,
      $modal,$q, $resource, $route, ImageService,LocalService, LocationService,
      MapsService, MarkerService, UserService, $ionicPopup, $rootScope,
      $http) {

       // $SCOPE OBJECTS

      $scope.categories = MarkerService.categories;
      $scope.loading = false;
      $scope.menuHeight = 'menu-0';
      $scope.mapHeight = 'map-0'
      $scope.post = {};
      $scope.myPosts =  {};
      $scope.myWants = {};

      $scope.UserService = UserService;
      $scope.MarkerService = MarkerService;

      $scope.search = {};//NOTE am I used yet?
      $scope.stuff = {};

      $scope.tabs = {
        getStuff: [ true, true ],
        giveStuff:[ false,  false ],
        myStuff: [ false, false ],
        details: [ false,  false],
        mydetails: [ false,  false],
        editing: [ false, false]
      };

      //WATCHES

      $scope.$watchCollection('UserService', function() {
        return $scope.currentUser = UserService.currentUser;
      });

      // $SCOPE FUNCTIONS


      $scope.cancelGive = function() {
        //REVIEW this has changed

        //needs a test behind it
        //TODO delete file for give
        $scope.giveNext(1);
  
      };

      $scope.centerMap = function(){
        var center;
        return LocationService.get().then(
          function(position){
            center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            LocalService.set('mapcenter', JSON.stringify(center))
          },
          function(error){
            MapsService.getCenter()
            .then(function (mapcenter){
              return center = mapcenter;
            })
          }
         )
         .then( function(){

           return MapsService.panTo(center);
         });
      };
      $scope.edit = function(){
        if($routeParams.next){
          $scope.showEdit($routeParams.next);
        } 
      }



      //This is in the model now -TODO// make sure it is needed here
      $scope.getDetails = function(id) {
        //TODO - 
        $rootScope.$broadcast('detailsWanted', {
          markerId: id
        });
      };

      $scope.getStuff = function() {
        $location.path('/menu/getStuff', false).search({tab: 'gs'})
        $scope.menuHeight = 'menu-0';
        $scope.mapHeight = 'map-0';
        return MapsService.getCenter()
        .then(function(center){
          $scope.updateMarkers(center)
          .then(function(){
            MarkerService.setAll({status:'new'}, {temporary:true});//
            $scope.$emit('markersUpdated', function(){})
          });
        });
      };

      $scope.giveNext = function(id) {
        var stat = String(id);
        $scope.mapHeight = 'map-1-' + stat
        $scope.menuHeight = 'menu-1-' + stat;
        $location.path('menu/giveStuff/' + stat, false).search({gsp: stat});
        return MapsService.resizeMap() 
        .then(function(){ 
          return $q.when( MapsService.panToMarker(
          MarkerService.getMarker('giveStuff').marker) ) })
        .then(function(){  
          return MarkerService.clearMarkers('giveStuff'); 
        });
      };

      $scope.giveState = function(state){ 
        var current = innerState() || '1'; 
        return current === String(state) 
      };

      $scope.giveStuff = function() {
        var state = innerState() || '1';
        addImageGroup('giveStuff');
        return MarkerService.getSetTemporary('giveStuff')
        .then( function(marker){ 
          marker.images = ImageService.images['giveStuff']
          $scope.post = MarkerService.getMarker('giveStuff');
          return $scope.giveNext(state); 
        })
      };


      $scope.markers = function(hasAttribute, hasNoAttribute){
        return MarkerService.where( hasAttribute, hasNoAttribute );
      };


      $scope.menuToggle = function() {
        //TODO ake sure this is used
        return $scope.toggle = !$scope.toggle;
      };

      $scope.myStuff = function() {
        $scope.menuHeight = 'menu-2';
        $scope.mapHeight = 'map-2';
        $location.path('/menu/myStuff', false).search({tab: 'ms'});
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
          MarkerService.setAll([
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
        // MarkerService.updateWindow(id);
        // MarkerService.clearWindows(id, $scope.ma)
        var template = 'details';
        
        //TODO have the state use another service or write own solution
        //the current hack on $location and the $route is so that the page doesn't 
        //render the page and attempt to reload the google map
        $scope.menuHeight = 'menu-0';
        $scope.mapHeight = 'map-0';
        $scope.stuff = MarkerService.getMarker(id);
        if (!$scope.stuff ){
          MarkerService.getMarkerAsync(id)
          .then( function(){ 
              //NOT TESTED TEST ME
              $scope.stuff = MarkerService.getMarker(id);
              $location.path('/post/' + id, false);
              $scope.showTab(template)
            },
              function(){ 
                console.log("this is not found")
                alert('404 Marker not found') }
          );
        } else {
          $location.path('/post/' + id, false);
          $scope.showTab(template);
        }
      };

      $scope.showEdit = function(id){
        $location.path('/menu/editing' +'/' + id, false);
        var template = 'editing';
        $scope.mapHeight = 'map-1-2';
        $scope.menuHeight = 'menu-1-2';
        $scope.editItem = MarkerService.getMarker(id);
          if (!$scope.editItem ){
            MarkerService.getMarkerAsync(id)
            .then( function(){ 
              //NOT TESTED TEST ME
                $scope.editItem = MarkerService.getMarker(id);
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

   
   

      $scope.showTab = function(tab) {
        //NOTE this is an important function
        //It triggers the appropriate action for
        //the tab in addition to making it visible
        //calls the function related to the tab
        //if it is a function otherwise will
        //not call a function (i.e. for edit and details).
        var original;
        angular.forEach($scope.tabs, function(value, key){
          //resets all the tabs
          if(value[1]){
            original = key;
          }
          $scope.tabs[key][1] = false;
          $scope.tabs[key][0] = false;
        });
        //sets correct states
        $scope.tabs[tab][1] = true;
        $scope.tabs[tab][0] = true;
        if (tab === 'details' || tab === 'mydetails') {
          //TODO make this cleaner
          $scope.tabs['details'][1] = false;
          $scope.tabs['mydetails'][1] = false;
          $scope.tabs[original][1] = true;
        }
        //calls corresponding function if exists
        $scope.stuff.last = original;
        //TODO store this state elsewhere

        if(typeof $scope[tab] === 'function'){ $scope[tab]()
          .then(function(){ MapsService.resizeMap() }) 
        }
      };




      $scope.submitPost = function() {
        //TODO move this into marker service resource
        var image = $scope.post.images.original;
        return $scope.post.create()
        .then(
          function(post){
            AlertService.add('success', "Your post has been added");
            MarkerService['delete']('giveStuff');

            return MarkerService.setMarker(post)
            .then( function(){
              MarkerService.getMarker(post.id).image_url = image;
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
            AlertService.add('danger', "Something went wrong");
          }
        );
 
      };
      $scope.updateStuff = function() {
        //TODO move to marker servicee
        return UserService.check()
        .then( function() {
          var formdata;
          if (UserService.currentUser) {
            angular.forEach(MarkerService.editProperties, function(value){
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
              AlertService.add('success', "Your post has been updated");
              $scope.attached = false;
              delete $scope.file;
              $scope.loading = false;
              return $scope.current_image = '';})
            .error(function(data) {
              var key, results, value;
              results = [];
              for (key in data) {
                value = data[key];
                results.push(AlertService.add('danger', key + ' ' + value));
              }
            });
          }
        },
        function(){
          AlertService.add('danger', 'Please sign in to continue');
          $modal.open({
            templateUrl: 'signIn.html',
            controller: 'SignUpCtrl'
           });
         }
        );
      };


      //calls the function related to the tab
      //if it is a function otherwise will
      //not call a function (i.e. for edit and details).
      $scope.showTab = function(tab) {
        var original;
        angular.forEach($scope.tabs, function(value, key){
          //resets all the tabs
          if(value[1]){
            original = key;
          }
          $scope.tabs[key][1] = false;
          $scope.tabs[key][0] = false;
        });
        //sets correct states
        $scope.tabs[tab][1] = true;
        $scope.tabs[tab][0] = true;
        if (tab === 'details' || tab === 'mydetails') {
          //TODO make this cleaner
          $scope.tabs['details'][1] = false;
          $scope.tabs['mydetails'][1] = false;
          $scope.tabs[original][1] = true;
        }
        //calls corresponding function if exists
        $scope.stuff.last = original;
        //TODO store this state elsewhere

        if(typeof $scope[tab] === 'function'){ $scope[tab]() }
        MapsService.resizeMap();
      };

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
              marker.originalImage = '<%= asset_path('processing.png')%>';
              marker.image_url = '<%= asset_path('processing.png')%>';
            }
            marker.currentUser = UserService.currentUser;
            MarkerService.setMarker(marker);
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
        $scope.mapped = MarkerService.where({status: 'new'}, {temporary:true});
      });
      //HELPER FUNCTIONS 
      var addImageGroup = function(id) {
        var image = MarkerService.getMarker(id) && MarkerService.getMarker(id).image_url;
        ImageService.addImageGroup(id, image)
      };

      var init = function() {
        UserService.check();
        setMenu();
        if ($routeParams.postId) {
          //NOTE Works on initial page load only.. otherwise routeparams inaccurate
          $scope.getDetails($routeParams.postId);
        } if ( $routeParams.menuState == 'editing' && $routeParams.next ){
          //TODO use a better router
          $scope.showEdit($routeParams.next);
        }   
        loadCache();
        var getPosition = function(){
          MapsService.getCenter()
          .then( function(center){
            $scope.$emit( 'mapChanged', center )
          }); 
        };
        $scope.centerMap().then(
          function(){
            MapsService.addMapListener('dragend', getPosition );
            getPosition();
        })
      };

      //TODO remove this and use ui-router
      var innerState = function(){
        return $location.path().split('/' ).length >= 4 && $location.path().split('/' )[3];
      };

      var loadCache = function(){
        //TODO put this in the Main controller
        var markers = LocalService.getJSON('markers'); 
        angular.forEach(markers, function(marker, key){
            MarkerService.setMarker(marker)
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
              promises.push( MarkerService.setMarker(marker)
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
                promises.push( MarkerService.setMarker(marker)
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


      var setMenu = function() {
        //NOTE Works on inital page load only
        if($routeParams.menuState){
          $scope.showTab($routeParams.menuState);
        } else if($location.url() == '/' ) {
          var position = MapsService.getCenter()
          $scope.getStuff();
        }
      };
      init();

    }
  ]);

})
