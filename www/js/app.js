// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('stuffmobile', ['ionic', 'ngCordova'])
.constant('ApiEndpoint', {
  url: 'http://localhost:3000/api'
})

.run(function($ionicPlatform, Map) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    
  });
})
.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('tabs', {
    url: '/tabs',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tabs.map', {
    url: '/map',
    views: {
      'home-tab': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl',
        controllerAs: 'mapctrl'     
      }
    }

  })  
  .state('user', {
    url: '/user',
    templateUrl: 'templates/login.html',
    controller: 'UserCtrl',
    controllerAs: 'userCtrl'
  })



  $urlRouterProvider.otherwise("/tabs/map");
 
});
