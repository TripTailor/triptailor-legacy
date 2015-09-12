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

      hostels.getResultsDate(dateFromParam, dateToParam);
    }
  });
  toInput.datepicker({
    dateFormat: "dd M yy",
    onSelect: function(date, inst) {
      var toDate = new Date(date);
      dateToParam = toDate.getFullYear() + "-" + toDate.getMonth() + "-" + toDate.getDate();

      hostels.getResultsDate(dateFromParam, dateToParam);
    }
  });

  var dateFrom = new Date(getQueryValue("date-from"));
  var dateTo = new Date(getQueryValue("date-to"));
  fromInput.datepicker("setDate", dateFrom);
  toInput.datepicker("setDate", dateTo);

  dateFromParam = dateFrom.getFullYear() + "-" + dateFrom.getMonth() + "-" + dateFrom.getDate();
  dateToParam = dateTo.getFullYear() + "-" + dateTo.getMonth() + "-" + dateTo.getDate();

  dateFrom.setDate(dateFrom.getDate() + 1);
  toInput.datepicker("option", "minDate", dateFrom);
});
