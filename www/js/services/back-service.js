angular.module('stuffmobile')
.factory('BackService', ['$rootScope', '$state', function($rootScope, $state) {
  return {
    back: function() {
      if ($rootScope.$previousState) {
        if ($rootScope.$previousState == 'signup') {
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