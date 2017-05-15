'use strict';
angular.module('main').service('Preferences', function ($q, $http, Config, User, $log) {


  var PreferencesList = [];
  return {
    // Consulta Preferencias
    getPreferences: function (forceLoading) {
      var defer = $q.defer();

      if (forceLoading === true) {
        // Llama al webservice para obtener la lista de preferencias

        $http.get(Config.ENV.SERVER_URL_CONSULTA  + 'cons/ws_preferencia_usuario.json').then(function (response) {
          if (response.data.length > 0) {
            $log.log('cargo nuevo');
            User.setLocalVariable('Preferencias', angular.toJson(response.data));
            PreferencesList = response.data;
            $log.log(response);
            defer.resolve(PreferencesList);
          }
        });
      } else {
        $log.log('cargo viejo');

        PreferencesList = angular.fromJson(User.getLocalVariable('Preferencias'));
        $log.log(PreferencesList);
        defer.resolve(PreferencesList);
      }
      return defer.promise;

    }

  };

  // this.getList = function(forceLoading) {
  //   var defer = $q.defer();
  //
  //   var lastLoading = parseInt( getLocalVariable('lastLoading1') );
  //   // Si no hay un valor anterior, asumir que es cero
  //   if (isNaN(lastLoading)){
  //     lastLoading = 0;
  //   }
  //
  //   // Obtiene la fecha y hora actual en milisegundos (desde 1970)
  //   var currentTime = new Date().getTime();
  //
  //   // Calcula la fecha de expiración de la información a 3 horas desde la última vez
  //   var expirationTime = lastLoading + (3600 * 3 * 1000);
  //
  //   // Si se tiene una fecha de carga anterior y el tiempo de la última carga
  //   // ya expiró, se forza la carga de información desde la web.
  //   if (lastLoading === 0 || currentTime > expirationTime){
  //     forceLoading = true;
  //   }
  //
  //   if (forceLoading){
  //     // Llama al webservice para obtener la lista de preferencias
  //
  //     $http.get(WebservicesURL + '/cons/ws_preferencia_usuario.json').
  //     then(function(response) {
  //       if (response.data.length > 0) {
  //         setLocalVariable('preferences', angular.toJson(response.data));
  //         setLocalVariable('lastLoading1', currentTime);
  //         this.eventsList = response.data;
  //         defer.resolve(response.data);
  //       }
  //     });
  //   } else {
  //     this.eventsList = angular.fromJson(getLocalVariable('preferences'));
  //     defer.resolve(this.eventsList);
  //   }
  //   return defer.promise;
  // };
  //
});
