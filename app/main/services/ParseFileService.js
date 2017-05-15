'use strict';
angular.module('main').factory('File', function ($q, $http, User, $log) {

  return {

    upload: function (imagen_b64, uid, dir) {

      var defer = $q.defer();
      var nombre_archivo = 'image.jpg';
      var directorio_archivo = 'checkin/' + dir;
      // 'checkin/2017/03/25/';
      var data = {
        'file': {
          'file': imagen_b64,
          'filename': nombre_archivo,
          'filepath': 'public://' + directorio_archivo + nombre_archivo,
          'uid': uid
        }
      };
      var token = User.getLocalVariable('token');
      var Url = 'http://images.pick.com.ec/api/images/in/file';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data) {
        $log.log(data);
        $log.log('Checkin');
        defer.resolve(data);
      })
      .error(function (data) {
        $log.log('no inicio session');
        $log.log(data);
        defer.reject(data);
      });
      return defer.promise;
    },
    loadImage: function (fid) {

      var defer = $q.defer();

      var Url = 'http://images.pick.com.ec/api/images/out/archivo-estilos-por-id?args[0]=' + fid;
      $http.get(Url).then(function (response) {
        $log.log(response);
        defer.resolve(response.data[0]);
      });
      return defer.promise;
    },

  };
});
