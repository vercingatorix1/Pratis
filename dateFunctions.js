// dateFunctions.js

function getNextWorkingDay(date) {
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0) {
    return "Sunday";
  } else if (dayOfWeek === 6) {
    return "Saturday";
  }

  return date;
}

function countWeekendDays() {
  const today = new Date();
  let count = 0;

  for (let i = 0; i < 10; i++) {
    const nextWorkingDay = getNextWorkingDay(new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
    
    if (nextWorkingDay === "Saturday" || nextWorkingDay === "Sunday") {
      count++;
    }
  }

  return count;
}

const weekendDayCount = countWeekendDays();
console.log("Number of weekend days in the next 10 working days:", weekendDayCount);

function addDates() {
  const datesContainer = document.getElementById('datesContainer');
  const today = new Date();

  for (let i = 10 + countWeekendDays(); i >= 0; i--) {
    const nextWorkingDay = getNextWorkingDay(new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
    
    if (nextWorkingDay !== "Sunday" && nextWorkingDay !== "Saturday") {
      const dateElement = document.createElement('div');
      dateElement.className = 'date';
      dateElement.style.height = `100px`;
      
      const dateText = nextWorkingDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateElement.innerText = dateText;
      datesContainer.appendChild(dateElement);
    }
  }
}
document.addEventListener('DOMContentLoaded', function() {
  addDates();
});
