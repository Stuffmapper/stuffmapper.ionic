angular.module('stuffmobile')
.factory('ChatService', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {
  var getChat = function(dibs) {
    return $http.get(ApiEndpoint.url + '/dibs/' + dibs + '/messages').success(function(data) {
    }).error(function(err) {
      throw err;
    });
  }

  var sendMessage = function(dibs, message) {
    var options = {
      message: {
        body: message
      }
    }
    return $http.post(ApiEndpoint.url + '/dibs/' + dibs + '/messages', options)
      .success(function(data) {
        return data.dibs
      }).error(function(err) {
        throw err;
      })
  }

  var markRead = function(dibs) {
    return $http.post(ApiEndpoint.url + '/dibs/' + dibs + '/markread').success(function(data) {
    }).error(function(err) {
      throw err;
    })
  }

  var getUnread = function(dibs) {
    return $http.get(ApiEndpoint.url + '/dibs/' + dibs + '/unread')
      .success(function(data) {
      })
      .error(function(err) {
        throw err;
      })
  }

  return {
    getChat: getChat,
    sendMessage: sendMessage,
    markRead: markRead,
    getUnread: getUnread
  }
}])