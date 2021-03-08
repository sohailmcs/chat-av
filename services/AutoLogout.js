//==========================start autoLogout===============================
class AutoLogout {
    constructor() {
        this.events = [
            "load",
            "mousemove",
            "mousedown",
            "click",
            "scroll",
            "keypress",
            "unload"
        ];

        this.warn = this.warn.bind(this);
        this.logout = this.logout.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);

        this.events.forEach((event) => {
            window.addEventListener(event, this.resetTimeout);
        });

        this.setTimeout();
    }

    clearTimeout() {
        if (this.warnTimeout) clearTimeout(this.warnTimeout);

        if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    }

    setTimeout() {
        this.warnTimeout = setTimeout(this.warn, 29 * 60 * 1000);
        this.logoutTimeout = setTimeout(this.logout, 30 * 60 * 1000);
    }

    resetTimeout() {
        this.clearTimeout();
        this.setTimeout();
    }

    warn() {
        console.log("You will be logged out automatically in 1 minute.");
        // deleteAllCookies();
    }

    logout() {
        // Send a logout request to the API
        //console.log("Sending a logout request to the API...");
        this.destroy(); // Cleanup
        deleteAllCookies();

    }

    destroy() {
        this.clearTimeout();

        this.events.forEach((event) => {
            window.removeEventListener(event, this.resetTimeout);
        });
    }
}

function CalculateAge(userinput) {

    //collect input from HTML form and convert into date format
    // var userinput = document.getElementById("txtInfoAge").value;
    var dob = new Date(userinput);

    //check user provide input or not
    if (userinput == null || userinput == "") {
        document.getElementById("spnAge").innerHTML = "**Choose a date please!";
        return false;
    }

    //execute if the user entered a date
    else {
        //extract the year, month, and date from user date input
        var dobYear = dob.getYear();
        var dobMonth = dob.getMonth();
        var dobDate = dob.getDate();

        //get the current date from the system
        var now = new Date();
        //extract the year, month, and date from current date
        var currentYear = now.getYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();

        //declare a variable to collect the age in year, month, and days
        var age = {};
        var ageString = "";

        //get years
        yearAge = currentYear - dobYear;

        //get months
        if (currentMonth >= dobMonth)
        //get months when current month is greater
            var monthAge = currentMonth - dobMonth;
        else {
            yearAge--;
            var monthAge = 12 + currentMonth - dobMonth;
        }

        //get days
        if (currentDate >= dobDate)
        //get days when the current date is greater
            var dateAge = currentDate - dobDate;
        else {
            monthAge--;
            var dateAge = 31 + currentDate - dobDate;

            if (monthAge < 0) {
                monthAge = 11;
                yearAge--;
            }
        }
        //group the age in a single variable
        age = {
            years: yearAge,
            months: monthAge,
            days: dateAge,
        };

        if (age.years > 0 && age.months > 0 && age.days > 0)
            ageString =
            age.years +
            " years ";
        //  +
        // age.months +
        // " months, and " +
        // age.days +
        // " days old.";
        else if (age.years == 0 && age.months == 0 && age.days > 0)
            ageString = age.days + " days ";
        //ageString = "Only " + age.days + " days old!";
        //when current month and date is same as birth date and month
        else if (age.years > 0 && age.months == 0 && age.days == 0)
            ageString = age.years + " years";
        // ageString = age.years + " years old. Happy Birthday!!";
        else if (age.years > 0 && age.months > 0 && age.days == 0)
        // ageString = age.years + " years and " + age.months + " months old.";
            ageString = age.years + " years";
        else if (age.years == 0 && age.months > 0 && age.days > 0)
            ageString = age.months + " months";
        //ageString = age.months + " months and " + age.days + " days old.";
        else if (age.years > 0 && age.months == 0 && age.days > 0)
            ageString = age.years + " years ";
        //ageString = age.years + " years, and" + age.days + " days old.";
        else if (age.years == 0 && age.months > 0 && age.days == 0)
            ageString = age.months + " months";
        //ageString = age.months + " months old.";
        //when current date is same as dob(date of birth)
        else ageString = "It's first day on Earth!";

        //display the calculated age
        return (document.getElementById("spnAge").innerHTML =
            "(" + ageString + ")");
    }
}
//=========================end auto logout   ==============================