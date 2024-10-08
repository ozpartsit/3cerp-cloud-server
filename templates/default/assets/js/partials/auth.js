const hanlde_login_in = async (e) => {
     e.preventDefault();
     // Function to login user

     let HTML_email = document.querySelector("#CustomerEmail");
     let HTML_password = document.querySelector("#CustomerPassword");
     let HTML_remember_me = document.querySelector("#checkbox_remember_me");
     let HTML_error = document.querySelector("#main_login_error");

     if (!HTML_email || !HTML_password || !HTML_remember_me) return;

     if (HTML_error) {
          HTML_error.innerHTML = "";
     }

     let email = HTML_email.value;
     let password = HTML_password.value;
     let remeber_me = HTML_remember_me.checked;

     let url = $api.create_url({ type: "login" });
     let body = {
          email,
          password,
     };

     const res = await $api.post(url, body, false);

     if (res.status === "success") {
          use_notification("success", res.message);

          let url = "/";

          window.location = url;

          return;
     }

     if (!HTML_error) return;

     if (res.error.message) {
          HTML_error.innerHTML = res.error.message;

          use_notification("danger", res.error.message);
     }
};

// Fumction to register user
const handle_register_user = async (e) => {
     e.preventDefault();

     let HTML_name = document.querySelector("#CustomerFirstName");
     let HTML_last_name = document.querySelector("#CustomerLastName");
     let HTML_email = document.querySelector("#CustomerEmail1");
     let HTML_newsletter = document.querySelector("#newsletter");
     let HTML_password = document.querySelector("#CustomerPassword");
     let HTML_confirm_password = document.querySelector(
          "#CustomerConfirmPassword"
     );
     let HTML_error = document.querySelector("#main_sign_up_error");

     if (HTML_confirm_password.value !== HTML_password.value) {
          HTML_error.innerHTML = i18n["sign-up"].errors["passwords-not-same"];

          return;
     }

     let url = $api.create_url({ type: "register" });
     let body = {
          firstName: HTML_name.value,
          lastName: HTML_last_name.value,
          email: HTML_email.value,
          newsletter: HTML_newsletter.checked,
          password: HTML_password.value,
     };

     const res = await $api.post(url, body, false);

     if (res.status === "success") {
          use_notification("success", res.message);

          let url = $api.host.slice(0, -4) + "/sign-up-success";

          window.location = url;

          return;
     }

     if (res.error.message) {
          HTML_error.innerHTML = res.error.message;

          use_notification("danger", res.error.message);

          return;
     }
};

// Function to send mail if user forgoted password
const handle_forgot_password = async (e) => {
     e.preventDefault();

     let HTML_mail = document.querySelector("#CustomerEmail");
     let HTML_error = document.querySelector("#main_forgot_password_error");

     if (!HTML_mail || !HTML_error) return;

     HTML_error.innerHTML = null;

     let url = $api.create_url({ type: "resetpassword" });
     let body = {
          email: HTML_mail.value,
     };

     const res = await $api.post(url, body, false);

     if (res.status === "success") {
          use_notification("success", res.message);

          let url = $api.host.slice(0, -4) + "/forgot-password-success";

          window.location = url;
     }
     if (res.error.message) {
          HTML_error.innerHTML = res.error.message;

          use_notification("danger", res.error.message);

          return;
     }
};

// Function handle resset password
const handle_reset_password = async (e) => {
     e.preventDefault();

     let HTML_new_password = document.querySelector("#CustomerPassword");
     let HTML_new_confirm_password = document.querySelector(
          "#ConfirmCustomerPassword"
     );
     let HTML_reset_password_error = document.querySelector(
          "#main_reset_password_error"
     );

     if (
          !HTML_new_password ||
          !HTML_new_confirm_password ||
          !HTML_reset_password
     )
          return;

     if (HTML_new_password.value !== HTML_new_confirm_password.value) {
          HTML_reset_password_error.innerHTML = "Hasła nie są takie same";
          return;
     }

     let location = window.location.href.split("/");
     let id = location[location.length - 2];
     let url = $api.create_url({ type: "resetpassword", id: id });

     let body = {
          password: HTML_new_password.value,
     };

     const res = await $api.patch(url, body, false);

     if (res.status === "success") {
          use_notification("success", res.message);

          let url = $api.host.slice(0, -4) + "/reset-password-success";

          window.location = url;
          return;
     }

     if (res.error.message) {
          HTML_reset_password_error.innerHTML = res.error.message;

          use_notification("danger", res.error.message);

          return;
     }
};

let HTML_login_form = document.querySelector("#main_login_form");
let HTML_sign_up_form = document.querySelector("#main_sign_up_form");
let HTML_forgot_password = document.querySelector("#main_forgot_password_form");
let HTML_reset_password = document.querySelector("#main_rest_password");
let HTML_show_password = document.querySelector("#show_password");

// Listners

// Login
if (HTML_login_form) {
     HTML_login_form.addEventListener("submit", (e) => hanlde_login_in(e));
}

// Sign up
if (HTML_sign_up_form) {
     HTML_sign_up_form.addEventListener("submit", (e) =>
          handle_register_user(e)
     );
}

// Forgot password
if (HTML_forgot_password) {
     HTML_forgot_password.addEventListener("submit", handle_forgot_password);
}

// Reset password
if (HTML_reset_password) {
     HTML_reset_password.addEventListener("submit", handle_reset_password);

     // Show password
     if (HTML_show_password) {
          HTML_show_password.addEventListener("click", () => {
               let HTML_new_password =
                    document.querySelector("#CustomerPassword");
               let HTML_new_confirm_password = document.querySelector(
                    "#ConfirmCustomerPassword"
               );

               if (!HTML_new_password || !HTML_new_confirm_password) return;

               if (HTML_new_password.type === "password") {
                    HTML_new_password.type = "text";
                    HTML_new_confirm_password.type = "text";
               } else {
                    HTML_new_password.type = "password";
                    HTML_new_confirm_password.type = "password";
               }
          });
     }
}
