'use strict'
angular.module('main')
.factory('GoogleAnalytics', function ($cordovaGoogleAnalytics, $log) {

  var TAG = 'AnalyticsService';

  var canTrack = false;

  return {
    init: function (trackingId) {
      if (trackingId !== null && trackingId !== '' && window.cordova) {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId(trackingId);
        canTrack = true;
      } else {
        $log.warn('[' + TAG + ']: Invalid Tracker ID or not using emulator');
      }
    },

    trackView: function (viewName) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackView(viewName);
      }
    },

    trackEvent: function (category, action, label) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackEvent(category, action, label);
      }
    },
    trackException: function (description, isFatal) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackException(description, isFatal)
      }
    }
  };
});
