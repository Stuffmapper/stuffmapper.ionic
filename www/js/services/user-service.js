angular.module('stuffmobile')

.factory('UserService', ['$http', '$q', '$ionicPopup', '$ionicHistory', 'LocalService', 'ApiEndpoint', '$state', function($http, $q, $ionicPopup, $ionicHistory, LocalService, ApiEndpoint, $state) {
  var UserService = this;
  UserService.checking = false;
  UserService.checkingQueue = [];
  var currentUser = false;
  var login = function(username, password, callback) {
      //TODO switch to promises for consistency
      var that = this;
      var loginData = {
        username: username,
        password: password
      };
      return $http.post(ApiEndpoint.url + '/sessions/create', loginData).success(function(data) {

        if (data && data.user) {
          $ionicPopup.alert({
            title: 'Success :)',
            template: data.user + ' is now logged in',
          });
          currentUser = data.user;
          that.token = data.token;
          LocalService.set('sMToken', JSON.stringify(data));
          return callback(null, data);
        }
        // return callback(null, data);
      }).error(function(err) {
        $ionicPopup.alert({
          title: 'Error :(',
          template: 'The Username and Password did not match',
        })
        LocalService.unset('sMToken');
        currentUser = false;
        // return callback(err);
      });
  }
  return {
    signUp: function(userInfo) {
      console.log('user infor in signUp', userInfo)
      return $http.post(ApiEndpoint.url + '/users', {
        user: userInfo
      }).success(function(data) {
        console.log('\n\n\n\n\n\n\n\n\n Data from signup', data)
        // $ionicPopup.alert({
        //   title: 'Success',
        //   template: 'Logged In'
        // })
        $ionicPopup.alert({
          title: 'Success',
          template: 'Almost done! Please check your email to confirm account.',
        }).then(function() {
          login(userInfo.username, userInfo.password)
        })
        return userInfo.username;
      }).error(function(error) {
        console.log('\n\n\n\n\n\n\n\n\n Data from signup ERROR', error)
        if(error.base || error.username) {
          $ionicPopup.alert({title: 'Notice', template: 'Username or Email has been taken'})
        } else if (error.password_confirmation) {
          $ionicPopup.alert({title: 'Notice', template: 'Passwords do not match'})
        } else if (error.email) {
          $ionicPopup.alert({title: 'Notice', template: 'Please enter a valid email'})
        } else if (error.password) {
          $ionicPopup.alert({title: 'Notice', template: 'Password must be 6 or more charactors'})
        } else {
          $ionicPopup.alert({
            title: 'Notice',
            template: 'An error occurred.  Please try again later'
          })          
        }

        throw error;
      });    
    },
    login: login,
    logout: function(callback) {
      //TODO switch to promises for consistency
      var that = this;
      localStorage.clear();
      //should this passed into LocalService?
      return $http.get(ApiEndpoint.url + '/log_out').success(function(data) {
        currentUser = false;
        $ionicHistory.clearCache().then(function() {
          return $ionicPopup.alert({
            title: 'Succcess',
            template: 'Logout successful',
          })
        })
        .then(function(){
          $state.go('tabs.map', {}, {reload: true});
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
        currentUser = false;
        while(UserService.checkingQueue.length > 0){
          var prom = UserService.checkingQueue.pop();
          prom.reject(that.currentUser)
        }
        UserService.checking = false;
      };
      var resolveAll = function(user){
        currentUser = user;
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
      return currentUser;
    },
    currentUser: currentUser,
  };
}]);