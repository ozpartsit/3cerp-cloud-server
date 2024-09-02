// Newsletter Popup Cookies
const newsletter_popup = () => {
  var cookieSignup = "cookieSignup",
    date = new Date();
  if (
    $.cookie(cookieSignup) != "true" &&
    window.location.href.indexOf("challenge#newsletter-modal") <= -1
  ) {
    setTimeout(function () {
      $.magnificPopup.open({
        items: {
          src: "#newsletter-modal",
        },
        type: "inline",
        removalDelay: 300,
        mainClass: "mfp-zoom-in",
      });
    }, 5000);
  }
  $.magnificPopup.instance.close = function () {
    if ($("#dontshow").prop("checked") == true) {
      $.cookie(cookieSignup, "true", {
        expires: 1,
        path: "/",
      });
    }
    $.magnificPopup.proto.close.call(this);
  };
};

newsletter_popup();
