'use strict';

const example_acc1 = {
  username: 'akai2212',
  password: 234615,
};
const example_acc2 = {
  username: 'blake2211',
  password: 846238,
};
const example_acc3 = {
  username: 'betty2213',
  password: 'betty22sss',
};

const accounts = [example_acc1, example_acc2, example_acc3];

const btnLogin = document.querySelector('.login__btn');
const calendar = document.querySelector('.container');

const loginUsername = document.querySelector('.username');
const loginPassword = document.querySelector('.password');

//////////
const showStatistic = function () {};

const updateUI = function () {
  calendar.classList.remove('hidden');
  showStatistic();
};

////////////////////////// Handle event
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === loginUsername.value);
  if (currentAccount?.password === loginPassword.value) {
    updateUI();
  }
});

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
      days += `<div>${i}</div>`;
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
