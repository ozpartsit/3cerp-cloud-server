let card_products = [];
let card_currency = "";

// function to get product from db to card - Listener is on bottom index.js
const get_products = async () => {
  const url = $api.create_url({ type: "cart" });

  const res = await $api.get(url);

  //   Find container to products in card
  let HTML_list_products = document.querySelector("#card_list_products");

  if (!HTML_list_products) return;

  //   Remove product from DOM
  remove_HTML_product(HTML_list_products);

  if (res) {
    if (res.data.document.lines) {
      card_products = res.data.document.lines;
      card_currency = res.data.document.currency;

      card_products.forEach((product, index) => {
        if (!product.item) {
          return;
        }
        // Crate product in DOM
        create_HTML_product(product, HTML_list_products, index);
      });

      set_summary(res.data.document);
      update_badge(res.data.document.quantity);
    }
  }
};

// download function for shopping basket options
const get_options = async (field = "country", subdoc = "shippingAddress") => {
  const url = $api.create_url({ type: "cart", action: "options" });

  let body = {
    field,
    subdoc,
  };

  const res = await $api.post(url, body, false);

  if (res) {
    console.log(res);
  }
};

// function for adding products to the basket
const add_product = async (id, quantity) => {
  const url = $api.create_url({ type: "cart", action: "add" });

  let body = {
    item: id,
    quantity,
  };

  const res = await $api.put(url, body, false);

  if (res.status !== "error") {

    update_badge(res.data.document.quantity);
    return "success";
  }

  return create_alert("danger", i18n);
};

// Function to remvoe html product in card
const remove_HTML_product = (HTML_list_products) => {
  let products = HTML_list_products.querySelectorAll("[index]");

  if (!products) return;

  products.forEach((product) => {
    product.remove();
  });
};

// Function to change quantity in card
const change_quantity_product_in_card = async (
  index,
  action,
  HTML_list_products
) => {
  let input = HTML_list_products.querySelectorAll("input")[index];

  if (input.value === "1" && action === "minus") {
    return;
  }

  let url = $api.create_url({ type: "cart", action: "update" });

  let body = {
    field: "quantity",
    subdoc: "lines",
    value:
      action === "plus"
        ? card_products[index].quantity + 1
        : card_products[index].quantity - 1,
    subdoc_id: card_products[index]._id,
  };

  const res = await $api.patch(url, body, false);

  if (res) {
    let totalPrice = HTML_list_products.querySelectorAll("[name='totalPrice']")[
      index
    ];

    input.value =
      action === "plus"
        ? card_products[index].quantity + 1
        : card_products[index].quantity - 1;
    card_products[index].quantity =
      action === "plus"
        ? card_products[index].quantity + 1
        : card_products[index].quantity - 1;

    totalPrice.innerHTML = `${card_currency.name} ${
      card_products[index].quantity * card_products[index].price
    }`;

    set_summary(res.data.document);
    return;
  }
};

// function for deleting a product, which is called in the index.js file, just after the getProducts() function has been run
const remove_product = async (index, product) => {
  let body = {
    field: "deleted",
    value: true,
    subdoc: "lines",
    subdoc_id: card_products[index] ? card_products[index].id : null,
  };

  const url = $api.create_url({ type: "cart", action: "update" });

  const res = await $api.patch(url, body, false);

  if (res) {
    card_products.splice(index, 1);
    await get_products();

    create_alert("success", i18n);
  }

  return create_alert("danger", i18n);
};

// a function which selects actions on a product in the shopping basket
const select_action_product = async (e, HTML_list_products) => {
  let product = e.target;

  let index = product.getAttribute("index");
  let action = product.getAttribute("name");

  if (["plus", "minus"].includes(action)) {
    await change_quantity_product_in_card(index, action, HTML_list_products);

    return;
  }

  if (["remove"].includes(action)) {
    await remove_product(index, product);

    return;
  }
};

// function to set a summary
const set_summary = (data_document) => {
  let HTML_card_total = document.querySelector("#card_total");
  let HTML_card_title = document.querySelector("#title_card");

  if (HTML_card_total) {
    HTML_card_total.innerHTML = data_document.amount;
  }

  if (HTML_card_title) {
    HTML_card_title.innerHTML = `${i18n["shopping-cart"].title} (${data_document.quantity} ${i18n["shopping-cart"].items})`;
  }
};

// Function to update badge over the icon
const update_badge = (qunatity) => {
  let HTML_card_badge = document.querySelector("#card_badge");
  let HTML_card_btn = document.querySelector("#card_btn");

  if (HTML_card_btn) {
    if (qunatity <= 0 && HTML_card_badge) {
      HTML_card_badge.remove();
    }

    if (qunatity > 0) {
      let HTML_span = document.createElement("span");

      HTML_span.classList.add("items");
      HTML_span.classList.add("rounded-circle");

      HTML_span.setAttribute("id", "card_badge");

      HTML_span.innerHTML = qunatity;

      HTML_card_btn.appendChild(HTML_span);
    }
  }
};

// Function to create  html product in card
const create_HTML_product = (product, HTML_list_products, index) => {
  if (!product.item) return;

  console.log(product);
  // Container
  const HTML_container = document.createElement("li");
  HTML_container.setAttribute(
    "class",
    "item clearfix d-flex align-items-center"
  );
  HTML_container.setAttribute("index", index);
  HTML_list_products.appendChild(HTML_container);

  // Image
  const HTML_href_img = document.createElement("a");
  const HTML_img = document.createElement("img");
  HTML_href_img.setAttribute("class", "product-image");
  HTML_href_img.setAttribute("href", product.src);
  HTML_img.setAttribute(
    "src",
    product.item.images[0] ? product.item.images[0].fullPath : ""
  );
  HTML_img.setAttribute("alt", product.item.name);
  HTML_href_img.appendChild(HTML_img);
  HTML_container.appendChild(HTML_href_img);

  // Product details
  const HTML_product_details = document.createElement("div");
  const HTML_remove = document.createElement("i");
  const HTML_name = document.createElement("a");
  const HTML_description = document.createElement("div");
  const HTML_manger = document.createElement("div");

  HTML_product_details.setAttribute("class", "product-details");
  HTML_remove.setAttribute("class", "remove cp cp-times cursor-pointer mt-1");
  HTML_remove.setAttribute("name", "remove");
  HTML_remove.setAttribute("index", index);
  HTML_name.setAttribute("class", "product-title");
  HTML_name.setAttribute("href", product.src);
  HTML_description.setAttribute("class", "variant-cart");
  HTML_manger.setAttribute(
    "class",
    "d-flex align-items-center justify-content-between"
  );

  HTML_name.innerHTML = product.item.name;
  HTML_description.innerHTML = product.description;

  HTML_product_details.appendChild(HTML_remove);
  HTML_product_details.appendChild(HTML_name);
  HTML_product_details.appendChild(HTML_description);
  HTML_product_details.appendChild(HTML_manger);
  HTML_container.appendChild(HTML_product_details);

  // Product menager
  const HTML_qty_wrap = document.createElement("div");
  const HTML_qty_field = document.createElement("div");
  const HTML_qty_minus = document.createElement("i");
  const HTML_qty_plus = document.createElement("i");
  const HTML_qty_input = document.createElement("input");

  HTML_qty_wrap.setAttribute("class", "wrapQtyBtn");
  HTML_qty_field.setAttribute("class", "qtyField");
  HTML_qty_minus.setAttribute(
    "class",
    "qtyBtn minus cp cp-minus cursor-pointer"
  );
  HTML_qty_minus.setAttribute("name", "minus");
  HTML_qty_minus.setAttribute("index", index);
  HTML_qty_minus.setAttribute("aria-hidden", true);
  HTML_qty_plus.setAttribute("class", "qtyBtn plus cp cp-plus cursor-pointer");
  HTML_qty_plus.setAttribute("aria-hidden", true);
  HTML_qty_plus.setAttribute("name", "plus");
  HTML_qty_plus.setAttribute("index", index);
  HTML_qty_input.setAttribute("class", "qty");
  HTML_qty_input.setAttribute("type", "text");
  HTML_qty_input.setAttribute("name", "quantity");
  HTML_qty_input.setAttribute("disabled", true);

  HTML_qty_input.value = product.quantity;

  HTML_qty_field.appendChild(HTML_qty_minus);
  HTML_qty_field.appendChild(HTML_qty_input);
  HTML_qty_field.appendChild(HTML_qty_plus);
  HTML_qty_wrap.appendChild(HTML_qty_field);
  HTML_manger.appendChild(HTML_qty_wrap);

  // Product price
  const HTML_price_row = document.createElement("div");
  const HTML_price_product = document.createElement("div");
  const HTML_price_span = document.createElement("span");

  HTML_price_row.setAttribute("class", "priceRow");
  HTML_price_product.setAttribute("class", "product-price");
  HTML_price_span.setAttribute("name", "totalPrice");

  HTML_price_span.innerHTML = `${card_currency.name} ${product.amount}`;

  HTML_price_product.appendChild(HTML_price_span);
  HTML_price_row.appendChild(HTML_price_product);
  HTML_manger.appendChild(HTML_price_row);

  return;
};
