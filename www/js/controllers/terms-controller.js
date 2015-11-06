angular.module('stuffmobile')
.controller('TermsCtrl', ['$scope', 'BackService', function($scope, BackService){
  $scope.back = function() {
    BackService.back();
  }
}])