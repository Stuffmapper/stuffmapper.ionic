//logout handled on main, ionic nav-header-bar greatness...
angular.module('stuffmobile')
.controller('UserCtrl', ['$scope', '$state', '$rootScope', '$ionicPopup', '$cordovaOauth','$window', 'ApiEndpoint','UserService', 'BackService', 
  function($scope, $state, $rootScope, $ionicPopup, $cordovaOauth,$window,ApiEndpoint, UserService, BackService){
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
    UserService.googleLogin()
    .then(function(data){
      $scope.user = data.user
      BackService.back();
    },function(err){
      console.log(err);
    });

  }

  userCtrl.signinFacebook = function() {
    UserService.facebookLogin()
    .then(function(data){
      $scope.user = data.user
      BackService.back();
    },function(err){
      console.log(err);
    });
  }

  //back to home
  userCtrl.cancel = function() {
    $state.go('tabs.map', {}, {reload: true});
  }

}]);


