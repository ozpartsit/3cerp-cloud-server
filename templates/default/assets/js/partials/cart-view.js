const handleCartAction = async (action, id, quantity) => {
     if (!id && action !== "clear") return;

     let url;
     let body;
     let res;

     switch (action) {
          case "remove":
               // Remove product from cart
               url = $api.create_url({ type: "cart", action: "update" });

               body = {
                    field: "deleted",
                    value: true,
                    subdoc: "lines",
                    subdoc_id: id,
               };

               res = await $api.patch(url, body, false);
               break;

          case "increment":
          case "decrement":
               // Change product quantity
               url = $api.create_url({ type: "cart", action: "update" });

               // Ensure quantity is not less than 0
               if (quantity < 0) quantity = 0;

               body = {
                    field: "quantity",
                    subdoc: "lines",
                    value: quantity,
                    subdoc_id: id,
               };

               res = await $api.patch(url, body, false);
               break;

          case "clear":
               url = $api.create_url({ type: "cart", action: "clear" });

               res = await $api.get(url);

               break;

          default:
               use_notification("danger", "Try again");
               return;
     }

     if (res && res.status !== "error") {
          use_notification("success", res.message);

          window.location.reload();
     } else {
          use_notification("danger", res.error.message);
     }
};

// Function to create a product row in the table
const create_cart_product = (product, HTML_list_products, index) => {
     if (!product.item) return;
     // Table row
     const HTML_row = document.createElement("tr");
     HTML_row.setAttribute("index", index);
     HTML_list_products.appendChild(HTML_row);

     // Remove product column
     const tdRemove = document.createElement("td");
     tdRemove.className = "product-remove";
     const removeLink = document.createElement("a");
     removeLink.href = "#";
     removeLink.className = "btn-default text-large remove";
     removeLink.setAttribute("data-action", "remove");
     removeLink.setAttribute("data-id", product.id);
     removeLink.innerHTML = `<i class="cp cp-trash"></i>`;
     tdRemove.appendChild(removeLink);
     HTML_row.appendChild(tdRemove);

     // Product thumbnail
     const tdThumbnail = document.createElement("td");
     tdThumbnail.className = "product-thumbnail";
     const thumbnailLink = document.createElement("a");
     thumbnailLink.href = data.page.host + "/item/" + product.item.urlComponent;
     thumbnailLink.setAttribute("name", "link");

     const thumbnailImg = document.createElement("img");
     thumbnailImg.className = "blur-up rounded-3 lazyloaded";
     thumbnailImg.setAttribute("name", "link");
     thumbnailImg.href = data.page.host + "/item/" + product.item.urlComponent;

     thumbnailImg.src = product.item.images[0]
          ? product.item.images[0].fullPath
          : "";
     thumbnailImg.alt = product.item.name;
     thumbnailImg.title = product.item.name;
     thumbnailLink.appendChild(thumbnailImg);
     tdThumbnail.appendChild(thumbnailLink);
     HTML_row.appendChild(tdThumbnail);

     // Product name and description
     const tdName = document.createElement("td");
     tdName.className = "product-name";

     const productLink = document.createElement("a");

     productLink.href = data.page.host + "/item/" + product.item.urlComponent;
     productLink.textContent = product.item.name;
     productLink.setAttribute("name", "link");

     const variationSpan = document.createElement("span");
     variationSpan.className = "variation";
     variationSpan.textContent = `${product.description}`;

     tdName.appendChild(productLink);
     tdName.appendChild(variationSpan);

     HTML_row.appendChild(tdName);

     // Product price
     const tdPrice = document.createElement("td");
     tdPrice.className = "product-name";

     const priceTitle = document.createElement("span");
     priceTitle.className = "product-price";
     priceTitle.setAttribute("data-title", "Price");
     priceTitle.textContent = product.price;

     const descriptionPrice = document.createElement("span");
     descriptionPrice.className = "variation";
     descriptionPrice.textContent = "+ VAT 23%";

     tdPrice.appendChild(priceTitle);
     tdPrice.appendChild(descriptionPrice);
     HTML_row.appendChild(tdPrice);

     // Product quantity
     const tdQuantity = document.createElement("td");
     tdQuantity.className = "product-quantity";
     tdQuantity.setAttribute("data-title", "Quantity");

     const qtyField = document.createElement("div");
     qtyField.className = "qtyField";

     const qtyMinus = document.createElement("a");
     qtyMinus.className = "qtyBtn minus";
     qtyMinus.href = "javascript:void(0);";
     qtyMinus.setAttribute("data-action", "decrement");
     qtyMinus.setAttribute("data-id", product.id);
     qtyMinus.innerHTML = `<i class="cps cp-minus"></i>`;

     const qtyInput = document.createElement("input");
     qtyInput.type = "text";
     qtyInput.name = "quantity";
     qtyInput.value = product.quantity;
     qtyInput.className = "product-form__input qty";
     qtyInput.readOnly = true;

     const qtyPlus = document.createElement("a");
     qtyPlus.className = "qtyBtn plus";
     qtyPlus.href = "javascript:void(0);";
     qtyPlus.setAttribute("data-action", "increment");
     qtyPlus.setAttribute("data-id", product.id);
     qtyPlus.innerHTML = `<i class="cps cp-plus"></i>`;

     qtyField.appendChild(qtyMinus);
     qtyField.appendChild(qtyInput);
     qtyField.appendChild(qtyPlus);
     tdQuantity.appendChild(qtyField);
     HTML_row.appendChild(tdQuantity);

     // Total price for the product
     const tdTotal = document.createElement("td");
     tdTotal.className = "product-name";

     const amountTotal = document.createElement("span");
     amountTotal.className = "product-subtotal";
     amountTotal.setAttribute("data-title", "Total");
     amountTotal.innerText = product.amountFormat;

     const grossTotal = document.createElement("span");
     grossTotal.className = "variation";
     grossTotal.innerText = product.grossAmount + " z VAT 23%";

     tdTotal.appendChild(amountTotal);
     tdTotal.appendChild(grossTotal);
     HTML_row.appendChild(tdTotal);
};

// Function to create "Clear Cart" and "Proceed to Checkout" buttons
const createClearCartButton = () => {
     // Create container div
     const containerDiv = document.createElement("div");
     containerDiv.className =
          "d-flex justify-content-between button-set-bottom";
     containerDiv.style.gap = "20px";
     containerDiv.style.marginBottom = "100px";

     // Create "Clear Cart" button
     const button = document.createElement("button");
     button.type = "button"; // Changed from "submit" to "button"
     button.name = "clear";
     button.className = "btn btn-border rounded-3 small--hide";
     button.textContent = i18n["cart-view"]["btns"]["clear-cart"];
     button.setAttribute("data-action", "clear");
     button.setAttribute("data-id", "");

     // Create "Proceed to Checkout" button
     const buttonGoLink = document.createElement("a");
     buttonGoLink.href = `${data.page.host}/summary`; // Ensure correct URL
     buttonGoLink.className = "btn btn-primary rounded-3 checkout small--hide";
     buttonGoLink.textContent = i18n["cart-view"]["btns"]["checkout"];
     buttonGoLink.style.minWidth = "200px";

     // Append buttons to container
     containerDiv.appendChild(button);
     containerDiv.appendChild(buttonGoLink);

     return containerDiv;
};

// Function to create table footer with total amount
const create_table_footer = (tbody, totalAmount, grossTotalAmount) => {
     const footerRow = document.createElement("tr");
     footerRow.className = "table-footer";

     // Empty cell to fill space
     const emptyCell = document.createElement("td");
     emptyCell.setAttribute("colspan", "5");
     emptyCell.style.textAlign = "right";
     emptyCell.textContent = i18n["cart-view"]["headers"]["total"] + ":";
     footerRow.appendChild(emptyCell);

     // Cell with total amount
     const totalCell = document.createElement("td");
     totalCell.className = "product-subtotal";
     totalCell.setAttribute("data-title", "Total");
     totalCell.innerHTML = `<p class="m-0 p-0">${totalAmount}</p><p class="m-0 p-0 font-bold">${grossTotalAmount} z VAT 23%</p>`;
     totalCell.style.fontWeight = "900";
     footerRow.appendChild(totalCell);

     // Append footer row to tbody
     tbody.appendChild(footerRow);
};

// Function to create "Start Shopping" button when cart is empty
const createStartShoppingButton = () => {
     // Create container div
     const containerDiv = document.createElement("div");
     containerDiv.className = "text-center my-5";

     // Create message
     const message = document.createElement("p");
     message.textContent = "Twój koszyk jest pusty.";
     message.style.fontSize = "1.5em";
     message.style.marginBottom = "20px";

     // Create button
     const button = document.createElement("a");
     button.href = data.page.host; // Ensure correct URL
     button.className = "btn btn-primary rounded-3";
     button.textContent = "Zacznij robić zakupy";

     // Append message and button to container
     containerDiv.appendChild(message);
     containerDiv.appendChild(button);

     return containerDiv;
};

// Function to generate the product table
const generate_product_table = () => {
     // Get the container where the table will be added
     const HTML_table_container = document.getElementById(
          "product-table-container"
     );

     if (!HTML_table_container) return;

     // Check if the cart is empty
     if (
          !data.shoppingCart ||
          !data.shoppingCart.lines ||
          data.shoppingCart.lines.length === 0
     ) {
          // Cart is empty, display message and button
          const emptyCartMessage = createStartShoppingButton();
          HTML_table_container.appendChild(emptyCartMessage);
          return;
     }

     // Cart is not empty, create the table
     const table = document.createElement("table");
     table.className = "table cart-products mb-4";
     table.id = "cart-table"; // Add id to table

     // Create table header
     const thead = document.createElement("thead");
     thead.innerHTML = `
        <tr>
            <th scope="col" class="alt-font"></th>
            <th scope="col" class="alt-font"></th>
            <th scope="col" class="alt-font">${i18n["cart-view"]["headers"]["product"]}</th>
            <th scope="col" class="alt-font">${i18n["cart-view"]["headers"]["price"]}</th>
            <th scope="col" class="alt-font text-center">${i18n["cart-view"]["headers"]["quantity"]}</th>
            <th scope="col" class="alt-font">${i18n["cart-view"]["headers"]["total"]}</th>
        </tr>
    `;
     table.appendChild(thead);

     // Create table body
     const tbody = document.createElement("tbody");

     let totalAmount = 0;

     // Iterate through products and create HTML elements
     data.shoppingCart.lines.forEach((product, index) => {
          create_cart_product(product, tbody, index);
          totalAmount += product.price * product.quantity;
     });

     // Add footer with total amount
     create_table_footer(
          tbody,
          data.shoppingCart.amountFormat,
          data.shoppingCart.grossAmountFormat
     );

     // Create buttons ("Clear Cart" and "Proceed to Checkout")
     const clearCartBtn = createClearCartButton();

     table.appendChild(tbody);
     HTML_table_container.appendChild(table);
     HTML_table_container.appendChild(clearCartBtn);

     // Add a single event listener to the table for handling product actions
     table.addEventListener("click", (e) => {
          e.preventDefault();
          let target = e.target;

          // Go to item
          if (e.target.name === "link") {
               window.location.href = e.target.href;
               return;
          }

          // Traverse up to find the <a> with data-action
          while (target && target !== table) {
               if (
                    target.tagName.toLowerCase() === "a" &&
                    target.getAttribute("data-action")
               ) {
                    const action = target.getAttribute("data-action");
                    const id = target.getAttribute("data-id");

                    // Get the quantity field
                    const qtyField = target.closest(".qtyField");
                    let quantity = 0;
                    if (qtyField) {
                         const qtyInput = qtyField.querySelector(
                              'input[name="quantity"]'
                         );
                         if (qtyInput) {
                              quantity = parseInt(qtyInput.value, 10);
                              if (action === "increment") {
                                   quantity += 1;
                              } else if (action === "decrement") {
                                   quantity = Math.max(quantity - 1, 0); // Ensure quantity is not less than 0
                              }
                              qtyInput.value = quantity; // Update input field
                         }
                    }

                    handleCartAction(action, id, quantity);
                    break;
               }
               target = target.parentElement;
          }
     });

     // **Corrected Event Listener for "Clear Cart" and "Proceed to Checkout" Buttons**
     clearCartBtn.addEventListener("click", (e) => {
          let target = e.target;

          // Traverse up to find the element with data-action="clear"
          while (target && target !== clearCartBtn) {
               if (target.getAttribute("data-action") === "clear") {
                    e.preventDefault(); // Prevent default only for the "Clear Cart" button
                    handleCartAction("clear", null);
                    break;
               }
               target = target.parentElement;
          }
     });
};

// Call the function to generate the table when the script runs
generate_product_table();
