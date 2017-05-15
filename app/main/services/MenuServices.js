'use strict';
angular.module('main').service('Menu', function ($q, $http, Config, User, $log) {
  var currentMenu = [];
  return {

    // Consulta menu
    getMenu: function (forceLoading) {
      var defer = $q.defer();

      if (forceLoading === true) {
        // Llama al webservice para obtener la lista de preferencias

        $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'cons/ws_menu_principal.json').then(function (response) {
          if (response.data.length > 0) {
            $log.log('cargo nuevo');
            User.setLocalVariable('Menu', angular.toJson(response.data));
            currentMenu = response.data;
            $log.log(response);
            defer.resolve(currentMenu);
          }
        });
      } else {
        $log.log('cargo viejo');

        currentMenu = angular.fromJson(User.getLocalVariable('Menu'));
        $log.log(currentMenu);
        defer.resolve(currentMenu);
      }
      return defer.promise;

    }

  };
});
