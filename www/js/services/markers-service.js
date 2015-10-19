angular.module('stuffmobile')
.factory('PostsService', ['$http', 'ApiEndpoint', '$q', function($http, ApiEndpoint, $q) {
 
  var posts = [];
 
  var getPosts = function(box){
      var url =  ApiEndpoint.url + "/posts/geolocated";
      return $http({
        url: url,
        params: box
      }).then(function(response, err){
        if (err) {
          console.log('error ', err);
          return err;
        }
          posts = response.data.posts;
          return posts;
      });
  }
  var getInfoWindow = function(posts) {
    var innerContent = "<div ><div id='siteNotice' class='stuff-map-image'></div> <img src=" +
           posts.image_url + " width='200px' ></img> <div id='bodyContent'> <p>" +
           posts.description + "</p> </div> </div> </div>";
    return new google.maps.InfoWindow({
      content: innerContent
    })
  }

  var getLoadedPosts = function() {
    var deffered = $q.defer();
    if (posts.length > 0) {
      deffered.resolve(posts);
    }
    return deffered.promise
  }

  return {
    getPosts: getPosts,
    getInfoWindow: getInfoWindow,
    getLoadedPosts: getLoadedPosts
  }
  
}])