const url = 'http://localhost:5000';

function compare(a, b) {
  return a - b;
}

function getArrayFromObjectKeys(object) {
  const keys = [];
  for (let key in object) {
    if (object.hasOwnProperty(key)) keys.push(key);
  }
  return keys;
}

$.get(url)
  .done((res) => {
    const {employees} = res;
    
    const headings = getArrayFromObjectKeys(employees[0]);
    
    $('<thead><tr></tr></thead>').appendTo($('#table_id'));
    $('<tfoot><tr></tr></tfoot>').appendTo($('#table_id'));
    
    headings.forEach((elem) => {
      if (elem !== '_id') {
        $('#table_id thead tr').append(`<th class="text-capitalize">${elem}</th>`);
        $('#table_id tfoot tr').append(`<td class="text-capitalize">${elem}</td>`);
      }
    });
  });

$(document).ready(function () {
  $.get(url)
    .done((res) => {
      const {employees} = res;
      
      const table = $('#table_id').DataTable({
        data: employees,
        select: true,
        columnDefs: [{targets: 4, type: 'sortMe'}],
        columns: [
          {data: 'firstname'},
          {data: 'lastname'},
          {data: 'email'},
          {data: 'phonenumber'},
          {data: 'birthday_contact'},
          {data: 'company'},
        ],
        initComplete: function () {
          this.api().columns(4).every(function () {
            const column = this;
            const select = $('<select><option value=""></option></select>')
              .appendTo($(column.footer()).empty());
            
            select.append('<option value="day">Day</option>');
            select.append('<option value="month">Month</option>');
            
            select.on('change', function () {
              if ($(this).val() === 'day') {
                $.fn.dataTable.ext.type.order["sortMe-asc"] = function (a, b) {
                  return compare(+a.split('-')[2], +b.split('-')[2]);
                };
                
                $.fn.dataTable.ext.type.order["sortMe-desc"] = function (a, b) {
                  return compare(+b.split('-')[2], +a.split('-')[2]);
                };
              } else if ($(this).val() === 'month') {
                $.fn.dataTable.ext.type.order["sortMe-asc"] = function (a, b) {
                  return compare(+a.split('-')[1], +b.split('-')[1]);
                };
                
                $.fn.dataTable.ext.type.order["sortMe-desc"] = function (a, b) {
                  return compare(+b.split('-')[1], +a.split('-')[1]);
                };
              } else {
                $.fn.dataTable.ext.type.order["sortMe-asc"] = function (a, b) {
                  return compare(Date.parse(a), Date.parse(b));
                };
                
                $.fn.dataTable.ext.type.order["sortMe-desc"] = function (a, b) {
                  return compare(Date.parse(b), Date.parse(a));
                };
              }
              
              table
                .column('4:visible')
                .order('asc')
                .draw();
            });
          });
        }
      });
    });
});
