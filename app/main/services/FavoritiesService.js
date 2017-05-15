'use strict';
angular.module('main').factory('Favorites', function ($q, $localStorage, $http, Config, User, $log) {

  var Favorites = [];
  return {

    //FUNCION PARA OBTENER LOS LUGARES
    getFavorites: function (params, uid) {
      $log.log(params);
      var defer = $q.defer();

      // Llama al webservice para obtener la lista de checkin

      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'cons/ws_lugar_favorito_por_usuario?args[0]=' + uid).then(function (response) {
        $log.log(response.data);
        Favorites = response.data;
        defer.resolve(Favorites);
      });
      return defer.promise;
    },
    like: function (uid, nid, valor) {
      $log.log(uid);
      $log.log(valor);
      $log.log(nid);
      var defer = $q.defer();

      var token = User.getLocalVariable('token');
      var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_like';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: {
          'uid': uid,
          'nid': nid,
          'valor': valor
        },
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data) {
        $log.log(data);
        $log.log('like');
        defer.resolve(data);
      })
      .error(function (data) {
        $log.log('no inicio session');
        $log.log(data);
        defer.reject(data);
      });
      return defer.promise;
    },
    isLiked: function (uid, nid) {
      $log.log(uid);
      $log.log(nid);
      var defer = $q.defer();
      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_es_lugar_favorito?args[0]=' + uid + '&args[1]=' + nid).then(function (response) {
        $log.log(response.data[0].valor);
        if (response.statusText === 'OK') {
          $log.log(response.data);
          // return ;
          defer.resolve(response.data[0].valor);
        }
      });
      return defer.promise;
    },
  };
});
