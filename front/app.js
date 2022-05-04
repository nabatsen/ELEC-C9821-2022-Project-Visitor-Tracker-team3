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

const loginUsername = document.querySelector('.username');
const loginPassword = document.querySelector('.password');

//////////
const updateUI = function () {
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
