// Database connection
const SUPABASE_URL = 'https://nfdesaerenopfgdquekv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVzYWVyZW5vcGZnZHF1ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NjkyMDgsImV4cCI6MjAwNTM0NTIwOH0._OMoM2oN-_93iBG6EqbSC2aQn3kbU-XS9zh99uzIdh8';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const useremail = sessionStorage.getItem('email');

// transfer details
const transferContainer = document.querySelector('.transfer-wrap');
const recipientEmail = document.querySelector('.recipient-email');
const transferAmount = document.querySelector('.transfer-amount');
const transferBtn = document.querySelector('.transfer-btn');
const transferToContainer = document.querySelector('.transfer-to__container');
// const transferTo = document.querySelector('.transfer-to');
const transferAccounts = document.querySelector('.transfers-accounts');
const transferWrap = document.querySelector('.transfer-wrap');

const transferedSuccessful = document.querySelector('.success');
const amountCredited = document.querySelector('.credited-amount');
const emailCredited = document.querySelector('.transfered-email');

const transfersAccountsRow = document.querySelector('.testing');

const errorMsg = document.querySelector('.error-msg');

const profileColors = [
  'bg-red-700',
  'bg-green-700',
  'bg-amber-700',
  'bg-pink-700',
];

const RandomProfileColor = function (colors) {
  const randomIndex = Math.floor(Math.random() * profileColors.length);
  return colors[randomIndex];
};

console.log(RandomProfileColor(profileColors));
async function fetchAllUsers() {
  // ShowLoader
  document.querySelector('.loader').classList.remove('hidden');

  try {
    // HideLoader
    document.querySelector('.loader').classList.add('hidden');

    // Fetch the user
    const { data, error } = await db.from('users').select();

    console.log(data);
    if (error) {
      console.error('Error fetching data:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

fetchAllUsers()
  .then(usersData => {
    const datas = usersData.forEach(user => {
      if (user.email === useremail) {
        return;
      }
      const html = ` <div 
                      class="transfer-account__row flex gap-3 text-white justify-between mb-10 border-b-2 border-slate-600 pb-5 transfer-accounts__row ">
                         <div class="${RandomProfileColor(
                           profileColors
                         )} rounded-full w-10 h-10 flex items-center justify-center">
                           <p class="text-white text-xl uppercase">
                             ${user.email[0].toUpperCase()}
                           </p>
                         </div>
                        <div class="self-center">
                          <p class="text-slate-300 transfer-to">${
                            user.email
                          }</p>
                        </div>
                        </div>`;
      transfersAccountsRow.insertAdjacentHTML('afterbegin', html);
    });

    // Attach the click event listener to transfersAccountsRow
    const transferTo = document.querySelectorAll('.transfer-account__row');
    transferTo.forEach(account => {
      account.addEventListener('click', () => {
        const transferToEmail = account.querySelector('.transfer-to');
        console.log(transferToEmail.textContent);
        transferAccounts.classList.add('hidden');
        transferWrap.classList.remove('hidden');
        // console.log(transferToEmail.value);
        recipientEmail.value = transferToEmail.textContent;
      });
    });
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

async function fetchTransactions(email) {
  try {
    // Fetch the user based on the provided email
    const { data, error } = await db
      .from('users')
      .select('transactions')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching data:', error.message);
      return false;
    }
    // const currentbalance = data.transactions.reduce((sum, bal) => sum + bal, 0);
    console.log(data.transactions);
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
fetchTransactions(useremail);

// Transfer Credentials check
async function checkTransferCredentials(email, amount) {
  // ShowLoader
  document.querySelector('.loader').classList.remove('hidden');
  try {
    // HideLoader
    document.querySelector('.loader').classList.add('hidden');

    // Fetch the user based on the provided email

    const { data, error } = await db
      .from('users')
      .select()
      .eq('email', email)
      .single()
      .limit(1);

    if (error) {
      console.error('Error fetching data:', error.message);
      return false;
    }
    const currentbalance = data.transactions.reduce((sum, bal) => sum + bal, 0);

    if (amount > currentbalance) {
      return true; // Credentials are correct
    } else {
      return false; // Credentials are incorrect
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function pushValueToTransactionsRow(email, newValue) {
  // ShowLoader
  document.querySelector('.loader').classList.remove('hidden');
  try {
    const oldTransactions = await fetchTransactions(email);
    if (oldTransactions === null) {
      console.error('User with email not found');
      return false;
    }
    console.log(oldTransactions);
    const { data, error } = await db
      .from('users')
      .update({ transactions: [...oldTransactions, newValue] })
      .eq('email', email)
      .single();

    // HideLoader
    document.querySelector('.loader').classList.add('hidden');
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
// pushValueToTransactionsRow('test@test.com', 43);
transferBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const recipientEmailValue = [recipientEmail.value].join('');
  const transferAmountValue = [transferAmount.value].join('');

  console.log(recipientEmailValue);
  console.log(recipientEmailValue);
  checkTransferCredentials(useremail, transferAmount.value)
    .then(result => {
      // check if  sender has insufficient balance
      if (result) {
        transferAmount.classList.add('error');
        errorMsg.textContent = 'insufficient balance';
        console.log('insufficient balance');
      } else {
        transferAmount.classList.remove('error');
        errorMsg.textContent = 'insufficient balance';
        // Add transfered amount to recipient balance
        pushValueToTransactionsRow(recipientEmailValue, transferAmountValue)
          .then(result => {
            if (result) {
              // Remove transfered amount from sender balance
              pushValueToTransactionsRow(useremail, `${-transferAmountValue}`);
              console.log('Value added successfully!');

              // Show transaction successfull page
              transferContainer.classList.add('hidden');
              transferedSuccessful.classList.remove('hidden');
              transferedSuccessful.classList.add('flex');
              amountCredited.textContent = ` ${transferAmountValue}$ `;
              emailCredited.textContent = ` ${recipientEmailValue} `;
            } else {
              console.log('Update operation failed.');
            }
          })
          .catch(error => {
            console.error('Error:', error.message);
          });
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
});
