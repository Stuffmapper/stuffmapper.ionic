angular.module('stuffmobile')
  .controller('MainCtrl', ['$scope', '$state', 'UserService', 'BackService', 
    function($scope, $state, UserService, BackService){
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

    main.getStuff = function() {
      $state.go('tabs.map');
    }

    main.giveStuff = function() {
      $state.go('tabs.givestuff');
    }

    main.myStuff = function() {
      $state.go('tabs.mystuff')
    }

    UserService.check();
}]);