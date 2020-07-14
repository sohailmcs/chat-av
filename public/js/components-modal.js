/*=========================================================================================
    File Name: components-modal.js
    Description: Modals are streamlined, but flexible, dialog prompts with the minimum
				required functionality and smart defaults.
    ----------------------------------------------------------------------------------------
    Item Name: Frest HTML Admin Template
    Version: 1.0
    Author: Pixinvent
    Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/
(function (window, document, $) {
  "use strict";

  // onShow event
  $("#onshowbtn").on("click", function () {
    $("#onshow").on("show.bs.modal", function () {
      alert("onShow event fired.");
    });
  });

  // onShown event
  $("#onshownbtn").on("click", function () {
    $("#onshown").on("shown.bs.modal", function () {
      alert("onShown event fired.");
    });
  });

  // onHide event
  $("#onhidebtn").on("click", function () {
    $("#onhide").on("hide.bs.modal", function () {
      alert("onHide event fired.");
    });
  });

  // onHidden event
  $("#onhiddenbtn").on("click", function () {
    $("#onhidden").on("hidden.bs.modal", function () {
      alert("onHidden event fired.");
    });
  });
})(window, document, jQuery);

function hideRequestCallModal() {
  document.getElementById("reqcall").style.display = "none";
  $("#reqcall").modal("hide");
  // setTimeout(() => {
  //   //document.getElementById("notificationmodal").style.display = "block";
  //   $("#notificationmodal").modal("show");

  // }, 3000);
}

function hideconfirmModel() {
  $("#notificationmodal").modal("hide");
}
