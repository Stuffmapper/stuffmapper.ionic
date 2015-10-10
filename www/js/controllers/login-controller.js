angular.module('stuffmobile')
.controller('UserCtrl', function($scope, $ionicModal, $window, $state, UserService){
  var userCtrl = this;
  console.log($scope);

  //sends to sign up page
  userCtrl.notSignUp = function(){

  }

  //send to resets pw
  userCtrl.resetPW = function() {
  }

  //sign in user
  userCtrl.signin = function() {
    return UserService.login($scope.username, $scope.password, function(err, data) {
      console.log(data)
      if (err) {
        console.log('need to add an alert system wrong credentials');
        return null;
      } else if (data.user) {
        console.log('sign in successfull');
        $scope.user = data.user
        console.log($scope.user);
        $state.go('map');
        return data.user;
      } else {
        return console.log(data.error);
      }
    });
  }

  //back to home
  userCtrl.cancel = function() {
    $state.go('map');
  }

});


