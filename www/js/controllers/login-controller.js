//logout handled on main, ionic nav-header-bar greatness...
angular.module('stuffmobile')
.controller('UserCtrl', ['$scope', '$state', '$rootScope', '$ionicPopup', '$cordovaOauth', 'UserService', 'BackService', function($scope, $state, $rootScope, $ionicPopup, $cordovaOauth, UserService, BackService){
  var userCtrl = this;

  //sends to sign up page
  userCtrl.openSignup = function(){
    $state.go('signup');
  }

  //send to resets pw
  userCtrl.resetPW = function() {
  }

  //sign in user
  userCtrl.signin = function() {
    UserService.login($scope.username, $scope.password, function(err, data) {
      console.log(data)
      if (err) {
        console.log('error in sign in', err)
      } else if (data.user) {
        console.log('sign in successfull');
        $scope.user = data.user
        BackService.back();
        return data.user;
      } else {
        return console.log(data.error);
      }
    });
  }

  userCtrl.signinGoogle = function() {
    $cordovaOauth.google("11148716793-hmtmjsrvuiihm8531k1hvtg98jvtqf8a.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]).then(function(result) {
      console.log(JSON.stringify(result));
      UserService.googleLogin(result, function(err, data) {
        console.log(data)
        if (err) {
          console.log('error in sign in', err)
        } else if (data.user) {
          console.log('sign in successfull');
          $scope.user = data.user
          BackService.back();
          return data.user;
        } else {
          return console.log(data.error);
        }
      });
    }, 
    function(error) {
      console.log(error);
    });
  }

  userCtrl.signinFacebook = function() {
    $cordovaOauth.facebook("455657511303315", ["email", "public_profile"], {"auth_type": "rerequest"}).then(function(result) {
      console.log(JSON.stringify(result));
      UserService.facebookLogin(result, function(err, data) {
        console.log(data)
        if (err) {
          console.log('error in sign in', err)
        } else if (data.user) {
          console.log('sign in successfull');
          $scope.user = data.user
          BackService.back();
          return data.user;
        } else {
          return console.log(data.error);
        }
      });
    }, 
    function(error) {
      console.log(error);
    });
  }
  

  //back to home
  userCtrl.cancel = function() {
    $state.go('tabs.map', {}, {reload: true});
  }

}]);


