angular.module('stuffmobile')
.factory('Post', [
  '$http','LocalService','$resource', '$q', '$rootScope', '$ionicPopup', 'ApiEndpoint', 'UserService', 
   function($http,LocalService,$resource, $q, $rootScope, $ionicPopup, ApiEndpoint, UserService) {


    var Marker = function(params){
      var self = this;
      angular.extend(self, params);
    };

    var constructor = Marker.prototype;

    constructor.baseProperties = [ 
      'id', 
      'category',
      'description',
      'image_url',
      'latitude',
      'longitude',
      'locallyUpdated',
      'published',
      'title',
      'type',
      'status',
      'chat',
      'showChat'
    ];
    //TODO make this work with angular resource
    //Read the source code for angular resource to confirm  

    // create
    constructor.create = function(customURL){
      //NOTE a controller will have to wrap this function to change
      //the key in the marker service and set the marker on success
      var self = this;
      var url = ApiEndpoint.url + '/posts';
      var params = {};
      angular.forEach(self.baseProperties, function(property){
        params[property] = self[property];
      })
      return $http.post(url, params)
        .then( function(data){
          self.status = 'new'; //review
          var updated = data.data.post;
          updated.locallyUpdated = Date.now();
          angular.extend(self, updated)
          // self.saveLocal();
          return updated;
          },
          function(error){
            //TODO handle specific errors
            throw error;
        }); 
    };

    constructor.dib = function(){
      var self = this;
      return $http.post(ApiEndpoint.url + '/posts/' + self.id + '/dibs')
        .then( function(data){
          angular.extend(self, data.data.post)
          return self;
        }, function(error){
          throw error;
        })
    };


    // read
    constructor.get = function(){
      //gets new data from 
      var self = this;
      if(self.temporary ){ throw new Error('cant get a temporary marker') }
      return $q(function(resolve, reject){
        $http.get(ApiEndpoint.url + '/posts/' + self.id)
        .success(function(data){
          angular.extend(self, data.post)
          self.locallyUpdated = Date.now();
          self.saveLocal();
          resolve(self)
        })
        .error(function(err){
          //TEST ME - REJECT NOT TESTED
          reject(err)
        })

      });
    };

    constructor.markGone = function(){
      var self = this;
      var params = {status: 'gone'};
      return $http.put(ApiEndpoint.url + '/posts/' + self.id, params)
        .then( function(data){
          var updated = data.data.post;
          updated.locallyUpdated = Date.now();
          angular.extend(self, updated)
          self.saveLocal();
          return updated;
        }, function(error){
          throw error;
        }
     );       
    };


    // delete
    constructor.remove = function(){
      var self = this;
      //removes from local cache 
      //deletes on the server
      //does not delete itself .. will need to be handle else where
      //should mark for deletion
      return $http.post(ApiEndpoint.url + '/posts/' + self.id + '/remove')
        .then( function(data){
          angular.extend(self, data.post)
          self.deleteLocal();
          return self;
        },
        function(error){
          throw new Error( "can't delete " + self )
        }
      );
    };


    constructor.rejectDibber = function(){
      var self = this;
      //removes from local cache 
      //deletes on the server
      //does not delete itself .. will need to be handled else where
      //should mark for deletion
      return $http.post(ApiEndpoint.url + '/posts/' + self.id + '/removecurrentdib')
        .then(function(data){
          angular.extend(self, data.post)
          resolve(self)
        },
        function(error){
          throw error;
        }
      );
    }

     constructor.unDib = function(){
      var self = this;
      //removes from local cache 
      //deletes on the server
      //does not delete itself .. will need to be handle else where
      //should mark for deletion
      return $http.post(ApiEndpoint.url + '/posts/' + self.id + '/undib')
        .then(function(data){
          angular.extend(self, data.post)
          resolve(self)
        },
        function(error){
          throw error;
        }
      );
    }

    // update
    constructor.update = function(){
      //updates this post
      // new images should be handled seperately
      var self = this;
      return self.create(ApiEndpoint.url + '/posts/' + self.id)
      
    }; 

    //LOCAL ONLY

    constructor.saveLocal = function(){
      var self = this;
      if(!self.temporary && self.id){ //TODO and more validations
        var cached =  LocalService.getJSON('markers') || {};
        var data = {};
        angular.forEach(self.baseProperties, function(value){
          if(self[value]){
            data[value] = self[value]
          }
        });
        cached[self.id] = data;
        LocalService.set('markers', JSON.stringify(cached))
      }
    };
    constructor.deleteLocal = function(){
      var self = this;
      var cached =  LocalService.getJSON('markers') || {};
      if(cached[self.id]){
       delete cached[self.id];
      }
      LocalService.set('markers', JSON.stringify(cached))
    };
    constructor.goToDetails = function() {
      var self = this;
      $rootScope.$broadcast('detailsWanted', {
        markerId: self.id
      });
    };

    constructor.goToEdit = function() {
      var self = this;
      $rootScope.$broadcast('editWanted', {
        markerId: self.id
      });
    };

    //VISUALIZATION BOOLEANS

    constructor.showEdit = function() {
      return ( this.creator && UserService.currentUser &&
        this.creator == UserService.currentUser);
    };

    constructor.showDib = function() {
      return ( !this.showEdit() && !this.isCurrentDibber && this.dibbable );
    };
    constructor.shouldDelete = function(){
      //ensures it is unavailble - doesn't belong to or dibbed by user
      return !this.dibbable && !this.showEdit() && !this.showUnDib();
    };


    constructor.showUnDib = function() {
      return this.isCurrentDibber ? true : false 
    };

    constructor.showWanted = function() {
      return ( this.showEdit() && this['status'] === 'dibbed' );
    };

    //returns true if there are no messages associated with the
    //post
    constructor.noMessages = function() {
      return false;
    }

    //returns true if there is a new message
    constructor.newMessage = function() {
      return true;
    }

    constructor.showChat = function(){

    }

    return Marker;
}]);


