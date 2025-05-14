class Api {
     host = "/api";
     headers = new Headers();
     options = {};

     set_cookie() {
          return this.headers.append(
               "Cookie",
               "shoppingcart=j%3A%2266bb272e573f3ceb3a5061b8%22"
          );
     }

     set_hearders(isContentType) {
          if (!isContentType) return this.headers;

          this.headers.append("content-type", "application/json");

          return this.headers;
     }

     set_options(method, body, stringify = true, isContentType = false) {
          this.options = {
               method: method,
               headers: this.set_hearders(isContentType),
               redirect: "follow",
               body: stringify ? JSON.stringify(body) : body,
          };
          return;
     }

     //   Method to create form data
     create_form_data(body = {}) {

          if (body.length) {
               return body;
          }

          const form_data = new FormData();

          for (const key in body) {
               form_data.append(key, body[key]);
          }

          return form_data;
     }

     create_url(params = {}) {
          let url = this.host;

          for (const param in params) {
               url = url + "/" + params[param];
          }
          return url;
     }

     //  METHOD GET
     async get(url) {
          //this.set_cookie();
          this.set_options("GET");

          try {
               const res = await fetch(url, this.options)
                    .then((response) => response.json())
                    .then((result) => result);

               return res;
          } catch (error) {
               create_alert("danger", i18n);

               return error;
          }
     }

     //   METHOD POST
     async post(url = "", body = {}, stringify = true) {
          //this.set_cookie();

          this.set_options("POST", this.create_form_data(body), stringify);

          try {
               const res = await fetch(url, this.options)
                    .then((response) => response.json())
                    .then((result) => result);

               return res;
          } catch (error) {
               create_alert("danger", i18n);

               return null;
          }
     }

     //   METHOD PUT
     async put(url, body, stringify = true) {
          //this.set_cookie();
          this.set_options("PUT", this.create_form_data(body), stringify);

          try {
               const res = await fetch(url, this.options)
                    .then((response) => response.json())
                    .then((result) => result);

               return res;
          } catch (error) {
               create_alert("danger", i18n);
               return null;
          }
     }

     //   METHOD PATCH
     async patch(url, body = {}, stringify = true, isContentType = false) {
          //this.set_cookie();
          this.set_options("PATCH", this.create_form_data(body), stringify, isContentType);

          try {
               const res = await fetch(url, this.options)
                    .then((response) => response.json())
                    .then((result) => result);

               return res;
          } catch (error) {
               use_notification("danger", error.message);
          }
     }
}

const $api = new Api();
