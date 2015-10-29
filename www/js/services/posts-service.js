angular.module('stuffmobile')
.factory('PostsService', ['$http', 'ApiEndpoint', '$q', 'Post', function($http, ApiEndpoint, $q, Post) {
 
  var posts = [];
  var myDibs = [];
  var myPosts = [];
  var categories = [
        'Arts & Crafts',
        'Books, Games, Media',
        'Building & Garden Materials',
        'Clothing & Accessories',
        'Electronics',
        'Furniture & Household',
        'General',
        'Kids & Babies',
        'Recreation'
      ]; 
 
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
    var innerContent = "<div class='infowWindowContent'><div ui-sref='details({id:" +
           posts.id + "})' id='siteNotice' class='stuff-map-image'> <img src=" +
           posts.image_url + " width='200px' height='200px'></img> </div><div id='bodyContent'> <p>" +
           posts.title + "</p> </div> </div>";
    return new google.maps.InfoWindow({
      content: innerContent
    })
  }
  var get = function(postId){
    return $http.get(ApiEndpoint.url + '/posts/' + postId)
    .success(function(data){
      return data.post;
    })
    .error(function(err){
      //TEST ME - REJECT NOT TESTED
      throw err;
    })
  }
//gets all of your dibs
//only adds dibbed posts to myDibs array 
//the my Dibs array
  var getMyDibs = function() {
    return $http.get(ApiEndpoint.url + '/my-dibs')
    .then(function(data){ 
        var mydibs = data.data.posts;
        for(var i = 0; i < mydibs.length; i++) {
          if(mydibs[i].currentDib && mydibs[i].status != 'gone' && mydibs[i].status != 'deleted') {
            myDibs.push(new Post(mydibs[i]));
          }
        }
        return myDibs;
      }, function(err){
        throw err;
      }
    )
  }
// gets all of your posts
// only adds new and dibbs posts to 
// myPosts array
  var getMyPosts = function() {
    return $http.get(ApiEndpoint.url + '/my-stuff')
    .then(function(data){
      var myposts = data.data.posts;
      for(var i = 0; i < myposts.length; i++) {
        if(myposts[i].status == 'dibbed' || myposts[i].status == 'new') {
          myPosts.push(new Post(myposts[i]));
        }
      }
      return myPosts;
    }, function(err){
      throw err;
    })
  }


  return {
    getPosts: getPosts,
    get: get,
    getInfoWindow: getInfoWindow,
    getMyPosts: getMyPosts,
    myPosts: myPosts,
    getMyDibs: getMyDibs,
    myDibs: myDibs,
    categories: categories
  }
  
}])