angular.module('stuffmobile')

.factory('UserService', ['$http', '$q', '$ionicPopup', '$ionicHistory', 'LocalService', 'ApiEndpoint', '$state', function($http, $q, $ionicPopup, $ionicHistory, LocalService, ApiEndpoint, $state) {
  var UserService = this;
  UserService.checking = false;
  UserService.checkingQueue = [];
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
          })
          that.currentUser = data.user;
          that.token = data.token;
          LocalService.set('sMToken', JSON.stringify(data));
          return callback(null, data);
        } else {
          $ionicPopup.alert({
            title: 'Error :(',
            template: 'The Username and Password did not match',
          })
          LocalService.unset('sMToken');
          that.currentUser = false;
        }
        // return callback(null, data);
      }).error(function(err) {
        console.log(err);
        that.currentUser = false;
        $ionicPopup.alert({
          title: 'Error :(',
          template: 'An error occurred, please try again ' + data,
        })
        return callback(err);
      });
    }
  return {
    signUp: function(userInfo) {
      return $http.post(ApiEndpoint.url + '/users', {
        user: userInfo
      }).success(function(data) {
        console.log('\n\n\n\n\n\n\n\n\n Data from signup', data)
        // $ionicPopup.alert({
        //   title: 'Success',
        //   template: 'Logged In'
        // })
        login(userInfo.username, userInfo.password)
        return userInfo.username;
      }).error(function(error) {
        console.log('\n\n\n\n\n\n\n\n\n Data from signup ERROR', error)
        $ionicPopup.alert({
          title: 'failure',
          template: 'Something went wrong'
        })
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
        that.currentUser = false;
        $ionicHistory.clearCache().then(function() {
          return $ionicPopup.alert({
            title: 'Succcess',
            template: 'Logout Successfull',
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
}]);