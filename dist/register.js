const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#pword');
const cPassword = document.querySelector('#cpword');

console.log(name);

let nameFilled, emailFiled, pwordFilled, cpwordFilled;
nameFilled = emailFiled = pwordFilled = cpwordFilled = false;

const enableSubmit = function () {
  if (nameFilled && cpwordFilled && pwordFilled && emailFiled) {
    document.querySelector('.register-btn').removeAttribute('disabled');
    document.querySelector('.register-btn').classList.add('btn');
    console.log(document.querySelector('.register-btn'));
  } else {
    document.querySelector('.register-btn').setAttribute('disabled', '');
    document.querySelector('.register-btn').classList.remove('btn');
  }
};

name.addEventListener('keyup', function () {
  if (name.value == '') {
    document.querySelector('.name__error-msg').textContent = 'cant be empty';
    name.classList.add('error');
  } else if (/\d/.test(name.value)) {
    name.classList.add('error');
    document.querySelector('.name__error-msg').textContent =
      'invalid parameter';
  } else if (name.value.length >= 6) {
    nameFilled = true;
    name.classList.remove('error');
    document.querySelector('.name__error-msg').textContent = '';
    enableSubmit();
  } else {
    name.classList.add('error');
    document.querySelector('.name__error-msg').textContent = 'name to short';
  }
});

// email validation
const regex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;
email.addEventListener('keyup', function () {
  if (email.value.match(regex)) {
    emailFiled = true;
    email.classList.remove('error');
    document.querySelector('.email__error-msg').textContent = '';
    enableSubmit();
  } else {
    email.classList.add('error');
    document.querySelector('.email__error-msg').textContent =
      'wrong email format';
  }
});

// password validation
password.addEventListener('keyup', function () {
  if (password.value == '') {
    document.querySelector('.pword__error-msg').textContent = 'cant be empty';
    password.classList.add('error');
  } else if (password.value.length < 6) {
    password.classList.add('error');
    document.querySelector('.pword__error-msg').textContent =
      'must be greater than 6 character';
  } else {
    pwordFilled = true;
    password.classList.remove('error');
    document.querySelector('.pword__error-msg').textContent = '';
    enableSubmit();
  }
});

// confirm password validation
cPassword.addEventListener('keyup', function () {
  if (cPassword.value === password.value) {
    cpwordFilled = true;
    cPassword.classList.remove('error');
    document.querySelector('.cpword__error-msg').textContent = '';
    enableSubmit();
  } else {
    cPassword.classList.add('error');
    document.querySelector('.cpword__error-msg').textContent =
      'Doesnt match with password';
  }
});
