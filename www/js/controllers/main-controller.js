angular.module('stuffmobile')
  .controller('MainCtrl', function($scope, $cordovaGeolocation, UserService){
    var main = this;
    main.getCurrentUser = function(){
      $scope.currentUser = UserService.currentUser;
      return $scope.currentUser;
    }
    main.logout = function() {
      return UserService.logout();
    }
    UserService.check();
});