const type_account = "account";

// Function to get options in forms in acount section
const get_options_account = async (field, subdoc) => {
     let url = $api.create_url({ type: type_account, action: "options" });

     let body = { field, subdoc };

     const res = await $api.post(url, body, false);

     if (res.status === "success") {
          return res.data.docs;
     }

     use_notification("denger", res.error.message);

     return null;
};

// Function to update data in account section
const update_account = async (body) => {
     let url = $api.create_url({ type: type_account, action: "update" });

     const res = await $api.patch(url, body, true, true);

     if (res.status === "success") {
          use_notification("success", res.message);

          window.location.reload();

          return;
     }

     use_notification("danger", res.error.message);

     return;
};
