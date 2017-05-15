'use strict';
angular.module('main').factory('Review', function ($q, $localStorage, $http, Config, User, $log) {

  var Review = [];
  return {

    //FUNCION PARA OBTENER LOS LUGARES
    all: function (nid, uid) {
      var defer = $q.defer();
      // Llama al webservice para obtener los comentarios
      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'cons/ws_votos_por_lugar?args[0]=' + uid + '&args[1]=' + nid).then(function (response) {
        $log.log(response.data);
        Review = response.data;
        defer.resolve(Review);
      });
      return defer.promise;
    },
    isStarred: function (uid, nid) {
      $log.log(uid);
      $log.log(nid);
      var defer = $q.defer();
      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_voto_usuario?args[0]=' + uid + '&args[1]=' + nid).then(function (response) {
        $log.log(response.data);
        if (response.statusText === 'OK') {
          if (response.data.length > 0 ) {
            defer.resolve(response.data[0]);
          } else {
            response = 0;
            defer.resolve(response);
          }
          $log.log(response);
          if (response.statusText === 'OK') {
            $log.log(response.data);
            // return ;
            defer.resolve(response.data);
          }
        }
      });
      return defer.promise;
    },
    star: function (uid, nid, valor, texto) {
      $log.log(uid);
      $log.log(valor);
      $log.log(nid);
      $log.log(texto);
      var defer = $q.defer();

      var token = User.getLocalVariable('token');
      var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_vote';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: {
          'uid': uid,
          'nid': nid,
          'valor': valor,
          'texto': texto
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
    },
  };
});
