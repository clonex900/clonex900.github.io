let interval;

document.addEventListener("DOMContentLoaded", e => {
    //Set time form to currrent time
    let cur = new Date().toTimeString().split(' ')[0].slice(0,-3);
    document.getElementById('start').value = cur;

    document.getElementById('startForm').addEventListener('submit', e => {
        e.preventDefault();

        //Remove errormsg if exists
        let error = document.getElementById('errorMsg');
        if (error) error.remove();

        //Read startTime and day from form
        let startTime = e.target.querySelector("input").value;
        let day = e.target.querySelector('input[name="day"]:checked').value;

        //Set position of line, if it's out of bounds create an error msg
        if (!setLine(startTime, day)) {
            let p = document.createElement('p');
            p.classList.add('alert');
            p.classList.add('alert-danger');
            p.id = 'errorMsg';
            p.textContent = "Invalid Time";

            document.querySelector('.card').insertBefore(p, document.querySelector('form'));

            return;
        }
        
        //Clear interval if already set then set it
        if(interval) clearInterval(interval);
        interval = setInterval(function() {setLine(startTime, day)}, 3000);

        //Set graph hour markers to times
        document.querySelectorAll("div#graph p").forEach( (e, i) => {
            e.textContent = timeFormat(startTime, i);
        });
    });
});

function parseTimeStr(time) {
    return time.split(":").map(e => Number(e));
}

function timeFormat(time, add) {
    let [hour, minute] = parseTimeStr(time);
    hour = (hour + add) % 24;

    //Convert hour from 24hr time to 12hr time
    let suf = hour >= 12 ? "PM" : "AM"
    hour = hour > 0 && hour <= 12 ? hour : Math.abs(hour - 12);

    //Format into a string
    return `${hour}:${(minute >= 10 ? "" : "0") + minute} ${suf}`
}

function setLine(time, day) {
    let [sHour, sMinute] = parseTimeStr(time);

    //Get current time
    let currentDate = new Date()
    let cHour = currentDate.getHours();
    let cMinute = currentDate.getMinutes();

    //Get the hour difference between start and end time
    let hourDiff;
    if (day == 0) {
        hourDiff = cHour - sHour;
    } else {
        hourDiff = cHour + (24 - sHour);
        console.log(hourDiff);
    }
    //Get the total difference in minutes between start and end
    let diff = hourDiff * 60 + cMinute - sMinute;

    //Fail if diff is out of range
    if (diff < 0 || diff > 735) return 0; 

    //Set the line to the correct position
    //123px is the start position and 1.15px is 1 minute.
    document.getElementById('line').style.left = (1.15 * diff + 123) + 'px';

    return 1;
}
