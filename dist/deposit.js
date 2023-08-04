// Database connection
const SUPABASE_URL = 'https://nfdesaerenopfgdquekv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVzYWVyZW5vcGZnZHF1ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NjkyMDgsImV4cCI6MjAwNTM0NTIwOH0._OMoM2oN-_93iBG6EqbSC2aQn3kbU-XS9zh99uzIdh8';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const numbersBtn = document.querySelectorAll('.number');
const submitBtn = document.querySelector('#submit');
const closeBtn = document.querySelector('.close-btn');
const amountContainer = document.querySelector('.fund-amount');
const amountEl = document.querySelector('.amount');
const amountErrorEL = document.querySelector('.amount-error__text');

console.log(submitBtn, amountContainer);
const useremail = sessionStorage.getItem('email');
const amountArr = [];
async function fetchTransactions(email) {
  // ShowLoader
  document.querySelector('.loader').classList.remove('hidden');
  try {
    // Fetch the user based on the provided email
    const { data, error } = await db
      .from('users')
      .select('transactions')
      .eq('email', email)
      .single();

    // HideLoader
    document.querySelector('.loader').classList.add('hidden');
    if (error) {
      console.error('Error fetching data:', error.message);
      return false;
    }
    // const currentbalance = data.transactions.reduce((sum, bal) => sum + bal, 0);

    if (data) {
      return data.transactions; // Credentials are correct
    } else {
      return 'column not found'; // Credentials are incorrect
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function pushValueToTransaction(email, newValue) {
  try {
    const oldTransactions = await fetchTransactions(email);
    const { data, error } = await db
      .from('users')
      .update({ transactions: [...oldTransactions, newValue] })
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error updating data:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

numbersBtn.forEach(btn => {
  btn.addEventListener('click', function (e) {
    amountArr.push(Number(e.target.innerText));
    const amount = amountArr;
    console.log(amount);
    submitBtn.setAttribute('disabled', '');
    submitBtn.classList.remove('btn');

    //
    if (e.target.id === 'delete') {
      amountArr.pop();
      console.log(amountArr.pop());
      amountEl.textContent = amount.join('');
      if (amount.join('') === '') {
        // amountEl.textContent = amount.join('');
        // console.log(, +'hrll');
        submitBtn.classList.remove('btn');
        submitBtn.setAttribute('disabled', '');
      } else {
        submitBtn.classList.add('btn');
        submitBtn.removeAttribute('disabled', '');
      }
    }

    //
    else if (amount.join('') > 100000) {
      submitBtn.setAttribute('disabled', '');
      submitBtn.classList.remove('btn');
      amountErrorEL.textContent = 'Max depoist is $100k ';
      amountArr.pop();
      return;
    }

    // remove zero if its the first value
    else if (amount[0] === 0) {
      amountArr.pop();
      return;
    }

    //
    else {
      amountEl.textContent = amount.join('');
      btn.removeAttribute('disabled');
      submitBtn.classList.add('btn');
      submitBtn.removeAttribute('disabled');
    }
  });
});

submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  // Replace with the user's email you want to update
  const newValueToAdd = amountArr.join('');
  console.log(amountArr);
  pushValueToTransaction(useremail, newValueToAdd)
    .then(result => {
      if (result) {
        console.log('Value added successfully!');
        document.querySelector('.deposit-wrap').classList.add('hidden');
        document.querySelector('.sucess').classList.remove('hidden');
        document.querySelector('.sucess').classList.add('flex');
        document.querySelector('.credited').textContent = ` ${newValueToAdd}$ `;
      } else {
        console.log('Update operation failed.');
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
});

closeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  window.location = './home.html';
});
