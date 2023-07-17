email = document.querySelector('#login-Email');
const pWord = document.querySelector('#login-Pword');

let emailFilled, pwordFilled;
emailFilled = pwordFilled = false;

email.addEventListener('keyup', function () {
  if (email.value !== '') {
    emailFiled = true;
    email.classList.remove('error');
    document.querySelector('.email__error-msg').textContent = '';
  } else {
    email.classList.add('error');
    document.querySelector('.email__error-msg').textContent = 'cannot be empty';
  }
});

pWord.addEventListener('keyup', function () {
  if (pWord !== '') {
    pwordFilled = true;
    pwordFilled.classList.remove('error');
    document.querySelector('.pword__error-msg').textContent = '';
  } else {
    email.classList.add('error');
    document.querySelector('.pword__error-msg').textContent = 'cannot be empty';
  }
});
