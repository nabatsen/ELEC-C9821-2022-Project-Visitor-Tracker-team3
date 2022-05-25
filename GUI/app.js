'use strict';

const labelWelcome = document.querySelector('.welcome');
let visitor = document.querySelector('.show_visitor');
let show_date = document.querySelector('.show_date');
const getData = document.querySelector('.range-data');
let showData = document.querySelector('.show-data-range');
let data_arr = [];

let start_date;
let end_date;
Chart.defaults.color = '#FFFFFF';

function nextDay(date) {
  return new Date(date.getTime() + 24 * 3600 * 1000);
}

function clearCanvas() {
  document.getElementById('visitors').remove();
  document.getElementById('canvas').innerHTML +=
    '<canvas id="visitors"  width="800" height="450"></canvas>';
}
const getDataOnRange = function (startDate, endDate) {
  axios
    .get(
      `http://localhost:3000/api/stat?id=1&startdate=${startDate}&enddate=${endDate}`
    )
    .then(response => {
      var max = 0;
      var cur = new Date(startDate);
      var last = new Date(endDate);
      var dates = [];
      var visitors = [];
      clearCanvas();

      do {
        var tmp = new Object();
        dates.push(
          cur.toLocaleString('en-us', { month: 'short', day: 'numeric' })
        );
        if (
          response.data.length > 0 &&
          new Date(response.data[0].date).getTime() == cur.getTime()
        ) {
          visitors.push(response.data.shift().visitors);
        } else visitors.push(0);
        max = Math.max(max, visitors[visitors.length - 1]);
        cur = nextDay(cur);
      } while (cur.getTime() <= last.getTime());
      //time to draw
      const DATA_COUNT = visitors.length;
      const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: max };
      const labels = dates;
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Visitors',
            data: visitors,
            backgroundColor: '#d467b4',
          },
        ],
      };
      const config = {
        type: 'bar',
        data: data,
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Visitors Chart',
            },
          },
        },
      };
      const myChart = new Chart(document.getElementById('visitors'), config);
    });
  // axios
  //   .get(
  //     `http://localhost:3000/api/stat?id=1&startdate=${startDate}&enddate=${endDate}`
  //   )
  //   .then(response => {
  //     response.data.forEach(data => {
  //       let data_combine = data.date + ' - ' + data.visitors;
  //       // showData.innerHTML = '';
  //       showData.innerHTML += data_combine + '<br>';
  //       data_arr.push(data_combine);
  //       console.log(data_combine);
  //     });
  //   });
};
const chooseRangeDate = function () {
  document.getElementById('start').addEventListener('change', function () {
    start_date = this.value;
  });
  document.getElementById('end').addEventListener('change', function () {
    end_date = this.value;
  });
  getData.addEventListener('click', function () {
    // showData.innerHTML = '';
    console.log(start_date);
    console.log(end_date);

    getDataOnRange(start_date, end_date);
  });
};
chooseRangeDate();
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

//////////
function statOnDate(date) {
  axios
    .get(
      `http://localhost:3000/api/stat?id=1&startdate=${date}&enddate=${date}`
    )
    .then(response => {
      visitor.innerHTML = 'Number of visitor:';
      show_date.innerHTML = 'Date:';
      visitor.innerHTML += ' ' + response.data[0].visitors;
      show_date.innerHTML += '<br>' + response.data[0].date;
      console.log(response.data[0].visitors);
    });
}
function onClickTheDate(self) {
  let currentMonth = document.querySelector('.date h1').innerHTML;
  let currentDay = self.innerHTML < 10 ? '0' + self.innerHTML : self.innerHTML;
  let month =
    months.indexOf(currentMonth) < 10
      ? '0' + (months.indexOf(currentMonth) + 1)
      : months.indexOf(currentMonth) + 1;
  let choose_day = '2022-' + month + '-' + currentDay;
  console.log(choose_day);
  statOnDate(choose_day);
  return choose_day;
}
////////////////////////// Calendar
const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector('.days');

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  document.querySelector('.date h1').innerHTML = months[date.getMonth()];

  document.querySelector('.date p').innerHTML = new Date().toDateString();

  let days = '';

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div onclick="onClickTheDate(this)" class="ddd">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }
  monthDays.innerHTML = days;
};

document.querySelector('.prev').addEventListener('click', () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector('.next').addEventListener('click', () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

axios.get('http://localhost:3000/api/stat?id=1').then(response => {
  // let visitor = document.querySelector('.show_visitor');
  visitor.innerHTML += ' ' + response.data[response.data.length - 1].visitors;
  // let date = document.querySelector('.show_date');
  show_date.innerHTML += '<br>' + response.data[response.data.length - 1].date;
});
