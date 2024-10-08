const type = "cart";

// Function to add product to cart
const add_to_cart = async (id_product, quantity) => {
     const url = $api.create_url({ type, action: "add" });
     let body = {
          item: id_product,
          quantity,
     };

     const res = await $api.put(url, body, false);

     if (res.status !== "error") {
          use_notification("success", res.message);

          // Function from top-bar.ejs
          update_badge_cart(res.data.document.quantity);

          return "success";
     }

     use_notification("danger", res.error.message);

     return null;
};

// Function to remove product from cart
const remove_from_cart = async (id_product) => {
     if (!id_product) return;

     let body = {
          field: "deleted",
          value: true,
          subdoc: "lines",
          subdoc_id: id_product,
     };

     let url = $api.create_url({ type, action: "update" });

     const res = await $api.patch(url, body, false);

     if (res.status !== "error") {
          use_notification("success", res.message);

          return "success";
     }
     use_notification("danger", res.error.message);

     return null;
};

// Function to update product in cart
const update_in_cart = async (id_product, field, value) => {
     if (!id_product) return;

     let url = $api.create_url({ type, action: "update" });
     let subdoc = "lines";
     let subdoc_id = id_product;
     let body = { field, subdoc, value, subdoc_id };

     const res = await $api.patch(url, body, false);

     if (res.status !== "error") {
          use_notification("success", res.message);

          return "success";
     }
     use_notification("danger", res.error.message);

     return null;
};

// Function to get products in cart
const get_products_cart = async () => {
     const url = $api.create_url({ type });

     const res = await $api.get(url);

     if (res.status !== "error") {
          return res;
     }
     use_notification("danger", res.error.message);

     return null;
};
