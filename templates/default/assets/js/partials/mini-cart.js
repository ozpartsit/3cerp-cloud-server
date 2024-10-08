// Function is called in the top-bar.ejs
const handle_get_products_in_mini_cart = async () => {
     // Get products
     const res = await get_products_cart();

     // Get container from mini-cart
     let HTML_list_products = document.querySelector("#cart_list_products");
     if (!HTML_list_products) return;

     // Remove products
     remove_HTML_products(HTML_list_products);

     // Render products in dom
     if (res && res.data.document.lines) {
          let products = res.data.document.lines;

          products.forEach((product, index) => {
               if (!product.item) {
                    return;
               }
               create_HTML_product(product, HTML_list_products, index);
          });
          let HTML_title = document.querySelector("#cart_title");
          let HTML_summary_total = document.querySelector("#cart_total");

          if (HTML_title) {
               HTML_title.innerHTML = `${i18n["shopping-cart"].title} (${res.data.document.quantity} ${i18n["shopping-cart"].items})`;
          }

          if (HTML_summary_total) {
               HTML_summary_total.innerHTML =
                    res.data.document.grossAmountFormat;
          }

          // Function from top-bar.ejs
          update_badge_cart(res.data.document.quantity);
     }
};

// Function to remvoe html product in cart
const remove_HTML_products = (HTML_list_products) => {
     let products = HTML_list_products.querySelectorAll("[index]");

     if (!products) return;

     products.forEach((product) => {
          product.remove();
     });
};

// Function to create  html product in cart
const create_HTML_product = (product, HTML_list_products, index) => {
     if (!product.item) return;

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
     HTML_href_img.href = data.page.host + "/item/" + product.item.urlComponent;
     HTML_href_img.appendChild(HTML_img);
     HTML_container.appendChild(HTML_href_img);

     // Product details
     const HTML_product_details = document.createElement("div");
     const HTML_remove = document.createElement("i");
     const HTML_name = document.createElement("a");
     const HTML_description = document.createElement("div");
     const HTML_manger = document.createElement("div");

     HTML_product_details.setAttribute("class", "product-details");
     HTML_remove.setAttribute(
          "class",
          "remove cp cp-times cursor-pointer mt-1"
     );
     HTML_remove.setAttribute("name", "remove");
     HTML_remove.setAttribute("id", product._id);
     HTML_remove.setAttribute("index", index);
     HTML_name.setAttribute("class", "product-title");
     HTML_name.setAttribute(
          "href",
          data.page.host + "/item/" + product.item.urlComponent
     );
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
     HTML_qty_minus.setAttribute("id", product._id);
     HTML_qty_minus.setAttribute("index", index);
     HTML_qty_minus.setAttribute("aria-hidden", true);
     HTML_qty_plus.setAttribute(
          "class",
          "qtyBtn plus cp cp-plus cursor-pointer"
     );
     HTML_qty_plus.setAttribute("aria-hidden", true);
     HTML_qty_plus.setAttribute("name", "plus");
     HTML_qty_plus.setAttribute("id", product._id);
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

     HTML_price_span.innerHTML = product.grossAmountFormat;

     HTML_price_product.appendChild(HTML_price_span);
     HTML_price_row.appendChild(HTML_price_product);
     HTML_manger.appendChild(HTML_price_row);

     return;
};
