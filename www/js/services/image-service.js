angular.module('stuffmobile')
.factory('ImageService', ['$q', function($q) {

  return {
    takePicture: function() {
      var deffered = $q.defer();
      console.log(navigator);

      var options = {
        quality: 50,
        destinationType: navigator.Camera.DestinationType.DATA_URL,
        sourceType: navigator.Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: navigator.Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      }
      navigator.camera.getPicture(options).then(function(imageData) {
        var imgSrc = "data:image/jpeg;base64," + imageData;
        deffered.resolve(imgSrc)
      }, function(err) {
        console.log('an error occured', err);
      });

      return deffered.promise;
    },

    selectPicture: function() {
      var deffered = $q.defer();
      var options = {
        destinationType: navigator.Camera.DestinationType.FILE_URI,
        sourceType: navigator.Camera.PictureSourceType.PHOTOLIBRARY
      };

      navigator.camera.getPicture(options).then(function(imageUri) {
        return deffered.resolve(imageUri);
      }, function(err) {
        console.log('an error occured', err);
      })
      return deffered.promise;
    }
  }
}]);