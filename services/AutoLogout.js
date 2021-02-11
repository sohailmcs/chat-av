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

  //=========================end auto logout   ==============================

  
