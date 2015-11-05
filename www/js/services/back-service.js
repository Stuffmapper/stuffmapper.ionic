angular.module('stuffmobile')
.factory('BackService', ['$rootScope', '$state', function($rootScope, $state) {
  return {
    back: function() {
      if ($rootScope.$previousState) {
        console.log('previousState', $rootScope.$previousState)
        if ($rootScope.$previousState.name == 'signup') {
          $state.go('tabs.map', {}, {reload: true});
        } else {
          $state.go($rootScope.$previousState.name, {}, {reload: true});
        }
      } else {
        $state.go('tabs.map', {}, {reload: true});
      }
    }
  }
}])