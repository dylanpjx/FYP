const fs = require("fs");

const sampleData = [
  { id: 1, StudentName: 'Karen', Module: 'ee2033', MatricNo: 'a0101234a', Group: 2, Role:'student', Username: 'karenthia', Password: 'karenthia01' },
  { id: 2, StudentName: 'Bernerd', Module: 'ee3131c', MatricNo: 'a0101234b', Group: 1, Role:'student', Username: 'bernerdtan', Password: 'bernerdtan01' },
  { id: 3, StudentName: 'Thomas', Module: 'ee2033', MatricNo: 'a0101234c', Group: 2, Role:'student', Username: 'thomasbong', Password: 'thomasbong01' },
  { id: 4, StudentName: 'Ken', Module: 'ee4218', MatricNo: 'a0101234d', Group: 2, Role:'student', Username: 'kenlim', Password: 'kenlim01' },
  { id: 5, StudentName: 'Claudia', Module: 'ee2033', MatricNo: 'a0101234e', Group: 3, Role:'student', Username: 'claudiawong', Password: 'claudiawong01' }
];

let csv = 'id,StudentName,Module,MatricNo,Group,Role,Username,Password\n';

data.forEach(function(row) {
  csv += row.id + ',' + row.StudentName + ',' + row.Module + ',' + row.MatricNo + ',' + row.Group + ',' + row.Role + ',' + row.Username + ',' + row.Password + '\n';
});

fs.writeFileSync('data.csv', csv);
