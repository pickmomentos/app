var getDate = function(timestamp){
    "use strict";

    var today =  new Date();

    if (timestamp !== undefined){
	    today = new Date(timestamp);
    }

    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }

    return (dd+'/'+mm+'/'+yyyy);
};

var getTime = function(timestamp){
  "use strict";

    var today = new Date();
    if (timestamp !== undefined){
	 today = new Date(timestamp);
    }

    var hh = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();

    if(hh<10){
        hh='0'+hh;
    }

    if(min<10){
        min='0'+min;
    }

    if(sec<10){
        sec='0'+sec;
    }

    var timeOfDay = hh+':'+min+':'+sec;

    return timeOfDay;

};


var setLocalVariable = function(id, value) {
    "use strict";

    var storage = window.localStorage;

    storage.setItem(id, value);

    return true;
};

var getLocalVariable = function(id) {
  "use strict";

  var storage = window.localStorage;
  var response = storage.getItem(id);

  if (response === null || response === undefined){
    response = '';
  }

  return response;
};

var toHHMMSS = function (sec_num) {
    "use strict";

    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.round( ( (sec_num - (hours * 3600) - (minutes * 60)) * 100) / 100);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;

    return time;
};

var checkConnection = function(){
  "use strict";

  var status = {
        'type': 'none',
        'online': false,
        'message': ''
      };

  if (window.Connection) {

    // Connection.NONE         No network connection
    // console.log(navigator.connection.type);

    if (navigator.connection.type !== window.Connection.NONE && navigator.connection.type !== 'window.Connection.NONE') {
      status.online = true;

      switch (navigator.connection.type) {
        // WiFi connection
        case window.Connection.WIFI:
        case 'Connection.WIFI':
          status.type= 'wifi';
          break;

        // Cell 2G connection
        case window.Connection.CELL_2G:
        case 'Connection.CELL_2G':
          status.type= '2g';
          break;

        // Cell 3G connection
        // Cell 4G connection
        case window.Connection.CELL_3G:
        case 'Connection.CELL_3G':
        case window.Connection.CELL_4G:
        case 'Connection.CELL_4G':
          status.type= '2g';
          break;
        default:
        // Connection.UNKNOWN    Unknown connection
        // Connection.ETHERNET     Ethernet connection
          status.type= 'ethernet';
          break;
      }
    }
  } else{
    // Si no tiene acceso al objeto de conexión
    var isOffline = 'onLine' in navigator && !navigator.onLine;

    if (!isOffline){
      // Asume que es una conexión permanente
      status.online = true;
      status.type= 'wifi';
    }
  }

  return status;
};
