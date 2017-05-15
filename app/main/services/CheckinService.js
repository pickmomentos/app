'use strict';
angular.module('main').factory('Checkin', function ($q, $localStorage, $http, Config, User, $log) {

  var Checkin = [];
  return {

    //FUNCION PARA OBTENER LOS LUGARES
    all: function (params) {
      $log.log(params);
      var defer = $q.defer();

      // Llama al webservice para obtener la lista de checkin

      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_checkin_usuario?args[0]=' + params.uid).then(function (response) {
        $log.log(response.data);
        Checkin = response.data;
        defer.resolve(Checkin);
      });
      return defer.promise;
    },

    checkin: function (uid, nid, texto, estado, fid) {
      $log.log(uid);
      $log.log(estado);
      $log.log(nid);
      $log.log(texto);
      $log.log(fid);
      var defer = $q.defer();

      var token = User.getLocalVariable('token');
      var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_checkin';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: {
          'uid': uid,
          'nid': nid,
          'texto': texto,
          'estado': estado,
          'fid': fid
        },
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
    }

  };
});
