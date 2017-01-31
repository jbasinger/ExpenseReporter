angular.module('app.services').factory('GoogleApi',function($q){

  var SHEETS_API_URL = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

  var CLIENT_ID = '638306190341-4eld5h1p7g7h35v51v0gfgiu45i0ea9n.apps.googleusercontent.com';

  var SHEET_MIME_TYPE = 'application/vnd.google-apps.spreadsheet';

  var SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive'
  ];

  var srv = {
    ERROR: {
      FILE_NOT_FOUND: 0
    }
  };

  srv.isAuthorized = function() {

    var def = $q.defer();

    var authData = {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    };

    gapi.auth.authorize(authData, function(result){
        if(result && !result.error){

          $q.all([loadDriveApi(), loadSheetsApi()]).then(function(){
            def.resolve(result);
          }, function(reason){
            def.reject(reason);
          })

        } else {
          def.reject(result);
        }
    });

    return def.promise;
  };

  srv.getSheetValuesByIdAndRange = function(id,range){

    var def = $q.defer();

    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: range,
    }).then(function(response) {
      var range = response.result;
      def.resolve(range.values);
    }, def.reject);

    return def.promise;
  }

  srv.getSheetValuesByWorksheetNameAndRange = function(name,range){

    var def = $q.defer();
    var self = this;

    self.getSheetByName(name).then(function(file){
      self.getSheetValuesByIdAndRange(file.id,range).then(def.resolve);
    },def.reject);

    return def.promise;
  }

  srv.getSheetByName = function(name){

    var self = this;
    var def = $q.defer();
    var query = 'name contains "' + name + '" and mimeType = "application/vnd.google-apps.spreadsheet"'

    var request = gapi.client.drive.files.list({
      'pageSize': 50,
      'fields': "nextPageToken, files(id, name)",
      'q': query
    });

    request.execute(function(resp) {

      var files = resp.files;

      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if(file.name == name){
            def.resolve(file);
            return;
          }
        }
      }

      def.reject(self.ERROR.FILE_NOT_FOUND);

    });

    return def.promise;
  }

  srv.copyFileWithIdToName = function(id, name){

    var def = $q.defer();

    var body = {'name': name};
    var request = gapi.client.drive.files.copy({
       'fileId': id,
       'resource': body
    });

    request.execute(function(resp) {
      def.resolve(resp.id);
    });

    return def.promise;
  }

  srv.batchUpdateSheetById = function(id,body){
    var def = $q.defer();
    gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: id,
      valueInputOption: 'USER_ENTERED',
      data: body
    }).then(def.resolve,def.reject);
    return def.promise;
  }

  function loadDriveApi(){
    var def = $q.defer();
    gapi.client.load('drive', 'v3', function(){
      def.resolve();
    });
    return def.promise;
  }

  function loadSheetsApi(){
    var def = $q.defer();
    gapi.client.load(SHEETS_API_URL).then(function(){
      def.resolve();
    });
    return def.promise;
  }

  return srv;

});
