'use strict';
angular.module('main').factory('Category', function ($q, $http, Config, User, $log) {
  var Category = [];
  return {

    // Consulta menu
    all: function (forceLoading) {
      var defer = $q.defer();
      var lastLoading = parseInt( User.getLocalVariable('lastLoadingCategorias') );
      // Si no hay un valor anterior, asumir que es cero
      if (isNaN(lastLoading)) {
        lastLoading = 0;
      }
      // Obtiene la fecha y hora actual en milisegundos (desde 1970)
      var currentTime = new Date().getTime();

      // Calcula la fecha de expiración de la información a 3 horas desde la última vez
      var expirationTime = lastLoading + (3600 * 3 * 1000);

      // Si se tiene una fecha de carga anterior y el tiempo de la última carga
      // ya expiró, se forza la carga de información desde la web.
      if (lastLoading === 0 || currentTime > expirationTime) {
        forceLoading = true;
      }

      if (forceLoading) {

        // Llama al webservice para obtener la lista de preferencias
        $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'cons/ws_home_items').then(function (response) {
          if (response.data.length > 0) {
            Category = response.data;
            User.setLocalVariable('Categorias', angular.toJson(response.data));
            User.setLocalVariable('lastLoadingCategorias', currentTime);
            $log.log(response);
            defer.resolve(Category);
          }
        });
      } else {
        $log.log('cargo viejo');
        Category = angular.fromJson(User.getLocalVariable('Categorias'));
        $log.log(Category);
        defer.resolve(Category);
      }
      return defer.promise;

    }

  };
});
