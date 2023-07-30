const SUPABASE_URL = 'https://nfdesaerenopfgdquekv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVzYWVyZW5vcGZnZHF1ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NjkyMDgsImV4cCI6MjAwNTM0NTIwOH0._OMoM2oN-_93iBG6EqbSC2aQn3kbU-XS9zh99uzIdh8';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#pword');
// const cPassword = document.querySelector('#cpword');
const form = document.querySelector('form');

console.log(name);

let nameFilled, emailFiled, pwordFilled;
nameFilled = emailFiled = pwordFilled = false;

const enableSubmit = function () {
  if (nameFilled && pwordFilled && emailFiled) {
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
  } else if (name.value.length >= 0) {
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

const userEmail = [];
const userName = [];

// from submition
form.addEventListener('submit', function (e) {
  e.preventDefault();

  userEmail.push(email.value);
  userName.push(name.value);
  console.log(userEmail, userName);

  async function insertData() {
    // const { data, error } = await db.auth.signUp({
    //   email: email.value,
    //   pword: password.value,
    //   options: {
    //     data: {
    //       name: name.value,
    //       pin: '1111',
    //       transactions: ['0'],
    //     },
    //   },
    // });

    const { error } = await db.from('users').insert({
      email: userEmail.join(''),
      password: password.value,
      name: name.value,
      pin: '1111',
      transactions: ['0'],
    });
    // .select();

    if (error) {
      console.log('Error inserting user:', error.message);
    } else {
      console.log('User inserted successfully');
      console.log('Login successful!');
      sessionStorage.setItem('email', userEmail.join(''));
      window.location.href = '/home.html'; //! CHANGE URL
    }
  }

  insertData();
});
