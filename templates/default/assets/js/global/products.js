const HTML_products_container = document.querySelector(
     "[name='container_products']"
);

// Add lisener to container
if (HTML_products_container) {
     HTML_products_container.addEventListener("click", async (e) => {
          let action = e.target.getAttribute("action");
          let id = e.target.getAttribute("product_id");

          if (!id) return;
          e.preventDefault();

          if (action === "add_to_cart") {
               const success = await add_to_cart(id, 1);

               return;
          }

          if (action === "add_to_favorites") {
               const success = await add_favorites(id);

               return;
          }
     });
}
