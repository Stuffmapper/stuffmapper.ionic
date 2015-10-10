angular.module('stuffmobile')
.factory('Posts', function($http, ApiEndpoint) {
 
  var posts = [];
 
  getPosts = function(box){
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
  getInfoWindow = function(posts) {
    var innerContent = "<div ><div id='siteNotice' class='stuff-map-image'></div> <img src=" +
           posts.image_url + " width='200px' ></img> <div id='bodyContent'> <p>" +
           posts.description + "</p> </div> </div> </div>";
    return new google.maps.InfoWindow({
      content: innerContent
    })
  }

  return {
    getPosts: getPosts,
    getInfoWindow: getInfoWindow
  }
  
})