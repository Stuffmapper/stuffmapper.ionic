// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('stuffmobile', ['ionic', 'ngCordova', 'ngResource', 'ngIOS9UIWebViewPatch'])
.constant('ApiEndpoint', {
  // url: "http://blooming-eyrie-8909.herokuapp.com/api"
  url: '/api'
})

.run(function($ionicPlatform, $rootScope, $ionicLoading, $state) {
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
  $rootScope.$on('loading:show', function() {
    if ($state.current.name != "tabs.mystuff") {
      $ionicLoading.show({delay: 1000, template: '<ion-spinner icon="ripple"></ion-spinner>', noBackdrop: true})
    }
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  })
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
    },
    cache: false,
  })
  .state('tabs.givestuff', {
    url: '/givestuff',
    views: {
      'give-tab': {
        templateUrl: 'templates/give-stuff.html',
        controller: 'GiveCtrl',
        controllerAs: 'givectrl'     
      }
    },
    cache: false,
  })   
  .state('tabs.mystuff', {
    url:'/mystuff',
    views: {
      'my-tab': {
        templateUrl: 'templates/my-stuff.html',
        controller: 'MyCtrl',
        controllerAs: 'myCtrl'
      }
    },
    cache: false,
  })
  .state('details', {
    url:'/details/:id',
    templateUrl: 'templates/details.html',
    controller: 'DetailCtrl',
    controllerAs: 'detailCtrl',
    cache: false
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
  .state('terms', {
    url: '/terms',
    templateUrl: 'templates/terms.html',
    controller: 'TermsCtrl'
  })
  .state('policy', {
    url: '/policy',
    templateUrl: 'templates/policy.html',
    controller: 'TermsCtrl'
  })



  $urlRouterProvider.otherwise("/tabs/get");
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|cdvfile|content):|data:image\//); 

  // read CSRF token
  var token = $("meta[name=\"csrf-token\"]").attr("content")

  // include token in $httpProvider default headers
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = token
  $httpProvider.interceptors.push('AuthInterceptor')
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      },
      responseError: function(error) {
        $rootScope.$broadcast('loading:hide')
        throw error
      }
    }
  })
});
