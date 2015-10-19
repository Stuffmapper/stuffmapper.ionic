angular.module('stuffmobile')
.controller('SignupCtrl', function($scope, $ionicModal) {
  signupCtrl = this;
  signupCtrl.signup = function() {
    var userInfo = {
      password: $scope.password,
      username: $scope.username,
      first_name: $scope.first_name,
      last_name: $scope.last_name
    }
    UserService.signUp(userInfo);
  }
});