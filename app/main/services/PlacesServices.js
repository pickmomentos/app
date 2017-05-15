'use strict';
angular.module('main').factory('Places', function ($q, $localStorage, $http, Config, User, $log) {

  var Places = [];
  return {
    //FUNCION PARA OBTENER LOS LUGARES POR PREFERENCIAS
    allPreferences: function (params) {
      var defer = $q.defer();
      var latitude = params.location.latitude;
      var longitude = params.location.longitude;
      var cons = '';
      if (params.search === '') {
        cons = 'cons/ws_lugares_por_preferencia?args[0]=' + latitude + '&args[1]=' + longitude + '&args[2]=' + params.distance + '&args[3]=' +  params.categoryId + '&page=' +  params.page;
        $http.get(Config.ENV.SERVER_URL_CONSULTA  + cons).then(function (response) {
          $log.log(response);
          if (response.statusText === 'OK') {
            if (response.data.length > 0) {
              Places = response.data;
              angular.forEach(Places, function (obj) {
                $log.log(obj);
                $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_voto_promedio?args[0]=' + obj.id).then(function (response) {
                  obj.rating = response.data;
                });
              });
              defer.resolve(Places);
            } else {
              Places = response.data;
              defer.resolve(Places);
            }
          } else {
            Places = response.data;
            defer.resolve(Places);
          }
        });
      } else {
        cons = 'cons/search_api/indice_de_lugares?keys=' + params.search;
      }

      return defer.promise;
    },
    //FUNCION PARA OBTENER LOS LUGARES OR CATEGORIAS
    allCategories: function (params) {
      var defer = $q.defer();
      var latitude = params.location.latitude;
      var longitude = params.location.longitude;
      var cons = '';
      if (params.search === '') {
        cons = 'cons/ws_lugares_por_categoria?args[0]=' + latitude + '&args[1]=' + longitude + '&args[2]=' + params.distance + '&args[3]=' + params.categoryId + '&page=' +  params.page;
        $http.get(Config.ENV.SERVER_URL_CONSULTA  + cons).then(function (response) {
          $log.log(response);
          if (response.statusText === 'OK') {
            if (response.data.length > 0) {
              Places = response.data;
              angular.forEach(Places, function (obj) {
                $log.log(obj);
                $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_voto_promedio?args[0]=' + obj.id).then(function (response) {
                  obj.rating = response.data;
                });
              });
              defer.resolve(Places);
            } else {
              Places = response.data;
              defer.resolve(Places);
            }
          } else {
            Places = response.data;
            defer.resolve(Places);
          }
        });
      } else {
        cons = 'cons/search_api/indice_de_lugares?keys=' + params.search;
      }
      return defer.promise;
    },
    //FUNCION PARA OBTENER LOS LUGARES POR BUSQUEDAS
    all: function (params) {
      $log.log(params);
      var defer = $q.defer();
      var cons = '';
      var uid = '';
      var general = 'default';
      var latitude = params.location.latitude;
      var longitude = params.location.longitude;
       // BÚSQUEDA POR DATOS INGREADOS
      if (params.type !== ''  && params.search === '') {
        if (params.type === 'preferencias') {
          cons = 'cons/ws_lugares_por_preferencia?args[0]=' + latitude + '&args[1]=' + longitude + '&args[2]=' + params.distance + '&args[3]=' +  params.categoryId + '&page=' +  params.page;
        }
        if (params.type === 'categoria') {
          cons = 'cons/ws_lugares_por_categoria?args[0]=' + latitude + '&args[1]=' + longitude + '&args[2]=' + params.distance + '&args[3]=' + params.categoryId + '&page=' +  params.page;
        }
      }
      if (params.type === '' && params.search !== '') {
        if (params.search && params.search !== '') {
          cons = 'cons/search_api/indice_de_lugares?keys=' + params.search;
          general = 'search';
        }
      }
      if (params.type !== '' && params.search !== '') {
        if (params.search && params.search !== '') {
          cons = 'cons/search_api/indice_de_lugares?keys=' + params.search;
          general = 'search';
        }
      }
      if (params.type === '' && params.search === '') {
        general = 'default';
        uid = User.getLocalVariable('user_id');
        cons = 'cons/ws_lugares_por_preferencia_usuario?args[0]=' + latitude + '&args[1]=' + longitude + '&args[2]=' + params.distance + '&args[3]=' + uid +  '&page=' +  params.page;
      }
      if (params.type === '' && params.search !== '' && params.nodata === true) {
        cons = 'cons/search_api/indice_de_lugares?keys=';
        general = 'search';
      }
      if (params.type !== '' && params.search !== '' && params.nodata === true) {
        cons = 'cons/search_api/indice_de_lugares?keys=';
        general = 'search';
      }

      $log.log(cons);
      $log.log(general);
      if (cons !== '' && general === 'search') {
        // Llama al webservice para obtener la lista de preferencias
        $http.get(Config.ENV.SERVER_URL_CONSULTA  + cons).then(function (response) {
          if (response.statusText === 'OK') {
            $log.log(response);
            if (response.data.result) {
              var valores = [];
              angular.forEach(response.data.result, function (key, value) {
                valores.push(value);
              });
              var cons2 = 'cons/ws_lugares_por_id?args[0]=' + latitude + '&args[1]=' + longitude + '&args[2]=' + params.distance + '&args[3]=' + valores +  '&page=' +  params.page;
              $log.log(cons2);
              $http.get(Config.ENV.SERVER_URL_CONSULTA  + cons2).then(function (response2) {
                $log.log(response2.data);
                Places = response2.data;
                if (!angular.isUndefined(Places)) {
                  if (Places.length > 0) {
                    angular.forEach(Places, function (obj) {
                      $log.log(obj);
                      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_voto_promedio?args[0]=' + obj.id).then(function (response) {
                        obj.rating = response.data;
                      });
                    });
                    defer.resolve(Places);
                  } else {
                    Places = [];
                    defer.resolve(Places);
                  }
                } else {
                  Places = [];
                  defer.resolve(Places);
                }
              });
            } else {
              defer.reject(Places);
            }
          }
        });
      } else if (cons !== '' && general === 'default') {
        // busqueda por default
        $log.log('default');
        $http.get(Config.ENV.SERVER_URL_CONSULTA  + cons).then(function (response) {
          $log.log(response);
          if (response.statusText === 'OK') {
            if (response.data.length > 0) {
              Places = response.data;
              angular.forEach(Places, function (obj) {
                $log.log(obj);
                $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'api/interaccion/ws_t_voto_promedio?args[0]=' + obj.id).then(function (response) {
                  obj.rating = response.data;
                });
              });
              defer.resolve(Places);
            } else {
              Places = response.data;
              defer.resolve(Places);
            }
          } else {
            Places = response.data;
            defer.resolve(Places);
          }
        });
      }
      return defer.promise;

    },

    getDistance: function (position) {

      var point = {
        latitude: position.latitude,
        longitude: position.longitude
      };
      // $log.log(point);
      if ($localStorage.unit === 'km') {
        return this.get('location').kilometersTo(point).toFixed(2);
      } else {
        return this.get('location').milesTo(point).toFixed(2);
      }
    }

  };
});
