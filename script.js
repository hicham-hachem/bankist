'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z'
    ],
    currency: 'EUR',
    locale: 'pt-PT' // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2022-10-16T12:01:20.894Z',
        '2022-11-17T18:49:59.371Z',
        '2022-11-18T14:43:26.374Z',
        '2022-11-18T16:33:06.386Z',
        '2022-11-19T06:04:23.907Z',
        '2022-11-19T14:18:46.235Z',
        '2022-11-20T09:48:16.867Z',
        '2022-11-20T13:15:33.035Z'
    ],
    currency: 'USD',
    locale: 'en-US'
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Display date function
const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = `${date.getFullYear()}`;
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
};

// Display all the movements
const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    // Used for sorting function
    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? `deposit` : `withdrawal`;

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">
                    ${i + 1} ${type}
                </div>
                <div class="movements__date">
                    ${displayDate}
                </div>
                <div class="movements__value">
                    ${mov.toFixed(2)}€
                </div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

// Calculating and displaying the balance
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

// Calculating and displaying the summary
const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// Computing usernames
const createUsernames = function (accounts) {
    accounts.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsernames(accounts);

// Update UI function
const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
};

// ALWAYS LOGED IN
let currentAccount;
currentAccount = account2;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// Implementing login
// let currentAccount;
btnLogin.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent form from submitting
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    if (currentAccount?.pin === +inputLoginPin.value) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;

        // Create current date and time manuel
        // const now = new Date();
        // const day = `${now.getDate()}`.padStart(2, 0);
        // const month = `${now.getMonth() + 1}`.padStart(2, 0);
        // const year = now.getFullYear();
        // const hour = `${now.getHours()}`.padStart(2, 0);
        // const min = `${now.getMinutes()}`.padStart(2, 0);
        // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        // Create current date and time using API
        const now = new Date();
        const options = {
            year: 'numeric', // 2-digit
            month: 'numeric', // long, 2-digit
            // weekday: 'long', // short, narrow
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        // const locale = navigator.language; // To display automatic locale
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);
        // www.lingoes.net/en/translator/langcode.htm

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur(); // Remove the focusing from the input field

        // Update UI
        updateUI(currentAccount);
    }
});

// Implementing transfers
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';

    if (
        amount > 0 &&
        currentAccount.balance >= amount &&
        receiverAcc &&
        receiverAcc.username !== currentAccount.username
        // receiverAcc?.username !== currentAccount.username
        // Can't be used, cause if receiverAcc is undefind the condition will still true
    ) {
        // Doing the transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);
    }
});

// Request a loan
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (
        amount > 0 &&
        currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
        // Add movement
        currentAccount.movements.push(amount);

        // Add loan date
        currentAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
});

// Closing an account
btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (
        inputCloseUsername.value === currentAccount.username &&
        +inputClosePin.value === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );

        // Delete account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

// Sorting movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});
