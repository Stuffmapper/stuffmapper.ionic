angular.module('stuffmobile')
.factory('ImageService', ['$q', '$cordovaCamera', 'ApiEndpoint', '$cordovaFileTransfer', 'LocalService', '$http', function($q, $cordovaCamera, ApiEndpoint, $cordovaFileTransfer, LocalService, $http) {

  return {
    takePicture: function() {
      var deffered = $q.defer();
      console.log($cordovaCamera);

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: true
      }
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var imgSrc = "data:image/jpeg;base64," + imageData;
        console.log('image from camera',imgSrc);
        return deffered.resolve(imgSrc)
      }, function(err) {
        console.log('an error occured', err);
        return deffered.reject();
      });

      return deffered.promise;
    },

    selectPicture: function() {
      var deffered = $q.defer();
      var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        quality: 50
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var imgSrc = "data:image/jpeg;base64," + imageData;
        console.log(imgSrc)
        return deffered.resolve(imgSrc);
      }, function(err) {
        console.log('an error occured', err);
        return deffered.reject();
      })
      return deffered.promise;
    },
    uploadPicture: function(picURI, id) {
      console.log('picuri', picURI)
      // var options = new FileUploadOptions();
      var options = {};
      options.fileKey="stuffImage";
      options.chunkedMode = false;
      options.mimType="image/jpeg";
      options.headers = {'Authorization': 'Bearer ' + JSON.parse(LocalService.get('sMToken')).token}
      options.params = {'type': 'post', 'id': '1'}
      var params = {'type': 'post', 'id': id, 'image': picURI}
      return $http.post(ApiEndpoint.url + '/images', params).success(function(data){
        return data;
      }).error(function(err){
        throw err;
      })
      // options.fileName = picURI.substr(picURI.lastIndexOf('/') + 1);
      // console.log(options)
      // $cordovaFileTransfer.upload(ApiEndpoint.url + '/images', picURI, options).then(function(result) {
      //     console.log("SUCCESS: " + JSON.stringify(result.response));
      // }, function(err) {
      //     console.log("ERROR: " + JSON.stringify(err));
      // }, function (progress) {
      //     // constant progress updates
      // });
      // var ft = new FileTransfer();
      // ft.upload(picURI, encodeURI(ApiEndpoint + "/images"), onUploadSuccess, onUploadFail, options);
    }
  }
  //helpers
  function onUploadSuccess() {
    console.log('picture upload success');
  }
  function onUploadFail(error) {
    console.log('failed to upload picture', error);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
  }
}]);