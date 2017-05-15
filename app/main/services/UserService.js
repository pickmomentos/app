'use strict';
/* global Parse */

angular.module('main').service('User', function ($q, $http, Config, $window, $log) {
  var currentUser;
  return {
    // funcion para guardar los localstroage
    setLocalVariable: function (id, value) {
      var storage = window.localStorage;
      storage.setItem(id, value);
      return true;
    },
    //Funcion para obtener los localStorage
    getLocalVariable: function (id) {
      var storage = window.localStorage;
      var response = storage.getItem(id);
      $log.log(storage);
      if (response === null || response === undefined) {
        response = '';
      }
      return response;
    },
    //Helper function to return user
    getLoggedUser: function () {
      currentUser = $window.localStorage.getItem('user');
      if (currentUser !== '') {
        return currentUser;
      }
      return currentUser;
    },
    // Validate user session
    IsLoggedUser: function () {
      currentUser = $window.localStorage.getItem('user');
      if (currentUser !== '') {
        return true;
      } else {
        return false;
      }
    },
    /*
    * Token against the Drupal Service API
    * @return {Promise}
    */
    getToken: function () {
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: Config.ENV.SERVER_URL_CONSULTA + 'services/session/token',
        dataType: 'json',
        crossDomain: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .success(function (data) {
        defer.resolve(data);
        $log.log(data);
        $log.log('entro token');
      })
      .error(function (data) {
        defer.reject(data);
      });
      return defer.promise;
    },

    /*
    * Login against the Drupal Service API
    * @param  {Object} Data(username, password)
    * @param  {String} token
    * @return {Promise}
    */
    signIn: function (data, token) {
      var defer = $q.defer();

      var loginUrl = Config.ENV.SERVER_URL_REGISTRO + 'api/registro/user/login';
      $http({
        method: 'POST',
        url: loginUrl,
        dataType: 'json',
        crossDomain: true,
        data: {
          username: data.username,
          password: data.password
        },
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (user) {
        $log.log('inicio session');
        defer.resolve(user);
      })
      .error(function (user) {
        $log.log('no inicio session');
        defer.reject(user);
      });
      return defer.promise;
    },

    /*
    * New Password against the Drupal Service API
    * @param  {String} email/user
    * @return {Promise}
    */
    recoverPassword: function (email) {

      var defer = $q.defer();
      var url = Config.ENV.SERVER_URL_REGISTRO + 'api/registro/user/request_new_password';
      $http({
        method: 'POST',
        url: url,
        dataType: 'json',
        crossDomain: true,
        data: {
          name: email
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .success(function (data, status, headers, config) {
        defer.resolve(data);
        $log.log(status);
        $log.log(headers);
        $log.log(config);
      }).error(function (data) {
        defer.reject(data);
      });
      return defer.promise;
    },
    /*
    * Registro de usuario
    * @param  {Object} data
    * @return {Promise}
    */
    signUp: function (data) {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: Config.ENV.SERVER_URL_REGISTRO + 'api/registro/user/register',
        dataType: 'json',
        crossDomain: true,
        data: {
          'name': data.username,
          'pass': data.password,
          'mail': data.email,
          'field_nombres': {'und': [{'value': data.name}]},
          'field_fecha_nacimiento': {'und': [{'value': data.birth}]}
        },
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .success(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.resolve(data);
      })
      .error(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.reject(data);
      });
      return defer.promise;
    },
    setUserData: function (key, value) {
      $window.localStorage[key] = value;
    },

    //Get the currentUser data
    getUserData: function (key) {
      return $window.localStorage[key] || '{}';
    },

    setSessionCookie: function () {
      $http.defaults.headers.post = { 'Cookie': this.getSessionCookie(), 'Set-Cookie': this.getSessionCookie()};
      document.cookie = this.getSessionCookie();
    },
    getSessionCookie: function () {
      var SessionName = this.getLocalVariable('session_name');
      var SessionId = this.getLocalVariable('sessid');
      var CookieVal = '';

      CookieVal = SessionName + '=' + SessionId;

      return CookieVal;
    },

    /*
    * Registro de usuario con facebook
    * @param  {Object} authData
    * @param  {Object} data
    * @return {Promise}
    */
    signInViaFacebook: function (authData, data) {

      var expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + authData.authResponse.expiresIn);
      expiration = expiration.toISOString();
      if (data.gender === 'male') {
        data.gender = 0;
      }
      if (data.gender === 'female') {
        data.gender = 1;
      }
      var userSocial = {
        'type': 'facebook',
        'data': {
          'name': data.name,
          'email': data.email,
          'field_nombres': data.first_name,
          'field_apellidos': data.last_name,
          'field_fecha_nacimiento': '',
          'field_facebook_id': data.id,
          'field_genero': data.gender,
          'field_imagen_url': 'http://graph.facebook.com/' + data.id + '/picture?type=large',
        }
      };
      $log.log(userSocial);
      var defer = $q.defer();

      $http({
        method: 'POST',
        url: Config.ENV.SERVER_URL_REGISTRO + 'api/registro/app_login',
        dataType: 'json',
        crossDomain: true,
        data: userSocial,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .success(function (data1, status, headers, config) {
        $log.log(data1.data);
        $log.log(data1.status);
        $log.log(data1.message);
        if (data1.status === '2') {
          // User.update(data);
        }
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.resolve(data1);
      })

      .error(function (data1, status, headers, config) {
        $log.log(data1);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.reject(data1);
      });
      return defer.promise;
    },


    //Actualizar user
    update: function (data) {
      var defer = $q.defer();
      $http({
        method: 'PUT',
        url: Config.ENV.SERVER_URL_REGISTRO + 'api/registro/user/update',
        dataType: 'json',
        crossDomain: true,
        data: {
          'field_nombres': {'und': [{'value': data.name}]},
          'field_apellidos': {'und': [{'value': data.lastname}]},
          'field_facebook_id': {'und': [{'value': data.facebook_id}]},
          'field_genero': {'und': data.gender},
          'field_imagen_url': {'und': [{'value': data.picture}]}
          // 'field_fecha_nacimiento': {'und': [{'value': data.birth}]}
        },
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .success(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.resolve(data);
      })

      .error(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.reject(data);
      });
      return defer.promise;
    },
    // Update with facebookAuthData
    updateWithFacebookData: function (data, uid, token) {
      $log.log('facebook dtaa para actualizar');
      $log.log(data);
      if (data.gender === 'male') {
        data.gender = 1;
      } else {
        data.gender = 0;
      }
      var  dat = {
        'uid': uid,
        'field_nombres': {'und': [{'value': data.first_name}]},
        'field_apellidos': {'und': [{'value': data.lastname}]},
        'field_facebook_id': {'und': [{'value': data.id}]},
        'field_genero': {'und': data.gender},
        'field_imagen_url': {'und': [{'value': 'http://graph.facebook.com/' + data.id + '/picture?type=large'}]}
      };
      var defer = $q.defer();
      $http({
        method: 'PUT',
        url: Config.ENV.SERVER_URL_REGISTRO + 'rest/user/' + uid,
        dataType: 'json',
        crossDomain: true,
        data: angular.toJson(dat),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.resolve(data);
      })

      .error(function (data, status, headers, config) {
        $log.log(data);
        $log.log('error');
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.reject(data);
      });

      return defer.promise;
    },

    //Actualizar user preferences
    updatePreferences: function (data, token) {
      var defer = $q.defer();

      $http({
        method: 'PUT',
        url: Config.ENV.SERVER_URL_REGISTRO + 'rest/app_user/' + data.uid + '/' + angular.toJson(data),
        dataType: 'json',
        crossDomain: true,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.resolve(data);
      })

      .error(function (data, status, headers, config) {
        $log.log(data);
        $log.error('Status: ' + status);
        $log.error('Headers: ' + headers);
        $log.error('Config: ' + config);
        defer.reject(data);
      });
      return defer.promise;
    },
    //retrieve user
    getCurrentUser: function (uid, token) {
      var defer = $q.defer();
      // this.setSessionCookie();
      $http.get(
        Config.ENV.SERVER_URL_REGISTRO + 'rest/user/' + uid + '.json',
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
            'Set-Cookie': this.getSessionCookie()
          },
          // xsrfCookieName: this.getSessionCookie()
        })
        .success(function (data) {
          defer.resolve(data);
          $log.log(data);
          $log.log('entro nuevp user');
        })
        .error(function (data) {
          defer.reject(data);
          $log.log('no entro nuevo user');
        });
      return defer.promise;
    },
    getPublicData: function () {

      var defer = $q.defer();

      var query = new Parse.Query('UserData');
      query.equalTo('user', Parse.User.current());
      query.first().then(function (userData) {

        if (userData) {
          defer.resolve(userData);
        } else {
          defer.reject(Parse.Promise.error({
            code: 1,
            message: 'User Data not found'
          }));
        }
      }, function (error) {
        defer.reject(error);
      });

      return defer.promise;
    },
    //logout
    logOut: function (token, uid) {
      $log.log(uid);
      $log.log(token);
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: Config.ENV.SERVER_URL_REGISTRO + 'rest/user/logout.',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'X-CSRF-Token': token
        }
      })
      .success(function (data, status, headers, config) {
        defer.resolve();
        $log.log(data);
        $log.log(status);
        $log.log(headers);
        $log.log(config);
      })
      .error(function (data, status, headers, config) {
        $log.log('no cerro');
        $log.log(data);
        $log.log(status);
        $log.log(headers);
        $log.log(config);
        defer.reject(data);
      });

      return defer.promise;
    },
    // Versionador de  usuario
    version: function () {
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: Config.ENV.SERVER_URL_CONSULTA + 'cons/app_control_version/retrieve',
        dataType: 'json',
        crossDomain: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .success(function (data) {
        defer.resolve(data);
        $log.log(data);
        $log.log('entro Versionador');
      })
      .error(function (data) {
        defer.reject(data);
      });
      return defer.promise;

    },
    // Destruir usuario
    destroy: function () {
      var defer = $q.defer();
      Parse.User.current().destroy().then(function () {
        defer.resolve();
      }, function () {
        defer.reject();
      });
      return defer.promise;
    },
    // Actualizar foto
    setPhoto: function (parseFile) {
      var defer = $q.defer();

      var user = Parse.User.current();
      user.set({'photo': parseFile});

      user.save(null, {
        success: function (user) {
          defer.resolve(user);
        },
        error: function (user, error) {
          defer.reject(error);
        }
      });

      return defer.promise;
    }
  };
});
