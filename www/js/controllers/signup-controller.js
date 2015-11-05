angular.module('stuffmobile')
.controller('SignupCtrl', ['$scope', 'UserService', '$state', '$ionicPopup', 'PolicyService', 'BackService', function($scope, UserService, $state, $ionicPopup, PolicyService, BackService) {
  signupCtrl = this;
  function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  $scope.signup = function(user) {
    console.log('signing up');
    // if(!$scope.username) {
    //   $ionicPopup.alert({title: 'Notice', template: 'Please enter your username'});
    // } else if (!$scope.password || !scope.password.length < 6) {
    //   $ionicPopup.alert({title: 'Notice', template: 'Please enter a valid password (min 6 charactors'});
    // } else if (validateEmail($scope.email)) {
    //   $ionicPopup.alert({title: 'Notice', template: 'Please enter a valid email'});
    // } else if (!$scope.first_name) {
    //   $ionicPopup.alert({title: 'Notice', template: 'Please enter your first name'});
    // } else if (!$scope.last_name) {
    //   $ionicPopup.alert({title: 'Notice', template: 'Please enter your last name'});
    // } else if ($scope.password_confirmation != $scope.password) {
    //   $ionicPopup.alert({title: 'Notice', template: 'Passwords do not match'});
    // } else {
      var userInfo = {
        password: user.password,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password_confirmation: user.password_confirmation,
        phone_number: user.phone_number,
        anonymous: $scope.anonymous
      }
      console.log('scoped user info in ctrl', userInfo);
      UserService.signUp(userInfo).then(function(user){
        console.log(user);
        $state.go('tabs.map', {}, {reload: true});
      })
    // }
  }    

  $scope.cancel = function() {
    BackService.back();
  }
  $scope.showPrivacy = function() {
    PolicyService.showPrivacy();
  }

  $scope.showTerms = function() {
    PolicyService.showTerms();
  }
}]);