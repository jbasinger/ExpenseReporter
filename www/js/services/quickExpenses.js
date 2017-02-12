angular.module('app.services').factory('QuickExpenses',function($window, GoogleApi, $q){

  var TEMPLATE_SHEET_ID = '13Q5BRCVui4E6YNuMZUtol5ypn_LRjeIVJ3g1ZJ76Iqk';
  var SHEET_NAME = 'Expense Reporter - Quick Expenses';
  var MILEAGE_EXPENSE_RANGE_TEMPLATE = 'Mileage!A<%= row %>:C<%= row %>';

  var srv = {
    ERROR: GoogleApi.ERROR
  };

  var store = $window.localStorage;

  srv.getQuickExpenses = function(){

    var self = this;
    var def = $q.defer();

    GoogleApi.getSheetValuesByWorksheetNameAndRange(SHEET_NAME,"Mileage!A2:C50").then(function(range){

      if(!range){
        def.resolve([]);
        return;
      }

      var expenses = [];
      _.each(range, function(row){
        var exp = new MileageExpense();
        exp.place = row[0];
        exp.customer = row[1];
        exp.miles = row[2];
        expenses.push(exp);
      });

      def.resolve(expenses);

    }, def.reject);

    return def.promise;

  }

  srv.saveQuickExpenses = function(quickExpenses){

    var def = $q.defer();
    var del = $q.defer();

    GoogleApi.getSheetByName(SHEET_NAME).then(function(file){
      var range = _.template(MILEAGE_EXPENSE_RANGE_TEMPLATE);
      var batch = [];

      //Complete hack to delete everything and start over if there is a deleted item.
      if(_.any(quickExpenses.mileageExpenses, function(i){return i.deleteMe})){

        _.each(quickExpenses.mileageExpenses, function(item, index){
          var row = [];

          row.push("");
          row.push("");
          row.push("");

          batch.push({
            range: range({row: (2 + index)}),
            values: [row]
          });
        });

        GoogleApi.batchUpdateSheetById(file.id,batch).then(del.resolve,del.reject);

      } else {
        del.resolve();
      }

      del.promise.then(function(){

        var i=0;

        _.each(quickExpenses.mileageExpenses, function(item){

          if(item.deleteMe){
            return;
          }

          var row = [];

          row.push(item.place || "");
          row.push(item.customer || "");
          row.push(item.miles || "");

          batch.push({
            range: range({row: (2 + i)}),
            values: [row]
          });

          i++

        });

        GoogleApi.batchUpdateSheetById(file.id,batch).then(def.resolve,def.reject);

      }, def.reject);

    }, def.reject);

    return def.promise;

  }

  srv.createQuickExpenseSheet = function(){
    return GoogleApi.copyFileWithIdToName(TEMPLATE_SHEET_ID, SHEET_NAME);
  }

  return srv;

});
