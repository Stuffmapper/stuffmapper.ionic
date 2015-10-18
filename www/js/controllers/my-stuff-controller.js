angular.module('stuffmobile')
.controller('MyCtrl', [
    '$scope', '$timeout', '$window', '$q',
    '$resource', 'ImageService','LocalService', 
    'Map','PostsService', 'UserService', '$ionicPopup','$rootScope',
    '$http', 'ImageService', 'Post', 'ApiEndpoint', function($scope, $timeout, $window,
      $q, $resource, ImageService, LocalService,
      Map, PostsService, UserService, $ionicPopup, $rootScope,
      $http, ImageService, Post, ApiEndpoint) {
      var myCtrl = this;
      console.log('my stuff controller');
      myCtrl.loadMyStuff  = function(currentUser){
        if(!currentUser){ throw new Error('currentUser must be defined') };  
        return $http.get(ApiEndpoint.url + '/my-dibs')
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
            return $http.get(ApiEndpoint.url + '/my-stuff')
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
      myCtrl.loadMyStuff(UserService.getCurrentUser());
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



      $scope.markers = function(hasAttribute, hasNoAttribute){
        return PostsService.where( hasAttribute, hasNoAttribute );
      };


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


    }
  ]);

