'use strict';
angular.module('main').service('Toast', function ($ionicPopup, $log, $cordovaToast) {
  return {
    show: function (msg) {
      if (window.cordova) {
        $cordovaToast.show(msg, 'short', 'bottom').then( function (success) {
          $log.log(success);
        }, function (error) {
          $log.log(error);
        });
      } else {
        $ionicPopup.alert({title: 'Mensaje', template: msg, okType: 'button button-clear button-assertive'});
      }
    },
    showPop: function (msg) {
      $ionicPopup.alert({title: 'Mensaje', template: msg, okType: 'button button-clear button-assertive'});
      // }
    }
  };
});
