angular.module('stuffmobile')
.factory('PolicyService', ['$http', '$ionicPopup', function($http, $ionicPopup){
  var showPrivacy = function() {
    return $http.get('/api/policies/privacy').then(function(data) {
      console.log(data);
      $ionicPopup.alert({title: 'Privacy Policy', template: data});
    })
  }

  var showTerms = function() {
    return $http.get('/api/policies/termsofuse').then(function(data) {
      console.log(data);
      $ionicPopup.alert({title: 'Terms of Use', template: data});
    })
  }

  return {
    showTerms: showTerms,
    showPrivacy: showPrivacy
  }

}])