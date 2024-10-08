const field = "item";
const subdoc = "favoriteItems";

// Function to add product to favorites
const add_favorites = async (id_product) => {
     let url = $api.create_url({ type: 'account', action: "update" });
     let body = { field, subdoc, value: id_product };

     const res = await $api.patch(url, body, false);

     if (res.status === "error") {
          use_notification("danger", res.error.message);

          return null;
     }

     use_notification("success", res.message);

     return true;
};

// Function to remvoe product from favorites
const remove_from_favorites = async (id_product) => {
     let url = $api.create_url({ type, action: "update" });
     let body = {
          field: "deleted",
          subdoc,
          value: true,
          subdoc_id: id_product,
     };

     const res = await $api.patch(url, body, false);

     if (res.status === "error") {
          use_notification("danger", res.error.message);

          return null;
     }

     use_notification("success", res.message);

     return res;
};
