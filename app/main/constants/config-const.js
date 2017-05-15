'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m-ionic#gulp-environment
  ENV: {
    /*inject-env*/
    'SERVER_URL': 'http://dev.pick.com.ec/',
    'SERVER_URL_CHEKIN': 'http://dev.pick.com.ec/',
    'SERVER_URL_REGISTRO': 'http://dev.pick.com.ec/',
    'SERVER_URL_CONSULTA': 'http://dev.pick.com.ec/',
    'SERVER_URL_LOGO': 'main/assets/images/logo.png',
    'parse': {
      'appId': 'DPhH6faffP3XaNctsO7U',
      'serverUrl': 'https://tuhueca.herokuapp.com/parse'
    },
    'push': {
      'appId': null,
      'googleProjectNumber': null
    },
    'admob': {
      'interstitialForAndroid': null,
      'interstitialForiOS': null,
      'bannerId': null
    },
    'gaTrackingId': null,
    'theme': 'default',
    'unit': 'km',
    'mapType': 'normal',
    'statusBarColor': '#1b68ea'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m-ionic#gulp-build-vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});
