// Описан в документации
import flatpickr from "flatpickr";
// Дополнительный импорт стилей
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    input: document.querySelector('input[type=text]'),
    startBtn: document.querySelector('button[data-start]'),
    restDays: document.querySelector('span[data-days]'),
    restHours: document.querySelector('span[data-hours]'),
    restMinutes: document.querySelector('span[data-minutes]'),
    restSeconds: document.querySelector('span[data-seconds]'),
    // timer: document.querySelector('.timer'),
    // field: document.querySelector('.field'),
};
// console.log(refs.timer);
// refs.timer.style.color = 'tomato';
// refs.timer.style.fontSize = '22px';
// refs.timer.style.cssText  = 'display:flex';
// refs.field.style.width = '40px';
// refs.field.style.height = '120px';
// refs.field.style.backgroundColor = 'blue';
// refs.field.style.color = 'white';

refs.startBtn.disabled = true;
let intervalId = null;

let selectedDate = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if ((selectedDates[0] - Date.now()) < 0) {
            Notify.failure('Please choose a date in the future');
            refs.startBtn.disabled = true;
            return;

        } else {
            refs.startBtn.disabled = false;
            refs.startBtn.addEventListener('click', handleStartBtn);

            function handleStartBtn() {
                intervalId = setInterval(() => {
                    const timeLeftMs = selectedDates[0] - Date.now();
                    const { days, hours, minutes, seconds } = convertMs(timeLeftMs);
                    refs.restDays.textContent = `${days}`;
                    refs.restHours.textContent = `${hours}`;
                    refs.restMinutes.textContent = `${minutes}`;
                  refs.restSeconds.textContent = `${seconds}`;
                }, 1000);
                
                refs.startBtn.disabled = true;
            }
        }
    },
};

flatpickr("input", options);

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

  // Remaining days
    const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
    const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
    const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

    return { days, hours, minutes, seconds };
};

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
// const obd = {
//   days:0, hours:0, minutes:0, seconds:0 
// }
// console.log(obd === 0);