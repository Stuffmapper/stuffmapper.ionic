angular.module('stuffmobile')
  .controller('MainCtrl', function($scope, $cordovaGeolocation, UserService, BackService){
    var main = this;
    main.getCurrentUser = function(){
      $scope.currentUser = UserService.currentUser;
      return $scope.currentUser;
    }
    main.logout = function() {
      return UserService.logout();
    }
    main.back = function() {
      BackService.back();
    }
    UserService.check();
});