angular.module('stuffmobile')
.factory('BackService', ['$ionicHistory', '$rootScope', '$state', function($ionicHistory, $rootScope, $state) {
  return {
    back: function() {
      var previous = $ionicHistory.backView().stateName;
      if ($ionicHistory.backView().stateName) {
        console.log('previousState', $ionicHistory.backView().stateName)
        if (previous == 'signup' || previous == 'terms' || previous == 'privacy') {
          $state.go('tabs.map', {}, {reload: true});
        } else {
          $state.go($ionicHistory.backView().stateName, {}, {reload: true});
        }
      } else {
        $state.go('tabs.map', {}, {reload: true});
      }
      // $state.go('tabs.map', {}, {reload: true});
    }
  }
}])