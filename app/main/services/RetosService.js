'use strict';
angular.module('main').factory('Retos', function ($q, $localStorage, $http, Config, User, $log) {

  var Retos = [];
  var RetosP = [];
  return {

    //FUNCION PARA OBTENER LOS LUGARES
    getChallangesById: function (uid) {
      var defer = $q.defer();


      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/retos/retos-consulta-por-id?args[0]=' + uid).then(function (response) {
        $log.log(response.data);
        Retos = response.data;
        defer.resolve(Retos);
      });
      return defer.promise;
    },
    getChallangesProgress: function (uid) {
      var defer = $q.defer();
      var status = 1;
      $log.log(uid);
      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/retos/ws_s_retos_por_usuario?args[0]=' + status + '&args[1]=' + uid).then( function (response) {
        $log.log(response.data);
        RetosP = response.data;
        defer.resolve(RetosP);
      });
      return defer.promise;
    },
    getChallangesComplete: function (uid) {
      var defer = $q.defer();
      var status = 2;
      $log.log(uid);
      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/retos/ws_s_retos_por_usuario?args[0]=' + status + '&args[1]=' + uid).then( function (response) {
        $log.log(response.data);
        RetosP = response.data;
        defer.resolve(RetosP);
      });
      return defer.promise;
    },
    getChallangesCaducado: function (uid) {
      var defer = $q.defer();
      var status = 3;
      $log.log(uid);
      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/retos/ws_s_retos_por_usuario?args[0]=' + status + '&args[1]=' + uid).then( function (response) {
        $log.log(response.data);
        RetosP = response.data;
        defer.resolve(RetosP);
      });
      return defer.promise;
    },
    aceptChallenges: function (uid, rid) {
      $log.log(uid);
      $log.log(rid);
      var defer = $q.defer();

      var token = User.getLocalVariable('token');
      var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/retos/app_suscripcion_retos';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: {
          'uid': uid,
          'rid': rid,
          'estado': '1'
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
    registrarCompra: function (uid, nid) {
      $log.log(uid);
      $log.log(nid);
      var defer = $q.defer();

      var token = User.getLocalVariable('token');
      var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/interaccion/app_registro_compra';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: {
          'uid': uid,
          'nid': nid,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data) {
        $log.log(data);
        defer.resolve(data);
      })
      .error(function (data) {
        $log.log(data);
        defer.reject(data);
      });
      return defer.promise;
    },
    reclamarPremio: function (uid, sid,  nid) {
      $log.log(uid);
      $log.log(sid);
      $log.log(nid);
      var defer = $q.defer();

      var token = User.getLocalVariable('token');
      var Url = Config.ENV.SERVER_URL_REGISTRO + 'api/retos/app_canje_premio';
      $http({
        method: 'POST',
        url: Url,
        dataType: 'json',
        crossDomain: true,
        data: {
          'uid': uid,
          'sid': sid,
          'nid': nid,
        },
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data) {
        $log.log(data);
        defer.resolve(data);
      })
      .error(function (data) {
        $log.log(data);
        defer.reject(data);
      });
      return defer.promise;
    },
  };
});
