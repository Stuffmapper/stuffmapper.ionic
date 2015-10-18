angular.module('stuffmobile')
.factory('AuthInterceptor', [
  '$q', '$injector', function($q, $injector) {
    var LocalService;
    LocalService = $injector.get('LocalService');
    return {
      request: function(config) {
        var token;
        if (LocalService.get('sMToken')) {
          token = JSON.parse(LocalService.get('sMToken')).token;
        }
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          LocalService.unset('sMToken');
        }
        return $q.reject(response);
      }
    };
  }
]);