"use strict"
module.exports = function name (days) {

  let date = new Date()
  let prevDay, prevMonth, year;

  if( date.getDate() >= days ){
    prevDay = date.getDate()-days;
    if (prevDay == 0)prevDay = 1;
    prevMonth = date.getMonth()+1
  }

  if ( date.getDate() < days ) {
    prevDay = date.getDate()-days
    prevDay = 30 + prevDay
    prevMonth = date.getMonth()
  }

  year = date.getFullYear()

  let after = year +"/"+ prevMonth +"/"+ (prevDay-1 == 0? 1: prevDay-1)
  let before = year +"/"+ 12 +"/"+ 31

  prevDay=prevMonth=year=null;
  return [after, before]
}