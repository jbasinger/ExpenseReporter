angular.module('app.services').factory('Expenses',function($q, GoogleApi){

  var TEMPLATE_SHEET_ID = '1-B2b4mvfcZC1ugQKMVenXNznaR9231xw-NEyDZszToQ';
  var WORKSHEET_NAME_PREFIX = '2017 Expense Report - ';

  var DRIVING_EXPENSE_RANGE = 'Sheet1!A42:H50';
  var DRIVING_EXPENSE_STARTING_ROW = 42;
  var DRIVING_EXPENSE_RANGE_TEMPLATE = 'Sheet1!A<%= row %>:F<%= row %>';

  var srv = {
    ERROR: GoogleApi.ERROR
  };

  function getSheetName(month){
    var monthNumber = +(month)+1;
    var monthString = String('0' + monthNumber.toString()).slice(-2);
    return WORKSHEET_NAME_PREFIX + monthString;
  }

  srv.getMileageExpensesByMonth = function(month){

    var def = $q.defer();

    GoogleApi.getSheetValuesByWorksheetNameAndRange(getSheetName(month), DRIVING_EXPENSE_RANGE).then(function(values){

      var items = [];

      _.each(values,function(item){

        if(item.length == 0 || item[0].length == 0){
          return;
        }

        items.push(new MileageExpense(item));

      });

      def.resolve(items);

    },def.reject);

    return def.promise;

  }

  srv.saveMileageExpensesByMonth = function(expenses, month){
    var def = $q.defer();
    GoogleApi.getSheetByName(getSheetName(month)).then(function(file){

      var batch = [];
      var range = _.template(DRIVING_EXPENSE_RANGE_TEMPLATE);

      _.each(expenses, function(item, index){
        var row = [];
        row.push(moment(item.date).format("L") || "");
        row.push(item.place || "");
        row.push(item.customer || "");
        row.push(item.travel || "");
        row.push(item.to_from || "");
        row.push(item.miles || "");
        batch.push({
          range: range({row: (DRIVING_EXPENSE_STARTING_ROW + index)}),
          values: [row]
        });
      });

      GoogleApi.batchUpdateSheetById(file.id,batch).then(def.resolve,def.reject);

    },def.reject);

    return def.promise;
  }

  srv.createReportForMonth = function(month){
    var def = $q.defer();

    GoogleApi.copyFileWithIdToName(TEMPLATE_SHEET_ID,getSheetName(month)).then(def.resolve,def.reject);

    return def.promise;
  }

  return srv;

});
