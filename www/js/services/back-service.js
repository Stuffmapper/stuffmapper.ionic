angular.module('stuffmobile')
.factory('BackService', ['$rootScope', '$state', function($rootScope, $state) {
  return {
    back: function() {
      var previous = $rootScope.$previousState.name;
      if ($rootScope.$previousState) {
        console.log('previousState', $rootScope.$previousState)
        if (previous == 'signup' || previous == 'terms' || previous == 'privacy') {
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