var dateFromParam;
var dateToParam;

$(function() {
  var fromInput = $( "#dateFrom" );
  var toInput = $("#dateTo");

  fromInput.datepicker({
    dateFormat: "dd M yy",
    onSelect: function(date, inst) {
      var fromDate = new Date(date);
      dateFromParam = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
      
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
      dateToParam = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
    }
  });

  var dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() + 1);
  var dateTo = new Date();
  dateTo.setDate(dateTo.getDate() + 4);
  fromInput.datepicker("setDate", dateFrom);
  toInput.datepicker("setDate", dateTo);

  dateFromParam = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
  dateToParam = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

  dateFrom.setDate(dateFrom.getDate() + 1);
  toInput.datepicker("option", "minDate", dateFrom);
});
