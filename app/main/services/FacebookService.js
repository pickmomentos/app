'use strict';

angular.module('main')
.service('Facebook', function ($q, $cordovaFacebook) {

  return {
    getCurrentUser: function () {

      var defer = $q.defer();

      $cordovaFacebook.getLoginStatus().then(function (success) {
        defer.resolve(success);
      }, function (error) {
        defer.reject(error);
      });

      return defer.promise;
    },

    logIn: function () {

      var defer = $q.defer();

      if (window.cordova) {

        $cordovaFacebook.login(['public_profile', 'email'])
        .then(function (success) {
          defer.resolve(success);
        }, function (error) {
          console.error(error.errorMessage);
          defer.reject(error);
        });

      } else {
        alert('error');
      }

      return defer.promise;
    },

    logOut: function () {

      var defer = $q.defer();

      $cordovaFacebook.logout().then(function (success) {
        defer.resolve(success);
      }, function (error) {
        defer.reject(error);
      });

      return defer.promise;
    },

    me: function () {

      var defer = $q.defer();

      if (window.cordova) {

        $cordovaFacebook.api(
          'me?fields=name,first_name,last_name,gender,email',
          ['public_profile']
        ).then(function (success) {
          defer.resolve(success);
          console.error(success);
        }, function (error) {
          console.error(error);
          defer.reject(error);
        });

      }

      return defer.promise;
    },
  };
	});
