let HOST;

// Function to run functions when the page is loaded
const handle_start_functions = async (view, data, i18) => {
     console.log(view);
     console.log(data);
     console.log(i18);

     if (data.page) {
          HOST = data.page.host ? data.page.host : null;
     }

     //   Get ptoducts to card - function exist in shopping-card.js

     set_language(data, i18);
     set_currency(data, i18);
     set_pagination_limit(data, view);
     set_pagination_block(data);


     if (["contact.ejs"].includes(view)) {
          handle_send_contact_form();
     }
};

/////////////////////////////////////////////////
// TOP BAR FUNCTIONALITY
/////////////////////////////////////////////////

// Function to change the language
const set_language = (data, i18) => {
     if (!data.page || !data.page.languages) return;

     let select_language = document.querySelector("#select_language");

     if (!select_language) return;

     select_language.addEventListener("change", (e) => {
          if (select_language.value && HOST) {
               send_sync_request(
                    "GET",
                    `/language/${select_language.value}`,
                    i18
               );

               return;
          }

          create_alert("danger", i18);
          return;
     });
};

// Function to change the main currency on the website
const set_currency = (data, i18) => {
     if (!data.page || !data.page.currencies) return;

     let select_currency = document.querySelector("#select_currency");

     if (!select_currency) return;

     select_currency.addEventListener("change", async (e) => {
          if (select_currency.value && HOST) {

               send_sync_request(
                    "GET",
                    `/currency/${select_currency.value}`,
                    i18
               );

               return;
          }

          create_alert("danger", i18);
     });
};


/////////////////////////////////////////////////
// MAIN FUNCTIONALITY
/////////////////////////////////////////////////

// Set pagination limit
const set_pagination_limit = (data, view) => {
     if (
          [
               "home",
               "login.ejs",
               "sign-up.ejs",
               "summary.ejs",
               "sign-up-success.ejs",
               "forgot-password.ejs",
               "forgot-password-success.ejs",
               "newpassword",
               "resetpassword",
               "reset-password-success",
               "cart",
               "order.ejs"
          ].includes(view)
     )
          return;

     let select_pagination_limit = document.querySelector("#pagination_limit");
     let default_limit = data.content.limit ? data.content.limit : 10;

     if (!select_pagination_limit) return;

     // Create options
     let options = [10, 25, 50, 100];

     options.forEach((option) => {
          let HTMLoption = document.createElement("option");

          HTMLoption.setAttribute("value", option);
          HTMLoption.innerHTML = option;

          select_pagination_limit.appendChild(HTMLoption);
     });

     // Save in local storage
     const limit_local_storage = new Use_local_storage("limit", default_limit);
     limit_local_storage.set_item();

     // Set value in input
     select_pagination_limit.value = limit_local_storage.get_item();

     // Show By listener
     select_pagination_limit.addEventListener("change", function (e) {
          const url = new URL(window.location.href);
          url.searchParams.set("limit", e.target.value);

          window.location = url;
     });
};

// Function to create pagination block in page and handle all functionality in this context
const set_pagination_block = (data) => {
     let main_pagination_block = document.querySelector(
          "#main_pagination_block"
     );

     if (!main_pagination_block) return;

     if (!data.content.totalPages) return;

     for (let i = 0; i < data.content.totalPages; i++) {
          let HTMLli = document.createElement("li");
          let HTMLi = document.createElement("i");
          let HTMLspan = document.createElement("span");

          if (i === 0 && data.content.totalPages > 5) {
               HTMLli.classList.add("prev");
               HTMLli.classList.add("arrow");

               HTMLli.setAttribute("value", "prev");

               HTMLspan.classList.add("cps");
               HTMLspan.classList.add("cp-arrow-left");

               HTMLli.appendChild(HTMLspan);
          }

          if (
               i === data.content.totalPages - 1 &&
               data.content.totalPages > 5
          ) {
               HTMLli.classList.add("next");
               HTMLli.classList.add("arrow");

               HTMLli.setAttribute("value", "next");

               HTMLspan.classList.add("cps");
               HTMLspan.classList.add("cp-arrow-right");

               HTMLli.appendChild(HTMLspan);
          }

          if (i > 0 && i < 6) {
               HTMLli.setAttribute("value", i);
               HTMLspan.innerHTML = i;

               HTMLli.appendChild(HTMLspan);
          }

          if (i === data.content.page) {
               HTMLli.classList.add("active");
          }

          if (i === 5) {
               HTMLli.setAttribute("value", null);
               HTMLspan.innerHTML = "...";
               HTMLli.appendChild(HTMLspan);
          }

          HTMLli.classList.add("cursor-pointer");
          main_pagination_block.appendChild(HTMLli);
     }

     main_pagination_block.addEventListener("click", (e) => {
          if (
               typeof e.target.parentElement.value === "number" &&
               e.target.parentElement.value !== 0
          ) {
               const url = new URL(window.location);
               url.searchParams.set("page", e.target.parentElement.value);

               window.location = url;
          }
     });
};

// Class to use localStorage
class Use_local_storage {
     constructor(field, value) {
          this.field = field;
          this.value = value;
     }

     field = "";
     value = null;

     set_item() {
          if (!this.field || !this.value) return;

          localStorage.setItem(this.field, this.value);
     }

     get_item() {
          let item = localStorage.getItem(this.field);

          if (item) {
               return item;
          }
     }
}




// Function for sending synchronic requests
const send_sync_request = (method, url, i18) => {
     const req = new XMLHttpRequest();

     req.open(method, url, false);
     req.send(null);

     if (req.status === 200) {
          return window.location.reload();
     }

     return create_alert("danger", i18);
};

// date, view and i18n are objects generated in the scripts.ejs file, previously performed
// view if doasn't exist is a home
handle_start_functions(view, data, i18n);
