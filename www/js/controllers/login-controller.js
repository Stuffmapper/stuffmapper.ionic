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

  }

  userCtrl.signinFacebook = function() {
    var url =  ApiEndpoint.authUrl + '/auth/facebook';
    if ($window.cordova) {
      url += '?redirect=/'+ encodeURIComponent('http://i.imgur.com/XseoGPD.png')
    } else {
      url += '?redirect=' + encodeURIComponent(window.location.href);
    }
    var ref = window.open(url, '_blank', 'location=no');
    ref.addEventListener('loadstop', function(ev) {
      alert("hello")
      if (ev.url.indexOf('/auth/facebook') === -1) {
        ref.close();
        $scope.load();

      }
    });
  }

  //back to home
  userCtrl.cancel = function() {
    $state.go('tabs.map', {}, {reload: true});
  }

}]);


