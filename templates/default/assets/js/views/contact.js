// Function to send a contact form
const handle_send_contact_form = () => {
  let HTML_form = document.querySelector("#contact-form");

  if (!HTML_form) return;

  let HTML_name = HTML_form.querySelector("#ContactFormName");
  let HTML_email = HTML_form.querySelector("#ContactFormEmail");
  let HTML_phone = HTML_form.querySelector("#ContactFormPhone");
  let HTML_subject = HTML_form.querySelector("#ContactSubject");
  let HTML_message = HTML_form.querySelector("#ContactFormMessage");

  //   listening for the form to send a request to the server
  HTML_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let data_form = {
      name: HTML_name.value,
      email: HTML_email.value,
      phone: HTML_phone.value,
      subject: HTML_subject.value,
      message: HTML_message.value,
    };

    let style_input_error = "border: 2px solid red; color: red;";

    if (data_form.email === "") {
      HTML_email.setAttribute("style", style_input_error);
      HTML_email.classList.remove("border-0");
    }

    if (data_form.name === "") {
      HTML_name.setAttribute("style", style_input_error);
      HTML_name.classList.remove("border-0");
    }

    if (data_form.email === "" || data_form.name === "") return;

    const url = $api.create_url({ type: "contact" });
    const body = data_form;

    const res = await $api.post(url, body, false);

    if (res.status === "success") {
      create_alert("success", null, res.message);

      HTML_name.value = "";
      HTML_email.value = "";
      HTML_phone.value = "";
      HTML_subject.value = "";
      HTML_message.value = "";

      return;
    }

    if (res.status === "error") {
      create_alert("danger", null, res.error.message);
      return;
    }
  });

  //   listening to the form to rectify errors
  HTML_form.addEventListener("click", (e) => {
    if (["name", "email"].includes(e.target.name)) {
      switch (e.target.name) {
        case "name":
          HTML_name.classList.add("border-0");
          HTML_name.removeAttribute("style");
          break;

        case "email":
          HTML_email.classList.add("border-0");
          HTML_email.removeAttribute("style");
          break;
        default:
          break;
      }
    }
  });

  return;
};
