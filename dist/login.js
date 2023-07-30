const SUPABASE_URL = 'https://nfdesaerenopfgdquekv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVzYWVyZW5vcGZnZHF1ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NjkyMDgsImV4cCI6MjAwNTM0NTIwOH0._OMoM2oN-_93iBG6EqbSC2aQn3kbU-XS9zh99uzIdh8';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const email = document.querySelector('#login-Email');
const pword = document.querySelector('#login-Pword');
const loginForm = document.querySelector('form');
let emailFilled, pwordFilled;
emailFilled = pwordFilled = false;

async function checkCredentials(email, password) {
  try {
    // Fetch the user based on the provided email
    const { data, error } = await db
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching data:', error.message);
      return false;
    }

    console.log(`data: ${data.email} ${data.password}`);
    console.log(`Email:${email} `);
    console.log(`Password: ${password} `);
    // Check if the password matches the stored hashed password
    if (data && data.password === password) {
      return true; // Credentials are correct
    } else {
      return false; // Credentials are incorrect
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

const enableSubmit = function () {
  if (emailFilled && pwordFilled) {
    document.querySelector('.login-btn').removeAttribute('disabled');
    document.querySelector('.login-btn').classList.add('btn');
  } else {
    document.querySelector('.login-btn').setAttribute('disabled', '');
    document.querySelector('.login-btn').classList.remove('btn');
  }
};

email.addEventListener('keyup', function () {
  if (email.value !== '') {
    emailFilled = true;
    email.classList.remove('error');
    document.querySelector('.email__error-msg').textContent = '';
    enableSubmit();
  } else {
    email.classList.add('error');
    document.querySelector('.email__error-msg').textContent = 'cannot be empty';
  }
});

pword.addEventListener('keyup', function () {
  if (pword.value !== '') {
    pwordFilled = true;
    pword.classList.remove('error');
    document.querySelector('.pword__error-msg').textContent = '';
    enableSubmit();
  } else {
    pword.classList.add('error');
    document.querySelector('.pword__error-msg').textContent = 'cannot be empty';
  }
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const userEmail = email.value;
  const userPassword = pword.value;

  const credentialsCorrect = await checkCredentials(userEmail, userPassword);

  if (credentialsCorrect) {
    // Login successful, redirect to the next page or perform other actions
    console.log('Login successful!');
    sessionStorage.setItem('email', userEmail);

    console.log(sessionStorage.getItem('email'));
    window.location.href = '/home.html'; //! CHANGE URL
  } else {
    // Login failed, display an error message or take appropriate actions
    email.classList.add('error');
    document.querySelector('.email__error-msg').textContent =
      'Incorrect email or password. ';
    console.log('Incorrect email or password. Please try again.');
  }
});
