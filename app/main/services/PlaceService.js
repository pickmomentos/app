'use strict';
angular.module('main').factory('Place', function ($q, $localStorage, $http, Config, $log) {

  var Places = [];
  return {

    // Class methods
    get: function (id) {
      var defer = $q.defer();

      $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'cons/ws_lugares_por_id_diferencial?args[0]=' + id).then(function (response) {
        if (response.statusText === 'OK') {
          if (response.data.length > 0) {
            Places = response.data;
            $log.log(response.data);
            // Places = this.getSiteNearme(Places);

          }
        }
        defer.resolve(Places);
      });
      return defer.promise;
    },

    getDistance: function (position) {
      $log.log(position);
      $log.log('position');
      var point = {
        latitude: position.latitude,
        longitude: position.longitude
      };
      $log.log(point);
      if ($localStorage.unit === 'km') {
        return this.get('location').kilometersTo(point).toFixed(2);
      } else {
        return this.get('location').milesTo(point).toFixed(2);
      }
    },

  };
});
