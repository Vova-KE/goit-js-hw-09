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
    timer: document.querySelector('.timer'),
    fields: document.querySelectorAll('.field'),
    values: document.querySelectorAll('.value'),
};

refs.timer.style.display = 'flex';

for (const field of refs.fields) {
  field.style.width = '65px';
  field.style.height = '65px';
  field.style.backgroundColor = 'blue';
  field.style.color = 'white';
  field.style.textAlign = 'center';
  field.style.marginRight = '4px';
  field.style.marginTop = '4px';
  field.style.paddingTop = '4px';
  field.style.paddingRight = '4px';
  field.style.paddingBottom = '4px';
  field.style.paddingLeft = '4px';
  field.style.borderRadius = '4px';
};  

for (const value of refs.values) {
  value.style.marginRight = '4px';
};

let intervalId = null;
let selectedDate = '';

refs.startBtn.disabled = true;
refs.startBtn.addEventListener('click', handleStartBtn);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0].getTime();

    if ((selectedDate - options.defaultDate) < 0) {
      Notify.failure('Please choose a date in the future', {
        timeout:1500,
      });
      refs.startBtn.disabled = true;
      return;
    };

    refs.startBtn.disabled = false;
    timerCount();
  },
};

flatpickr("input", options);

function timerCount() {
  const currentTime = Date.now();
  const timeLeftMs = selectedDate - currentTime;
  const timeLeft = convertMs(timeLeftMs);

  if (timeLeftMs > 0) {
    updateTimer(timeLeft);
  };

  if (timeLeftMs < 1000) {
  clearInterval(intervalId);
  };
};

function updateTimer({ days, hours, minutes, seconds }) {
  refs.restDays.textContent = `${days}`;
  refs.restHours.textContent = `${hours}`;
  refs.restMinutes.textContent = `${minutes}`;
  refs.restSeconds.textContent = `${seconds}`;
};

function handleStartBtn() {
  if (intervalId) {
    return;
  };

  intervalId = setInterval(timerCount, 1000);
  refs.startBtn.disabled = true;
};

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
};
