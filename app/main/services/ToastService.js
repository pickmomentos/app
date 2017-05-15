'use strict';
angular.module('main').service('Toast', function ($cordovaToast, $ionicPopup, $log) {
  return {
    show: function (msg) {
      if (window.cordova) {
        $cordovaToast.show(msg, 'short', 'bottom')
          .then(function (success) {
            $log.log(success);
          }, function (error) {
            $log.log(error);
          });
      } else {
        $ionicPopup.alert({
          title: 'Alert',
          template: msg,
          okType: 'button button-clear button-assertive',
        });
      }
    }
  };
});
