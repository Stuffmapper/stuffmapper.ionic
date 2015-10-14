angular.module('stuffmobile')
.factory('ImageService', ['$q', '$cordovaCamera', 'ApiEndpoint', function($q, $cordovaCamera, ApiEndpoint) {

  return {
    takePicture: function() {
      var deffered = $q.defer();
      console.log($cordovaCamera);

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      }
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var imgSrc = "data:image/jpeg;base64," + imageData;
        console.log(imgSrc);
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
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      };

      $cordovaCamera.getPicture(options).then(function(imageUri) {
        console.log(imageUri)
        return deffered.resolve(imageUri);
      }, function(err) {
        console.log('an error occured', err);
        return deffered.reject();
      })
      return deffered.promise;
    },
    uploadPicture: function(picURI) {
      console.log('picuri', picURI)
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.chunkedMode = false;
      options.mimType="image/jpeg";
      var ft = new FileTransfer();
      ft.upload(picURI, encodeURI(ApiEndpoint + "/images"), onUploadSuccess, onUploadFail, options);
    }
  }
  //helpers
  function onUploadSuccess() {
    console.log('picture upload success');
  }
  function onUploadFail(error) {
    console.log('failed to upload picture');
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
  }
}]);