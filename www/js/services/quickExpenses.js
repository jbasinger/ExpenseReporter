angular.module('app.services').factory('QuickExpenses',function($window){

  var srv = {};

  var store = $window.localStorage;

  srv.getQuickExpenses = function(){
    var quickExpenses = angular.fromJson(store.getItem('quickExpenses'));
    if(!quickExpenses){
      quickExpenses = {
        mileageExpenses: [],
        itemExpenses: []
      };
    }
    return quickExpenses;
  }

  srv.saveQuickExpenses = function(quickExpenses){
    store.setItem('quickExpenses',angular.toJson(quickExpenses));
  }

  return srv;

});
