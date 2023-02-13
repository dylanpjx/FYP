const fs = require("fs");

const sampleData = [
  { id: 1, Group: 2, Start_time: '23/03/19 14:00', End_time: '23/03/19 17:00', Duration: '3' },
  { id: 2, Group: 1, Start_time: '24/03/19 13:00', End_time: '24/03/19 15:00', Duration: '2' },
  { id: 3, Group: 2, Start_time: '24/03/19 09:00', End_time: '24/03/19 13:00', Duration: '4' },
  { id: 4, Group: 2, Start_time: '25/03/19 13:00', End_time: '25/03/19 14:00', Duration: '1' },
  { id: 5, Group: 3, Start_time: '26/03/19 12:00', End_time: '26/03/19 13:00', Duration: '1' }
];

let csv = 'id,Group,Start_time,End_time,Duration\n';

data.forEach(function(row) {
  csv += row.id + ',' + row.Group + ',' + row.Start_time + ',' + row.End_time + ',' + row.Duration + '\n';
});

fs.writeFileSync('data.csv', csv);
