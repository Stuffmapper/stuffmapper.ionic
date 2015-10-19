angular.module('stuffmobile')

.factory('UserService', function($http, $q, $ionicPopup, LocalService, ApiEndpoint) {
  var UserService = this;
  UserService.checking = false;
  UserService.checkingQueue = [];
  return {
    signUp: function(userInfo) {
      return $http.post(ApiEndpoint.url + '/users', {
        user: user
      }).success(function() {
        $ionicPopup.alert({
          title: 'Success',
          template: 'Logged In'
        })
        $state.go('map')
      }).error(function(data) {
        $ionicPopup.alert({
          title: 'failure',
          template: 'Something went wrong'
        })
        var key, results, value;
        results = [];
        for (key in data) {
          value = data[key];
        }
        console.log(value);
        return results;
      });    
    },
    login: function(username, password, callback) {
      //TODO switch to promises for consistency
      var that = this;
      loginData = {
        username: username,
        password: password
      };
      return $http.post(ApiEndpoint.url + '/sessions/create', loginData).success(function(data) {
        if (data && data.user) {
          $ionicPopup.alert({
            title: 'Success :)',
            template: data.user + ' is now logged in',
          })
          that.currentUser = data.user;
          that.token = data.token;
          LocalService.set('sMToken', JSON.stringify(data));
        } else {
          console.log(data);
          $ionicPopup.alert({
            title: 'Error :(',
            template: 'The Username and Password did not match',
          })
          LocalService.unset('sMToken');
          that.currentUser = false;
        }
        return callback(null, data);
      }).error(function(err) {
        console.log(err);
        that.currentUser = false;
        $ionicPopup.alert({
          title: 'Error :(',
          template: 'The Username and Password did not match',
        })
        return callback(err);
      });
    },
    logout: function(callback) {
      //TODO switch to promises for consistency
      var that = this;
      localStorage.clear();
      //should this passed into LocalService?
      return $http.get(ApiEndpoint.url + '/log_out').success(function(data) {
        that.currentUser = false;
        $ionicPopup.alert({
          title: 'Succcess',
          template: 'Logout Successfull',
        })
        // return callback(null, data);
      }).error(function(err) {
        console.log('error in user service logout', err)
        // return callback(err);
      });
    },
    check: function(){
      var that = this;
      var rejectAll = function(){
        that.currentUser = false;
        while(UserService.checkingQueue.length > 0){
          var prom = UserService.checkingQueue.pop();
          prom.reject(that.currentUser)
        }
        UserService.checking = false;
      };
      var resolveAll = function(user){
        that.currentUser = user;
        while(UserService.checkingQueue.length > 0){
          var prom = UserService.checkingQueue.pop();
          prom.resolve(that.currentUser)
        }
        UserService.checking = false;
      };

      user = LocalService.getJSON('sMToken');
      var defer = $q.defer();
      UserService.checkingQueue.push(defer)
      if (!UserService.checking){
        UserService.checking = true;
        if (user) {
          $http.get(ApiEndpoint.url + '/auth/check?token=' + user.token)
          .success(function(data) {
            resolveAll(user.user);
          })
          .error(function(err) {
            rejectAll();
          });
        } else {
          rejectAll();
        }
      } 
      return defer.promise;
    },

    getCurrentUser: function(){
      var that = this;
      if( that.currentUser ){
        return $q.when(that.currentUser)
      } else { return that.check() }
    }
  };
});