var dateFromParam;
var dateToParam;

$(function() {
  var fromInput = $( "#dateFrom" );
  var toInput = $("#dateTo");

  fromInput.datepicker({
    dateFormat: "dd M yy",
    onSelect: function(date, inst) {
      var fromDate = new Date(date);
      dateFromParam = fromDate.getFullYear() + "-" + fromDate.getMonth() + "-" + fromDate.getDate();
      
      var toDate = new Date(toInput.datepicker("getDate"));
      if(fromDate >= toDate) {
        toDate.setDate(fromDate.getDate() + 1);
        toInput.datepicker("setDate", toDate);
      }
      fromDate.setDate(fromDate.getDate() + 1);
      toInput.datepicker("option", "minDate", fromDate);
    }
  });
  toInput.datepicker({
    dateFormat: "dd M yy",
    onSelect: function(date, inst) {
      var toDate = new Date(date);
      dateToParam = toDate.getFullYear() + "-" + toDate.getMonth() + "-" + toDate.getDate();
    }
  });

  var dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() + 1);
  var dateTo = new Date();
  dateTo.setDate(dateTo.getDate() + 4);
  fromInput.datepicker("setDate", dateFrom);
  toInput.datepicker("setDate", dateTo);

  dateFrom.setDate(dateFrom.getDate() + 1);
  toInput.datepicker("option", "minDate", dateFrom);

  dateFromParam = dateFrom.getFullYear() + "-" + dateFrom.getMonth() + "-" + dateFrom.getDate();
  dateToParam = dateTo.getFullYear() + "-" + dateTo.getMonth() + "-" + dateTo.getDate();
});
