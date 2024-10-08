const handleCartAction = async (action, id, quantity) => {
     console.log(`Action: ${action}, ID: ${id}, Quantity: ${quantity}`);

     if (!id && action !== "clear") return;

     let url;
     let body;
     let res;

     switch (action) {
          case "remove":
               // Usuwanie produktu z koszyka
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
               // Zmiana ilości produktu
               url = $api.create_url({ type: "cart", action: "update" });

               // Zapewnia, że ilość nie jest mniejsza niż 0
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

               res = await $api.post(url, {}, false);
               break;

          default:
               console.log("Nieznana akcja:", action);
               return;
     }

     if (res && res.status !== "error") {
          // Opcjonalnie aktualizuj cenę całkowitą w interfejsie użytkownika
          window.location.reload();
     } else {
          console.log("Błąd podczas wykonywania akcji:", action);
     }
};

// Funkcja tworząca wiersz produktu w tabeli
const create_cart_product = (product, HTML_list_products, index) => {
     if (!product.item) return;

     // Wiersz tabeli
     const HTML_row = document.createElement("tr");
     HTML_row.setAttribute("index", index);
     HTML_list_products.appendChild(HTML_row);

     // Kolumna usuwania produktu
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

     // Miniatura produktu
     const tdThumbnail = document.createElement("td");
     tdThumbnail.className = "product-thumbnail";
     const thumbnailLink = document.createElement("a");
     thumbnailLink.href = "single-product.html";
     const thumbnailImg = document.createElement("img");
     thumbnailImg.className = "blur-up rounded-3 lazyloaded";
     thumbnailImg.src = product.item.images[0]
          ? product.item.images[0].fullPath
          : "";
     thumbnailImg.alt = product.item.name;
     thumbnailImg.title = product.item.name;
     thumbnailLink.appendChild(thumbnailImg);
     tdThumbnail.appendChild(thumbnailLink);
     HTML_row.appendChild(tdThumbnail);

     // Nazwa i opis produktu
     const tdName = document.createElement("td");
     tdName.className = "product-name";
     const productLink = document.createElement("a");
     productLink.href = "single-product.html";
     productLink.textContent = product.item.name;
     const variationSpan = document.createElement("span");
     variationSpan.className = "variation";
     variationSpan.textContent = `Opis: ${product.description}`;
     tdName.appendChild(productLink);
     tdName.appendChild(variationSpan);
     HTML_row.appendChild(tdName);

     // Cena produktu
     const tdPrice = document.createElement("td");
     tdPrice.className = "product-price";
     tdPrice.setAttribute("data-title", "Price");
     tdPrice.textContent = `$${product.price.toFixed(2)}`;
     HTML_row.appendChild(tdPrice);

     // Ilość produktu
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

     // Całkowita cena produktu
     const tdTotal = document.createElement("td");
     tdTotal.className = "product-subtotal";
     tdTotal.setAttribute("data-title", "Total");
     const totalPrice = product.price * product.quantity;
     tdTotal.textContent = `$${totalPrice.toFixed(2)}`;
     HTML_row.appendChild(tdTotal);
};

// Funkcja tworząca przyciski "Wyczyść koszyk" i "Przejdź do kasy"
const createClearCartButton = () => {
     // Tworzenie kontenera div
     const containerDiv = document.createElement("div");
     containerDiv.className =
          "d-flex justify-content-between button-set-bottom mb-5";

     // Tworzenie przycisku "Wyczyść koszyk"
     const button = document.createElement("button");
     button.type = "submit";
     button.name = "clear";
     button.className = "btn btn-border rounded-3 small--hide mx-4";
     button.textContent = "Wyczyść koszyk";
     button.setAttribute("data-action", "clear");
     button.setAttribute("data-id", "");

     // Tworzenie przycisku "Przejdź do kasy"
     const buttonGo = document.createElement("button");
     buttonGo.type = "submit";
     buttonGo.name = "checkout";
     buttonGo.className = "btn btn-primary rounded-3 checkout small--hide mx-4";
     buttonGo.textContent = "Przejdź do kasy";

     // Opakowanie przycisku w hiperłącze
     const buttonGoLink = document.createElement("a");
     buttonGoLink.href = data.page.host + "/summarrdrdssdsy";
      
     buttonGoLink.appendChild(buttonGo);

     // Dodanie przycisków do kontenera
     containerDiv.appendChild(button);
     containerDiv.appendChild(buttonGoLink);

     return containerDiv;
};

// Funkcja tworząca stopkę tabeli z podsumowaniem
const create_table_footer = (tbody, totalAmount) => {
     const footerRow = document.createElement("tr");
     footerRow.className = "table-footer";

     // Pusta komórka do wypełnienia przestrzeni
     const emptyCell = document.createElement("td");
     emptyCell.setAttribute("colspan", "5");
     emptyCell.style.textAlign = "right";
     emptyCell.textContent = "Suma:";
     footerRow.appendChild(emptyCell);

     // Komórka z całkowitą sumą
     const totalCell = document.createElement("td");
     totalCell.className = "product-subtotal";
     totalCell.setAttribute("data-title", "Total");
     totalCell.textContent = `$${totalAmount.toFixed(2)}`;
     footerRow.appendChild(totalCell);

     // Dodanie wiersza stopki do tbody
     tbody.appendChild(footerRow);
};

// Funkcja tworząca przycisk "Zacznij robić zakupy"
const createStartShoppingButton = () => {
     // Tworzenie kontenera div
     const containerDiv = document.createElement("div");
     containerDiv.className = "text-center my-5";

     // Tworzenie komunikatu
     const message = document.createElement("p");
     message.textContent = "Twój koszyk jest pusty.";
     message.style.fontSize = "1.5em";
     message.style.marginBottom = "20px";

     // Tworzenie przycisku
     const button = document.createElement("a");
     button.href = data.page.host;
     button.className = "btn btn-primary rounded-3";
     button.textContent = "Zacznij robić zakupy";

     // Dodanie komunikatu i przycisku do kontenera
     containerDiv.appendChild(message);
     containerDiv.appendChild(button);

     return containerDiv;
};

// Funkcja generująca tabelę produktów
const generate_product_table = () => {
     // Pobranie kontenera, do którego zostanie dodana tabela
     const HTML_table_container = document.getElementById(
          "product-table-container"
     );

     if (!HTML_table_container) return;

     // Sprawdzenie, czy koszyk jest pusty
     if (
          !data.shoppingCart ||
          !data.shoppingCart.lines ||
          data.shoppingCart.lines.length === 0
     ) {
          // Koszyk jest pusty, wyświetlamy komunikat i przycisk
          const emptyCartMessage = createStartShoppingButton();
          HTML_table_container.appendChild(emptyCartMessage);
          return;
     }

     // Koszyk nie jest pusty, tworzymy tabelę
     // Utworzenie elementu tabeli
     const table = document.createElement("table");
     table.className = "table cart-products mb-4";
     table.id = "cart-table"; // Dodanie id do tabeli

     // Utworzenie nagłówka tabeli
     const thead = document.createElement("thead");
     thead.innerHTML = `
        <tr>
            <th scope="col" class="alt-font"></th>
            <th scope="col" class="alt-font"></th>
            <th scope="col" class="alt-font">Produkt</th>
            <th scope="col" class="alt-font">Cena</th>
            <th scope="col" class="alt-font text-center">Ilość</th>
            <th scope="col" class="alt-font">Razem</th>
        </tr>
    `;
     table.appendChild(thead);

     // Utworzenie ciała tabeli
     const tbody = document.createElement("tbody");

     let totalAmount = 0;

     // Przejście przez produkty i utworzenie elementów HTML
     data.shoppingCart.lines.forEach((product, index) => {
          create_cart_product(product, tbody, index);
          totalAmount += product.price * product.quantity;
     });

     // Dodanie stopki z podsumowaniem
     create_table_footer(tbody, totalAmount);

     // Dodanie przycisków
     const clearCartBtn = createClearCartButton();

     table.appendChild(tbody);
     HTML_table_container.appendChild(table);
     HTML_table_container.appendChild(clearCartBtn);

     // Dodanie jednego nasłuchiwania na tabelę
     // Wewnątrz Twojego nasłuchiwania zdarzeń dla tabeli
     table.addEventListener("click", (e) => {
          e.preventDefault();
          let target = e.target;

          // Znajdowanie elementu <a> z atrybutem data-action
          while (target && target !== table) {
               if (
                    target.tagName.toLowerCase() === "a" &&
                    target.getAttribute("data-action")
               ) {
                    const action = target.getAttribute("data-action");
                    const id = target.getAttribute("data-id");

                    // Pobierz pole ilości
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
                                   quantity = Math.max(quantity - 1, 0); // Zapewnia, że ilość nie jest mniejsza niż 0
                              }
                              qtyInput.value = quantity; // Aktualizuj pole input
                         }
                    }

                    handleCartAction(action, id, quantity);
                    break;
               }
               target = target.parentElement;
          }
     });

     // Nasłuchiwanie na przycisk "Wyczyść koszyk"
     clearCartBtn.addEventListener("click", (e) => {
          e.preventDefault();
          let target = e.target;
          if (target.getAttribute("data-action") === "clear") {
               handleCartAction("clear", null);
          }
     });
};

// Wywołanie funkcji generującej tabelę
generate_product_table();
