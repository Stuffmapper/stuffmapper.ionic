angular.module('stuffmobile')
.controller('SignupCtrl', ['$scope', 'UserService', '$state', function($scope, UserService, $state) {
  signupCtrl = this;
  $scope.signup = function() {
    console.log('signing up');
    var userInfo = {
      password: $scope.password,
      username: $scope.username,
      email: $scope.email,
      first_name: $scope.first_name,
      last_name: $scope.last_name,
      password_confirmation: $scope.password_confirmation,
      phone_number: $scope.phone_number,
      anonymous: $scope.anonymous
    }
    UserService.signUp(userInfo).then(function(user){
      $state.go('tabs.map', {}, {reload: true});
    })
  }
}]);