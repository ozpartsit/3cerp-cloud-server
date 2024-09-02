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
  await get_products();

  show_page_banner(view, i18);
  set_language(data, i18);
  set_currency(data, i18);
  set_pagination_limit(data, view);
  search_item_keyword();
  set_pagination_block(data);
  // TO DO
  // Dodać walidacje na których podstronach ponizsze funkcje mają sie uruchamiać
  change_display_products_system();
  set_display_products_system();

  if (["item"].includes(view)) {
    handle_add_product_to_card(data, i18);
  }

  if (["search", "item"].includes(view)) {
    handle_add_product_to_card_from_list(data, i18);
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
      send_sync_request("GET", `/language/${select_language.value}`, i18);

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
      //   METHOD 1
      //   delete window.document.referrer;
      //   window.document.__defineGetter__("referrer", function () {
      //     return window.location;
      //   });
      //   console.log(document.referrer)
      //   window.location.href = url;

      //   METHOD 2
      //   history.replaceState({}, "", `/currency/${select_currency.value}`);
      //   window.reload();

      //   METHOD 3
      //   let HTML_a = document.createElement("a");
      //   HTML_a.setAttribute("href", url);
      //   HTML_a.click();

      //   METHOD 4
      //   let HTML_meta = document.createElement("meta");
      //   HTML_meta.setAttribute("name", "referrer");
      //   HTML_meta.setAttribute("content", url);
      //   document.getElementsByTagName("head")[0].appendChild(HTML_meta);
      //   window.location = url;

      //   METHOD 5
      //   let HTML_a = document.createElement("a");
      //   HTML_a.setAttribute("href", url);
      //   HTML_a.setAttribute("Referer", window.location);
      //   HTML_a.click();

      //   METHOD 6
      //   let request = new XMLHttpRequest();
      //   request.open("GET", `/currency/${select_currency.value}`, false);
      //   request.send(null);
      //   if (request.status === 200) {
      //     window.location.reload();

      //     return;
      //   }

      send_sync_request("GET", `/currency/${select_currency.value}`, i18);

      return;
    }

    create_alert("danger", i18);
  });
};

/////////////////////////////////////////////////
// CARD FUNCTIONALITY
/////////////////////////////////////////////////

const handle_add_product_to_card = (data, i18) => {
  let HTML_quantity = document.querySelector("#input_product_quantity");
  let HTML_main_btn = document.querySelector("#btn_main_add_to_card");

  if (!HTML_quantity && !HTML_main_btn) return;

  const remove_values = () => {
    HTML_quantity.value = 1;
  };

  HTML_main_btn.addEventListener("click", async (e) => {
    let id = data.content._id;
    let quantity = HTML_quantity.value;

    let success = await add_product(id, quantity);

    if (success === "success") {
      create_alert("success", i18);

      remove_values();
    }
  });
};

// Add product to card from list
const handle_add_product_to_card_from_list = (data, i18) => {
  let HTML_products = document.querySelector("[name='container_products']");

  if (!HTML_products.getAttribute("listener")) {
    HTML_products.setAttribute("listener", "active");

    HTML_products.addEventListener("click", async (e) => {
      let action = e.target.getAttribute("action");
      let id = e.target.getAttribute("product_id");

      if (!id) return;

      if (["btn_add_to_card_from_list"].includes(action)) {
        let success = await add_product(id, 1);

        if (success === "success") {
          create_alert("success", i18);
        }

        return;
      }
    });
  }
};

// Function to incementation product in card
const product_incrementation_card = (index) => {
  products[index].number_of_pieces = products[index].number_of_pieces + 1;
  return;
};

// Functiom to decremet product in card
const product_decrement_card = (index) => {
  products[index].number_of_pieces = products[index].number_of_pieces - 1;
  return;
};

// Function to render
const render_product_in_card = (HTML_list_products) => {
  if (HTML_list_products.querySelectorAll("[index]")) {
    let products = HTML_list_products.querySelectorAll("[index]");

    products.forEach((product) => {
      product.remove();
    });
  }

  products.forEach((product, index) => {
    if (product.number_of_pieces <= 0) {
      products.splice(index, 1);

      return;
    }

    create_HTML_card_product(product, HTML_list_products, index);
  });
};

/////////////////////////////////////////////////
// LAYOUT FUNCTIONALITY
/////////////////////////////////////////////////

// Function that checks whether a page banner should be displayed on a particular view
const show_page_banner = (view) => {
  let page_banner = document.querySelector("#page_banner");

  if (!page_banner) return;

  let allow_views = ["item", "favorites.ejs", "contact.ejs", "page.ejs", "login.ejs", "sign-up.ejs", "summary.ejs", "my-account.ejs"];

  if (allow_views.includes(view)) return;

  return page_banner.remove();
};

/////////////////////////////////////////////////
// MAIN FUNCTIONALITY
/////////////////////////////////////////////////

// Function for creating alerts
const create_alert = (type, i18) => {
  let allow_types = ["success", "danger", "warning", "info"];

  if (!allow_types.includes(type)) return;

  let div = document.createElement("div");
  let id = `alert-${Math.round(Math.random(9))}`;

  div.classList.add("alert");
  div.classList.add(`alert-${type}`);
  div.classList.add("position-fixed");
  div.classList.add("w-50");
  div.classList.add("top-0");
  div.classList.add("end-0");
  div.classList.add("m-3");
  div.classList.add("animate__animated");
  div.classList.add("animate__fadeInRight");

  div.style.zIndex = "1000";
  div.style.animationDuration = "0.3s";

  div.innerHTML = i18.alerts[type];

  div.setAttribute("role", "alert");
  div.setAttribute("id", id);

  document.body.appendChild(div);

  setTimeout(() => {
    if (div) {
      return div.remove();
    }
  }, 3000);
};

// Set pagination limit
const set_pagination_limit = (data, view) => {
  if (["home", "login.ejs", 'sign-up.ejs', 'summary.ejs'].includes(view)) return;

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

// Function to send a product find request
const search_item_keyword = (data) => {
  let main_search_input = document.querySelector("#main_search_input");
  let main_search_button = document.querySelector("#main_search_button");

  if (!main_search_input || !main_search_button) return;

  main_search_input.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;

    if (!main_search_input.value) return;

    window.location = `${HOST}/search?keyword=${main_search_input.value}`;

    return;
  });
};

main_search_button.addEventListener("click", () => {
  if (!main_search_input.value) return;

  window.location = `${HOST}/search?keyword=${main_search_input.value}`;

  return;
});

// Function to create pagination block in page and handle all functionality in this context
const set_pagination_block = (data) => {
  let main_pagination_block = document.querySelector("#main_pagination_block");

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

    if (i === data.content.totalPages - 1 && data.content.totalPages > 5) {
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

// function to change the product display
const change_display_products_system = () => {
  const btn_grid_products_system = document.querySelector(
    "#display_products_system"
  );

  if (!btn_grid_products_system) return;

  btn_grid_products_system.addEventListener("click", (e) => {
    const new_value = e.target.getAttribute("value");

    if (new_value) {
      const set_local_storage = new Use_local_storage(
        "display_products_system",
        new_value
      );

      set_local_storage.set_item();

      window.location.reload();
    }
  });
};

// Function for setting the appropriate display system for products on the website
const set_display_products_system = () => {
  let set_local_storage = new Use_local_storage("display_products_system");

  if (!set_local_storage.get_item()) return;

  let HTML_btn_list = document.querySelector("#btn_list_products_system");
  let HTML_btn_grid = document.querySelector("#btn_grid_products_system");

  if (set_local_storage.get_item() === "list") {
    if (HTML_btn_list) {
      HTML_btn_list.classList.add("active");
    }

    let HTML_grid = document.querySelector("#grid_products_system");

    if (HTML_grid) {
      HTML_grid.remove();
    }
  } else {
    if (HTML_btn_grid) {
      HTML_btn_grid.classList.add("active");
    }

    let HTML_list = document.querySelector("#list_products_system");

    if (HTML_list) {
      HTML_list.remove();
    }
  }
};

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

/////////////////////////////////////////////////
// GLOBAL LISENERS
/////////////////////////////////////////////////

// Lisener to open card and use functionality
const HTML_card_btn = document.querySelector("#card_btn");
if (HTML_card_btn) {
  HTML_card_btn.addEventListener("click", async (e) => {
    await get_products();

    const HTML_list_products = document.querySelector("#card_list_products");

    if (HTML_list_products) {
      if (!HTML_list_products.getAttribute("listener")) {
        HTML_list_products.setAttribute("listener", "active");

        HTML_list_products.addEventListener("click", (e) => {
          select_action_product(e, HTML_list_products);
        });
      }
    }
  });
}

// date, view and i18n are objects generated in the scripts.ejs file, previously performed
// view if doasn't exist is a home
handle_start_functions(view, data, i18n);
