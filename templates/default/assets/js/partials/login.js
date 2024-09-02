// Function to login user
const hanlde_login_in = async (e) => {
     e.preventDefault();

     let HTML_email = document.querySelector("#CustomerEmail");
     let HTML_password = document.querySelector("#CustomerPassword");

     if (!HTML_email || !HTML_password) return;

     let email = HTML_email.value;
     let password = HTML_password.value;

     let url = $api.create_url({ type: "login" });
     let body = {
          email,
          password,
     };

     const res = await $api.post(url, body, false);

     if (res && res.status === "succes") {
          console.log(res);

          save_data_user(email, password);
          return;
     }

     let HTML_error = document.querySelector("#main_login_error");

     if (!HTML_error) return;

     //  Dodać kod zarzadzający display error
};

let HTML_login_form = document.querySelector("#main_login_form");

// Listner
if (HTML_login_form) {
     HTML_login_form.addEventListener("submit", (e) => hanlde_login_in(e));
}
