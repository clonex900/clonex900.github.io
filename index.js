let interval;
document.addEventListener("DOMContentLoaded", e => {
    let cur = new Date().toTimeString().split(' ')[0].slice(0,-3);
    document.getElementById('start').value = cur;
    document.getElementById('startForm').addEventListener('submit', e => {
        e.preventDefault();
        let startTime = e.target.querySelector("input").value;
        let day = e.target.querySelector('input[name="day"]:checked').value;
        setLine(startTime, day);
        clearInterval(interval);
        interval = setInterval(function() {setLine(startTime, day)}, 3000);
        document.querySelectorAll("div#graph p").forEach( (e, i) => {
            e.textContent = timeFormat(startTime, i);
        });
    });
});

function timeFormat(time, add) {
    let [hour, minute] = time.split(":").map(e => Number(e))
    hour = (hour + add) % 24;
    let suf = hour >= 12 ? "PM" : "AM"
    hour = hour > 0 && hour <= 12 ? hour : Math.abs(hour - 12);
    return `${hour}:${(minute >= 10 ? "" : "0") + minute} ${suf}`
}

function setLine(time, day) {
    let [sHour, sMinute] = time.split(":").map(e => Number(e))
    if (day < 0) sHour -= 12;
    let currentDate = new Date()
    let diff = (currentDate.getHours() - sHour) * 60 + currentDate.getMinutes() - sMinute;
    let line = document.getElementById('line');
    line.style.left = (1.15 * diff + 123) + 'px';
}

