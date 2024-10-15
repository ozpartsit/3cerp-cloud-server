// Function to get summary options
const get_summary_options = async (body) => {
     let url = $api.create_url({ type: "cart", action: "options" });

     const res = await $api.post(url, body, false);

     if (res.status === "success") {
          return res.data.docs;
     }

     use_notification("danger", res.error.message);

     return null;
};

// Function to update data in summary section
const update_summary = async (body) => {
     let url = $api.create_url({ type: "cart", action: "update" });

     const res = await $api.patch(url, body, true, true);

     if (res.status === "success") {
          return res;
     }

     use_notification("danger", res.error.message);

     return null;
};

// Function to set place order
const set_place_order = async () => {
     let url = $api.create_url({type: 'cart', action: 'confirm'})

     const res = await $api.put(url)

     if (res.status === "success") {
          return res;
     }

     use_notification("danger", res.error.message);

     return null;
}