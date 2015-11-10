angular.module('stuffmobile')
.controller('TermsCtrl', ['$scope', '$state', 'BackService', function($scope, $state, BackService){
  $scope.back = function() {
    $state.go('signup');
  }
}])