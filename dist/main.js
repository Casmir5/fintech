// require('dotenv').config();
const SUPABASE_URL = 'https://nfdesaerenopfgdquekv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVzYWVyZW5vcGZnZHF1ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NjkyMDgsImV4cCI6MjAwNTM0NTIwOH0._OMoM2oN-_93iBG6EqbSC2aQn3kbU-XS9zh99uzIdh8';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const profileEl = document.querySelector('.profile');

// console.log(profileEl);
const usernameEL = document.querySelector('.username');
console.log(usernameEL);
const balanceEl = document.querySelector('.user-balance');
const emailEL = document.querySelector('.email');
const transactionContainer = document.querySelector('.transactions');
const sortBtn = document.querySelector('.sort');

// sessionStorage.setItem('email', 'test@test.com');
const email = sessionStorage.getItem('email');

console.log(email);
emailEL.textContent = email;
if (email) {
  const showLoader = function () {
    document.querySelector('.loader').classList.remove('hidden');
    // document.querySelector('.overlay').classList.remove('hidden');
  };

  const hideLoader = function () {
    document.querySelector('.loader').classList.add('hidden');
    // document.querySelector('.overlay').classList.add('hidden');
  };

  async function updateTransactionHistory(email, sort = false) {
    try {
      const { data, error } = await db
        .from('users')
        .select('transactions')
        .eq('email', email)
        .single();
      const movements = data.transactions;
      movements.shift();
      if (error) {
        console.error('Error fetching data:', error.message);
        return false;
      } else {
        if (movements) {
          transactionContainer.innerHTML = '';
          const moves = sort
            ? movements.slice().sort((a, b) => a - b)
            : movements;
          moves = movements.forEach((mov, i) => {
            const type = mov > 0 ? 'deposit' : 'transfered';
            if (movements) {
              document.querySelector('.no-transaction').classList.add('hidden');
            }
            const html = ` <div class="transaction__row flex justify-between pb-3">
         <div class="transaction__type transaction__type--${type}">
         ${i + 1} ${type}</div>
        <div class="transaction__value">${mov}$</div>
         </div>`;
            transactionContainer.insertAdjacentHTML('afterbegin', html);
          });
        } else {
          document.querySelector('.no-transaction').classList.remove('hidden');
        }
      }
    } catch {}
  }

  async function updateUi(email) {
    showLoader();
    // document.querySelector('.loader').classList.remove('hidden');
    // document.querySelector('.overlay').classList.remove('hidden');
    try {
      // Fetch the user based on the provided email
      const { data, error } = await db
        .from('users')
        .select()
        .eq('email', email)
        .single();

      hideLoader();
      // document.querySelector('.loader').classList.add('hidden');
      // document.querySelector('.overlay').classList.add('hidden');
      console.log(data);
      if (error) {
        console.error('Error fetching data:', error.message);
        return false;
      }
      const name = data.name;
      usernameEL.textContent = `${name} 👋`;

      const profileHtml = `<div class=' bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center'>
      <p class="text-white text-xl uppercase">
        ${name[0].toUpperCase()}
        </p>
        </div>`;

      profileEl.insertAdjacentHTML('afterend', profileHtml);
      const movements = data.transactions;
      console.log(movements);
      if (movements !== null) {
        // document.querySelector('.no-transaction').classList.add('hidden');
        // update user balance
        const balance = movements.reduce((acc, mov) => acc + mov, 0);
        balanceEl.textContent = balance;
      }

      // update transaction historys
      updateTransactionHistory(email);
    } catch (error) {
      console.error('Error:', error.message);
      return false;
    }
  }
  updateUi(email);

  let sorted = false;
  sortBtn.addEventListener('click', function (e) {
    e.preventDefault();
    updateTransactionHistory(email, !sorted);
    sorted = !sorted;
  });
} else {
  window.location.href = '/login.html';
}
