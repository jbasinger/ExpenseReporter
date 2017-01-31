function MileageExpense(values){

  if(!values || values.length < 8){
    return;
  }

  this.date=moment(values[0],"l");
  this.place=values[1];
  this.customer=values[2];
  this.travel=values[3];
  this.from_to=values[4];
  this.miles=values[5];
  //values[6] is always blank
  this.dollars=parseFloat(values[7]).toFixed(2);

}

MileageExpense.prototype.getDateWithFormat = function(format){
  return moment(this.date).format(format);
}

MileageExpense.prototype.getDayOfWeek = function(){
  return moment(this.date).format('ddd');
}

MileageExpense.prototype.getDayOfMonth = function(){
  return moment(this.date).format('Do');
}
