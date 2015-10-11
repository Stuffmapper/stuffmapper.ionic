angular.module('stuffmobile')
  .controller('MainCtrl', function($scope, UserService){
    var main = this;
    main.getCurrentUser = function(){
      return UserService.currentUser;
    }
    main.logout = function() {
      return UserService.logout();
    }
});