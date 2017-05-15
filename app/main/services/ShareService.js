'use strict';
angular.module('main')
.service('Share', function ($cordovaSocialSharing, User, Config, $q, $http, $log) {

  var TAG = 'ShareService';
  var defer = $q.defer();
  var token = User.getLocalVariable('token');
  var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_compartir';
  return {
    sharePlace: function (place, uid, nid) {
      $log.log(place);
      $log.log(place.imagen[0]);
      if (window.cordova && place) {
        $cordovaSocialSharing
        .share(place.titulo, null, place.imagen[0], place.web)
        .then(function (result) {
          $log.log(result);

          $http({
            method: 'POST',
            url: Url,
            dataType: 'json',
            crossDomain: true,
            data: {
              'uid': uid,
              'nid': nid,
              'canal': 0
            },
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': token
            }
          })
          .success(function (data) {
            $log.log(data);
            $log.log('star');
            defer.resolve(data);
          })
          .error(function (data) {
            $log.log('no inicio session');
            $log.log(data);
            defer.reject(data);
          });
          return defer.promise;
        }, function (err) {
          console.warn(err);
          return defer.promise;
        });
      } else {
        console.warn('[' + TAG + '] Unsupported platform');
        return defer.promise;
      }
    },
    sharePlaceFacebook: function (place, uid, nid) {
      $log.log(place);
      $log.log(place.imagen[0]);
      if (window.cordova && place) {
        $cordovaSocialSharing
        .shareViaFacebook(place.titulo, null, place.imagen[0], place.web)
        .then(function (result) {
          $log.log(result);
          var defer = $q.defer();
          var token = User.getLocalVariable('token');
          var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_compartir';
          $http({
            method: 'POST',
            url: Url,
            dataType: 'json',
            crossDomain: true,
            data: {
              'uid': uid,
              'nid': nid,
              'canal': 0
            },
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': token
            }
          })
          .success(function (data) {
            $log.log(data);
            $log.log('star');
            defer.resolve(data);
          })
          .error(function (data) {
            $log.log('no inicio session');
            $log.log(data);
            defer.reject(data);
          });
          return defer.promise;
        }, function (err) {
          console.warn(err);
          return defer.promise;
        });
      } else {
        console.warn('[' + TAG + '] Unsupported platform');
        return defer.promise;
      }
    },
    sharePlaceWhastapp: function (place, uid, nid) {
      $log.log(place);
      $log.log(place.imagen[0]);
      if (window.cordova && place) {
        $cordovaSocialSharing
        .shareViaWhatsApp(place.titulo, null, place.imagen[0], place.web)
        .then(function (result) {
          $log.log(result);
          var defer = $q.defer();
          var token = User.getLocalVariable('token');
          var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_compartir';
          $http({
            method: 'POST',
            url: Url,
            dataType: 'json',
            crossDomain: true,
            data: {
              'uid': uid,
              'nid': nid,
              'canal': 0
            },
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': token
            }
          })
          .success(function (data) {
            $log.log(data);
            $log.log('star');
            defer.resolve(data);
          })
          .error(function (data) {
            $log.log('no inicio session');
            $log.log(data);
            defer.reject(data);
          });
          return defer.promise;
        }, function (err) {
          console.warn(err);
          return defer.promise;
        });
      } else {
        console.warn('[' + TAG + '] Unsupported platform');
        return defer.promise;
      }
    },
    sharePlaceTwitter: function (place, uid, nid) {
      $log.log(place);
      $log.log(place.imagen[0]);
      if (window.cordova && place) {
        $cordovaSocialSharing
        .shareViaTwitter(place.titulo, null, place.imagen[0], place.web)
        .then(function (result) {
          $log.log(result);

          var defer = $q.defer();
          var token = User.getLocalVariable('token');
          var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_compartir';
          $http({
            method: 'POST',
            url: Url,
            dataType: 'json',
            crossDomain: true,
            data: {
              'uid': uid,
              'nid': nid,
              'canal': 0
            },
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': token
            }
          })
          .success(function (data) {
            $log.log(data);
            $log.log('star');
            defer.resolve(data);
          })
          .error(function (data) {
            $log.log('no inicio session');
            $log.log(data);
            defer.reject(data);
          });
          return defer.promise;

        }, function (err) {
          console.warn(err);
          return defer.promise;
        });
      } else {
        console.warn('[' + TAG + '] Unsupported platform');
        return defer.promise;
      }
      return defer.promise;
    }
  };
});
