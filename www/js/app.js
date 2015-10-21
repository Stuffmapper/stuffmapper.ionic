// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('stuffmobile', ['ionic', 'ngCordova', 'ngResource'])
.constant('ApiEndpoint', {
  // url: 'http://stuffmapper.com/api'
  url: 'https://blooming-eyrie-8909.herokuapp.com/api'
})

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    //keeps track of previous state
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.$previousState = from;
    });

  });
})
.config(function($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider) {
 
  $stateProvider
  .state('tabs', {
    url: '/tabs',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tabs.map', {
    url: '/get',
    views: {
      'get-tab': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl',
        controllerAs: 'mapctrl'     
      }
    }
  })
  .state('tabs.givestuff', {
    url: '/givestuff',
    views: {
      'give-tab': {
        templateUrl: 'templates/give-stuff.html',
        controller: 'StuffCtrl',
        controllerAs: 'stuffctrl'     
      }
    }
  })   
  .state('tabs.mystuff', {
    url:'/mystuff',
    views: {
      'my-tab': {
        templateUrl: 'templates/my-stuff.html',
        controller: 'MyCtrl',
        controllerAs: 'myCtrl'
      }
    }
  })
  .state('details', {
    url:'/details/:id',
    views: {
      templateUrl: 'templates/details.html',
      controller: 'DetailCtrl',
      controllerAs: 'detailCtrl'
    }
  })
  .state('user', {
    url: '/user',
    templateUrl: 'templates/login.html',
    controller: 'UserCtrl',
    controllerAs: 'userCtrl'
  })
  .state('signup', {
    url:'/signup',
    templateUrl: 'templates/sign-up.html',
    controller: 'SignupCtrl',
    controllerAs: 'signupCtrl'
  })



  $urlRouterProvider.otherwise("/tabs/get");
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|cdvfile|content):|data:image\//); 

  // read CSRF token
  var token = $("meta[name=\"csrf-token\"]").attr("content")

  // include token in $httpProvider default headers
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = token
  $httpProvider.interceptors.push('AuthInterceptor')
});
