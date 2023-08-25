// Database connection
const SUPABASE_URL = 'https://nfdesaerenopfgdquekv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVzYWVyZW5vcGZnZHF1ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NjkyMDgsImV4cCI6MjAwNTM0NTIwOH0._OMoM2oN-_93iBG6EqbSC2aQn3kbU-XS9zh99uzIdh8';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// sessionStorage.setItem('email', 'test@test.com');
const useremail = sessionStorage.getItem('email');

const main = document.querySelector('main');

async function updateProfileUi(email) {
  // ShowLoader
  document.querySelector('.loader').classList.remove('hidden');
  // document.querySelector('.overlay').classList.remove('hidden');
  try {
    // Fetch the user based on the provided email
    const { data, error } = await db
      .from('users')
      .select()
      .eq('email', email)
      .single();

    // HideLoader;
    document.querySelector('.loader').classList.add('hidden');
    // document.querySelector('.overlay').classList.add('hidden');
    console.log(data);
    if (error) {
      console.error('Error fetching data:', error.message);
      return false;
    }
    console.log(data.created_at);
    const userDate = new Date(data.created_at);
    const options = {
      month: 'short',
      year: 'numeric',
    };
    const formatedDateInUserLocale = Intl.DateTimeFormat(
      navigator.language,
      options
    ).format(userDate);
    const part = formatedDateInUserLocale.split(' ');
    console.log(formatedDateInUserLocale, part);

    const name = data.name;
    const pin = data.pin;
    const password = data.password;
    // const email = data.email;
    const profileHtml = ` <section class="flex flex-col items-center text-white mt-10 mb-14">
    <div class="profile-abbr rounded-full w-14 h-14 flex items-center justify-center">
        <p class="text-2xl uppercase"> ${name[0].toUpperCase()}</p>
    </div>
    <p class="mt-4 text-lg font-semibold">${name}</p>
    <p class="text-slate-300 text-sm-">Joined since ${part[0]} ${part[1]}</p>
</section>
<section>

    <div class="mx-7 ">

        <div class="flex justify-between ">
            <div class="flex flex-col mb-7">
                <p class="text-white text-lg capitalize">${name}</p>
                <p class="text-slate-300 text-sm capitalize">Account name</p>
            </div>
               <div class="text-white self-center w-3"> <img class="w-full" src="/images/arrow-angle-pointing-to-right (1).png" alt=""></div>
        </div>

        <div class="flex justify-between ">
            <div class="flex flex-col mb-7">
                <p class="text-white text-lg">${email}</p>
                <p class="text-slate-300 text-sm capitalize">Email address</p>
            </div>
               <div class="text-white self-center w-3"> <img class="w-full" src="/images/arrow-angle-pointing-to-right (1).png" alt=""></div>
        </div>

        <div class="flex justify-between ">
            <div class="flex flex-col mb-7">
                <p class="text-white text-lg">${pin}</p>
                <p class="text-slate-300 text-sm capitalize">pin</p>
            </div>
               <div class="text-white self-center w-3"> <img class="w-full" src="/images/arrow-angle-pointing-to-right (1).png" alt=""></div>
        </div>
        <div class="flex justify-between ">
            <div class="flex flex-col mb-7">
                <p class="text-white text-lg">${password}</p>
                <p class="text-slate-300 text-sm capitalize">password</p>
            </div>
            <div class="text-white self-center w-3"> <img class="w-full" src="/images/arrow-angle-pointing-to-right (1).png" alt=""></div>
        </div>
    </div>
</section>`;

    main.insertAdjacentHTML('afterend', profileHtml);

    // update transaction historys
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}
updateProfileUi(useremail);
