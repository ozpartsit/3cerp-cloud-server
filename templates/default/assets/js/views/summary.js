// SUMMARY ORDER
function generateOrderTable(shoppingCart, containerId) {
     // Znajdź kontener, do którego zostanie dodana tabela
     const container = document.getElementById(containerId);
     if (!container) {
          return;
     }

     // Utwórz główny div z klasami
     const tableResponsiveDiv = document.createElement("div");
     tableResponsiveDiv.className = "table-responsive-sm order-table";

     // Utwórz tabelę z klasami
     const table = document.createElement("table");
     table.className = "table table-hover text-center";

     // Utwórz nagłówek tabeli
     const thead = document.createElement("thead");
     thead.innerHTML = `
        <tr>
            <th class="text-start">Produkt</th>
            <th class="text-end">Suma</th>
        </tr>
    `;
     table.appendChild(thead);

     // Utwórz ciało tabeli
     const tbody = document.createElement("tbody");

     // Iteruj przez każdą linię w koszyku i dodaj wiersz do tabeli
     if (shoppingCart.lines) {
          shoppingCart.lines.forEach((line) => {
               if (line.item) {
                    const tr = document.createElement("tr");

                    // Komórka z nazwą produktu i opisem
                    const tdProduct = document.createElement("td");
                    tdProduct.className = "text-start";

                    // Nazwa produktu
                    const productName = document.createElement("div");
                    console.log(line);
                    productName.textContent = line.item.name;
                    tdProduct.appendChild(productName);

                    tr.appendChild(tdProduct);

                    // Komórka z sumą (cena * ilość + podatek)
                    const tdSubtotal = document.createElement("td");
                    tdSubtotal.className = "text-end";

                    // Oblicz sumę: (cena * ilość) + podatek
                    const subtotal =
                         line.price * line.quantity + line.taxAmount;
                    tdSubtotal.textContent = `${
                         shoppingCart.currency
                    } ${subtotal.toFixed(2)}`;

                    tr.appendChild(tdSubtotal);

                    // Dodaj wiersz do ciała tabeli
                    tbody.appendChild(tr);
               }
          });
     }

     table.appendChild(tbody);

     // Utwórz stopkę tabeli
     const tfoot = document.createElement("tfoot");

     // Funkcja pomocnicza do tworzenia wierszy w stopce
     const createFooterRow = (label, value, additionalClass = "") => {
          const tr = document.createElement("tr");

          const tdLabel = document.createElement("td");
          tdLabel.style.marginTop = "20px";
          tdLabel.className = `text-start text-uppercase ${additionalClass}`;
          tdLabel.innerHTML = `<b>${label}</b>`;
          tr.appendChild(tdLabel);

          const tdValue = document.createElement("td");
          tdValue.className = "text-end";
          tdValue.textContent = value;
          tr.appendChild(tdValue);

          return tr;
     };

     // Oblicz wartości do stopki
     const subtotalAmount = shoppingCart.amount;
     const shippingCost = shoppingCart.shippingCost || 0;
     const totalAmount = shoppingCart.grossAmount + shippingCost; // Łączna suma brutto + wysyłka

     // Dodaj wiersze do stopki
     tfoot.appendChild(
          createFooterRow(
               "Subtotal",
               `${shoppingCart.currency} ${subtotalAmount.toFixed(2)}`
          )
     );
     tfoot.appendChild(
          createFooterRow(
               "Shipping",
               `${shoppingCart.currency} ${shippingCost.toFixed(2)}`
          )
     );
     tfoot.appendChild(
          createFooterRow(
               "Total",
               `${shoppingCart.currency} ${totalAmount.toFixed(2)}`,
               "red-text"
          )
     );

     table.appendChild(tfoot);

     // Dodaj tabelę do głównego div
     tableResponsiveDiv.appendChild(table);

     // Wyczyść zawartość kontenera i dodaj nową tabelę
     container.innerHTML = "";
     container.appendChild(tableResponsiveDiv);
}

generateOrderTable(data.shoppingCart, "order-table-container");

// FORM
// Funkcja inicjująca formularz
function initDynamicForm() {
     // Sprawdzenie, czy formularz już istnieje
     if (document.getElementById("billing-form")) {
          return; // Formularz już został zainicjalizowany
     }

     const formContainer = document.getElementById("form-container");

     // Funkcja do tworzenia elementów z klasami i atrybutami
     function createElement(tag, attributes = {}, ...children) {
          const element = document.createElement(tag);
          for (let key in attributes) {
               if (key === "class") {
                    element.className = attributes[key];
               } else if (key === "innerHTML") {
                    element.innerHTML = attributes[key];
               } else if (key === "for") {
                    // Obsługa atrybutu 'for' dla label
                    element.htmlFor = attributes[key];
               } else {
                    element.setAttribute(key, attributes[key]);
               }
          }
          children.forEach((child) => {
               if (typeof child === "string") {
                    element.appendChild(document.createTextNode(child));
               } else {
                    element.appendChild(child);
               }
          });
          return element;
     }

     // Tworzenie struktury formularza
     const billingDetailDiv = createElement("div", {
          class: "container mt-4 mb-3 billing-detail",
     });

     const blockContent = createElement("div", { class: "block-content" });

     const title = createElement("h2", {
          class: "title text-uppercase my-4",
          innerHTML: "Billing details",
     });

     // Checkbox "Ship to a different address?"
     const cartTermDiv = createElement("div", {
          class: "cart_term my-3",
     });
     const shipBoxInput = createElement("input", {
          type: "checkbox",
          id: "ship-box",
          class: "form-check-input",
     });
     const shipBoxLabel = createElement("label", {
          for: "ship-box",
          class: "mx-2",
          innerHTML: "<b>Ship to a different address?</b>",
     });
     cartTermDiv.appendChild(shipBoxInput);
     cartTermDiv.appendChild(shipBoxLabel);

     // Formularz Billing Details
     const createAcContent = createElement("div", {
          class: "create-ac-content",
     });
     const billingForm = createElement("form", {
          id: "billing-form",
          method: "post",
          action: "#",
     });
     const fieldset = createElement("fieldset");

     // Helper function to create input fields
     function createInputField(labelText, inputAttributes) {
          const formGroup = createElement("div", {
               class: "form-group mb-2",
          });
          const label = createElement("label", {
               class: "form-label",
               innerHTML: labelText,
          });
          const input = createElement("input", {
               ...inputAttributes,
               class: "form-control",
          });
          formGroup.appendChild(label);
          formGroup.appendChild(input);
          return formGroup;
     }

     // Helper function to create select fields
     function createSelectField(labelText, selectAttributes, options = []) {
          const formGroup = createElement("div", {
               class: "form-group mb-2",
          });
          const label = createElement("label", {
               class: "form-label",
               innerHTML: labelText,
          });
          const select = createElement("select", {
               ...selectAttributes,
               class: "form-control",
          });
          options.forEach((option) => {
               const optionElement = createElement("option", {
                    value: option.value,
                    innerHTML: option.text,
               });
               select.appendChild(optionElement);
          });
          formGroup.appendChild(label);
          formGroup.appendChild(select);
          return formGroup;
     }

     // Tworzenie wierszy formularza
     function createRow(columns) {
          const row = createElement("div", { class: "row" });
          columns.forEach((col) => row.appendChild(col));
          return row;
     }

     // Billing Details Fields
     // First Name and Last Name
     const firstNameField = createInputField(
          'First Name <span class="required">*</span>',
          {
               name: "firstname",
               id: "input-firstname",
               type: "text",
               required: true,
          }
     );
     const lastNameField = createInputField(
          'Last Name <span class="required">*</span>',
          {
               name: "lastname",
               id: "input-lastname",
               type: "text",
               required: true,
          }
     );
     const row1 = createRow([
          firstNameField.cloneNode(true),
          lastNameField.cloneNode(true),
     ]);
     row1.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     row1.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Company
     const companyField = createInputField("Company", {
          name: "company",
          id: "input-company",
          type: "text",
     });
     const row2 = createRow([companyField.cloneNode(true)]);
     row2.children[0].classList.add("col-12");

     // E-Mail and Phone
     const emailField = createInputField(
          'E-Mail <span class="required">*</span>',
          {
               name: "email",
               id: "input-email",
               type: "email",
               required: true,
          }
     );
     const phoneField = createInputField(
          'Phone <span class="required">*</span>',
          {
               name: "telephone",
               id: "input-telephone",
               type: "tel",
               required: true,
          }
     );
     const row3 = createRow([
          emailField.cloneNode(true),
          phoneField.cloneNode(true),
     ]);
     row3.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     row3.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Street Address
     const address1Field = createInputField(
          'Street address <span class="required">*</span>',
          {
               name: "address_1",
               id: "input-address-1",
               type: "text",
               required: true,
               placeholder: "Street address",
          }
     );
     const row4 = createRow([address1Field.cloneNode(true)]);
     row4.children[0].classList.add("col-12");

     // Apartment/Suite/etc.
     const address2Field = createInputField("", {
          name: "address_2",
          id: "input-address-2",
          type: "text",
          placeholder: "Apartment, suite, unit etc. (optional)",
     });
     const row5 = createRow([address2Field.cloneNode(true)]);
     row5.children[0].classList.add("col-12");

     // Postcode/ZIP and Country
     const postcodeField = createInputField(
          'Postcode / ZIP <span class="required">*</span>',
          {
               name: "postcode",
               id: "input-postcode",
               type: "text",
               required: true,
          }
     );
     const countryField = createSelectField(
          'Country <span class="required">*</span>',
          {
               id: "address_country",
               name: "address[country]",
               required: true,
          },
          [
               { value: "", text: "Select Country" },
               { value: "US", text: "United States" },
               { value: "PL", text: "Poland" },
               // Dodaj inne kraje tutaj
          ]
     );
     const row6 = createRow([
          postcodeField.cloneNode(true),
          countryField.cloneNode(true),
     ]);
     row6.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     row6.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // State and Town/City
     const stateField = createSelectField(
          'State <span class="required">*</span>',
          {
               id: "address_State",
               name: "address[state]",
               required: true,
          },
          [
               { value: "", text: "Select State" },
               // Dodaj stany tutaj
          ]
     );
     const townField = createSelectField(
          'Town / City <span class="required">*</span>',
          {
               id: "address_province",
               name: "address[province]",
               required: true,
          },
          [
               { value: "", text: "Select Town / City" },
               // Dodaj miasta tutaj
          ]
     );
     const row7 = createRow([
          stateField.cloneNode(true),
          townField.cloneNode(true),
     ]);
     row7.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     row7.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Shipping Details (domyślnie ukryte)
     const shipBoxInfoDiv = createElement("div", {
          id: "ship-box-info",
          class: "d-none pl-0",
     });
     const shippingTitle = createElement("h2", {
          class: "title text-uppercase my-4",
          innerHTML: "Shipping details",
     });

     // Shipping First Name and Last Name
     const shippingFirstNameField = createInputField(
          'First Name <span class="required">*</span>',
          {
               name: "firstname_shipping",
               id: "input-firstname1",
               type: "text",
               required: true,
          }
     );
     const shippingLastNameField = createInputField(
          'Last Name <span class="required">*</span>',
          {
               name: "lastname_shipping",
               id: "input-lastname1",
               type: "text",
               required: true,
          }
     );
     const shippingRow1 = createRow([
          shippingFirstNameField.cloneNode(true),
          shippingLastNameField.cloneNode(true),
     ]);
     shippingRow1.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     shippingRow1.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Shipping Company
     const shippingCompanyField = createInputField("Company", {
          name: "company_shipping",
          id: "input-company1",
          type: "text",
     });
     const shippingRow2 = createRow([shippingCompanyField.cloneNode(true)]);
     shippingRow2.children[0].classList.add("col-12");

     // Shipping E-Mail and Phone
     const shippingEmailField = createInputField(
          'E-Mail <span class="required">*</span>',
          {
               name: "email_shipping",
               id: "input-email1",
               type: "email",
               required: true,
          }
     );
     const shippingPhoneField = createInputField(
          'Phone <span class="required">*</span>',
          {
               name: "telephone_shipping",
               id: "input-telephone1",
               type: "tel",
               required: true,
          }
     );
     const shippingRow3 = createRow([
          shippingEmailField.cloneNode(true),
          shippingPhoneField.cloneNode(true),
     ]);
     shippingRow3.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     shippingRow3.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Shipping Street Address
     const shippingAddress1Field = createInputField(
          'Street address <span class="required">*</span>',
          {
               name: "address_1_shipping",
               id: "input-address-11",
               type: "text",
               required: true,
               placeholder: "Street address",
          }
     );
     const shippingRow4 = createRow([shippingAddress1Field.cloneNode(true)]);
     shippingRow4.children[0].classList.add("col-12");

     // Shipping Apartment/Suite/etc.
     const shippingAddress2Field = createInputField("", {
          name: "address_2_shipping",
          id: "input-address-21",
          type: "text",
          placeholder: "Apartment, suite, unit etc. (optional)",
     });
     const shippingRow5 = createRow([shippingAddress2Field.cloneNode(true)]);
     shippingRow5.children[0].classList.add("col-12");

     // Shipping Postcode/ZIP and Country
     const shippingPostcodeField = createInputField(
          'Postcode / ZIP <span class="required">*</span>',
          {
               name: "postcode_shipping",
               id: "input-postcode1",
               type: "text",
               required: true,
          }
     );
     const shippingCountryField = createSelectField(
          'Country <span class="required">*</span>',
          {
               id: "address_country1",
               name: "address_shipping[country]",
               required: true,
          },
          [
               { value: "", text: "Select Country" },
               { value: "US", text: "United States" },
               { value: "PL", text: "Poland" },
               // Dodaj inne kraje tutaj
          ]
     );
     const shippingRow6 = createRow([
          shippingPostcodeField.cloneNode(true),
          shippingCountryField.cloneNode(true),
     ]);
     shippingRow6.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     shippingRow6.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Shipping State and Town/City
     const shippingStateField = createSelectField(
          'State <span class="required">*</span>',
          {
               id: "address_State1",
               name: "address_shipping[state]",
               required: true,
          },
          [
               { value: "", text: "Select State" },
               // Dodaj stany tutaj
          ]
     );
     const shippingTownField = createSelectField(
          'Town / City <span class="required">*</span>',
          {
               id: "address_province1",
               name: "address_shipping[province]",
               required: true,
          },
          [
               { value: "", text: "Select Town / City" },
               // Dodaj miasta tutaj
          ]
     );
     const shippingRow7 = createRow([
          shippingStateField.cloneNode(true),
          shippingTownField.cloneNode(true),
     ]);
     shippingRow7.children[0].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );
     shippingRow7.children[1].classList.add(
          "col-12",
          "col-sm-6",
          "col-md-6",
          "col-lg-6"
     );

     // Dodawanie wszystkich pól do Shipping Details
     shipBoxInfoDiv.appendChild(shippingTitle);
     shipBoxInfoDiv.appendChild(shippingRow1);
     shipBoxInfoDiv.appendChild(shippingRow2);
     shipBoxInfoDiv.appendChild(shippingRow3);
     shipBoxInfoDiv.appendChild(shippingRow4);
     shipBoxInfoDiv.appendChild(shippingRow5);
     shipBoxInfoDiv.appendChild(shippingRow6);
     shipBoxInfoDiv.appendChild(shippingRow7);

     // Order Notes
     const orderNotesLabel = createElement("label", {
          for: "order-notes",
          class: "form-label",
          innerHTML: "Order Notes (optional)",
     });
     const orderNotesTextarea = createElement("textarea", {
          id: "order-notes",
          class: "resize-both form-control",
          rows: "3",
          placeholder:
               "Notes about your order, e.g. special notes for delivery.",
     });
     const orderNotesFormGroup = createElement("div", {
          class: "form-group col-12 mb-0",
     });
     orderNotesFormGroup.appendChild(orderNotesLabel);
     orderNotesFormGroup.appendChild(orderNotesTextarea);
     const orderNotesRow = createRow([orderNotesFormGroup]);

     // Submit Button
     const submitButton = createElement("button", {
          type: "submit",
          class: "btn btn-primary mt-3",
          innerHTML: "Submit",
     });
     const submitRow = createRow([
          createElement("div", { class: "form-group col-12" }, submitButton),
     ]);

     // Dodanie wszystkich wierszy do fieldset
     fieldset.appendChild(row1);
     fieldset.appendChild(row2);
     fieldset.appendChild(row3);
     fieldset.appendChild(row4);
     fieldset.appendChild(row5);
     fieldset.appendChild(row6);
     fieldset.appendChild(row7);
     fieldset.appendChild(
          createRow([
               createElement(
                    "div",
                    { class: "form-group col-12" },
                    shipBoxInfoDiv
               ),
          ])
     );
     fieldset.appendChild(orderNotesRow);
     fieldset.appendChild(submitRow);

     billingForm.appendChild(fieldset);
     createAcContent.appendChild(billingForm);
     blockContent.appendChild(title);
     blockContent.appendChild(cartTermDiv);
     blockContent.appendChild(createAcContent);

     // Coupon Section
     const couponSection = createElement("div", {
          class: "customer-box customer-coupon mb-3",
     });
     const couponHeader = createElement("div", {
          class: "rounded-1 m-0",
          innerHTML: '<i class="cp-lg cps cp-gifts"></i> Have a coupon?',
     });
     const couponContent = createElement("div", {
          class: "coupon-checkout-content",
     });
     const discountCoupon = createElement("div", {
          class: "rounded-bottom discount-coupon",
     });
     const couponTab = createElement("div", {
          id: "coupon",
          class: "coupon-dec tab-pane active",
     });

     let couponCounter = 1; // Inicjalizacja licznika
     const uniqueCouponId = "coupon-code-" + couponCounter;

     const couponForm = createElement("form", {
          id: "coupon-form-" + couponCounter,
          method: "post",
          action: "#",
     });

     const couponText = createElement("p", {
          class: "mb-2 form-text",
          innerHTML: "Enter your coupon code if you have one.",
     });
     const couponInput = createElement("input", {
          id: uniqueCouponId, // Unikalny id
          type: "text",
          class: "mb-3 form-control",
          placeholder: "Coupon Code",
          required: true,
     });
     const couponButton = createElement("button", {
          class: "coupon-btn btn btn-secondary rounded",
          type: "submit",
          innerHTML: "Apply Coupon",
     });
     const couponFormGroup = createElement("div", {
          class: "form-group mb-0",
     });
     couponFormGroup.appendChild(couponInput);
     couponFormGroup.appendChild(couponButton);
     couponForm.appendChild(couponText);
     couponForm.appendChild(couponFormGroup);
     couponTab.appendChild(couponForm);
     discountCoupon.appendChild(couponTab);
     couponContent.appendChild(discountCoupon);
     couponSection.appendChild(couponHeader);
     couponSection.appendChild(couponContent);

     blockContent.appendChild(createElement("hr", { class: "mt-5 mb-4" }));
     blockContent.appendChild(couponSection);

     billingDetailDiv.appendChild(blockContent);
     formContainer.appendChild(billingDetailDiv);

     // Skrypt JavaScript do dynamicznego logowania danych formularza
     // Funkcja do zbierania danych z formularza
     function collectFormData() {
          const formData = {};

          // Zbieranie danych Billing
          formData.billing = {
               firstname: document.getElementById("input-firstname").value,
               lastname: document.getElementById("input-lastname").value,
               company: document.getElementById("input-company").value,
               email: document.getElementById("input-email").value,
               telephone: document.getElementById("input-telephone").value,
               address_1: document.getElementById("input-address-1").value,
               address_2: document.getElementById("input-address-2").value,
               postcode: document.getElementById("input-postcode").value,
               country: document.getElementById("address_country").value,
               state: document.getElementById("address_State").value,
               province: document.getElementById("address_province").value,
          };

          // Sprawdzanie czy zaznaczono wysyłkę na inny adres
          if (document.getElementById("ship-box").checked) {
               formData.shipping = {
                    firstname:
                         document.getElementById("input-firstname1").value,
                    lastname: document.getElementById("input-lastname1").value,
                    company: document.getElementById("input-company1").value,
                    email: document.getElementById("input-email1").value,
                    telephone:
                         document.getElementById("input-telephone1").value,
                    address_1:
                         document.getElementById("input-address-11").value,
                    address_2:
                         document.getElementById("input-address-21").value,
                    postcode: document.getElementById("input-postcode1").value,
                    country: document.getElementById("address_country1").value,
                    state: document.getElementById("address_State1").value,
                    province:
                         document.getElementById("address_province1").value,
               };
          }

          // Dodatkowe informacje z textarea
          formData.order_notes = document.getElementById("order-notes").value;

          // Logowanie obiektu do konsoli
          console.log(formData);
     }

     // Nasłuchiwanie na wszystkie zmiany w formularzu Billing
     billingForm.addEventListener("input", collectFormData);

     // Nasłuchiwanie na zmianę checkboxa "Ship to a different address?"
     shipBoxInput.addEventListener("change", function () {
          const shipBoxInfo = document.getElementById("ship-box-info");
          if (this.checked) {
               shipBoxInfo.classList.remove("d-none");
          } else {
               shipBoxInfo.classList.add("d-none");
          }
          collectFormData(); // Logowanie danych po zmianie checkboxa
     });

     // Obsługa submit formularza Billing
     billingForm.addEventListener("submit", function (event) {
          event.preventDefault(); // Zapobiega domyślnej akcji formularza
          collectFormData();
          alert("Formularz został przesłany. Sprawdź konsolę dla danych.");
     });

     // Obsługa formularza kuponu
     couponForm.addEventListener("submit", function (event) {
          event.preventDefault(); // Zapobiega domyślnej akcji formularza
          const couponCode = document.getElementById(uniqueCouponId).value;
          console.log({ coupon: couponCode });
          alert("Kupon został zastosowany. Sprawdź konsolę dla danych.");
     });
}

// Uruchomienie funkcji inicjującej po załadowaniu DOM
if (view === "summary") {
     document.addEventListener("DOMContentLoaded", initDynamicForm);
}
