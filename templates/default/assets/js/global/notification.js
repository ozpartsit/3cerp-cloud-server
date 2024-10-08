const use_notification = (type, text) => {
    let allow_types = ["success", "danger", "warning", "info"];

    if (!allow_types.includes(type)) return;

    let style_types = {
         success: {
              bgColor: "#95DC5C",
              color: "#FFF",
         },
         danger: {
              bgColor: "#F54237",
              color: "#FFF",
         },
         warning: {
              bgColor: "#E9A401",
              color: "#FFF",
         },
         info: {
              bgColor: "#1677FF",
              color: "#FFF",
         },
    };

    let div = document.createElement("div");
    let id = `alert-${Math.round(Math.random(9))}`;

    div.classList.add("alert");
    div.classList.add("position-fixed");
    div.classList.add("top-0");
    div.classList.add("end-0");
    div.classList.add("m-3");
    div.classList.add("animate__animated");
    div.classList.add("animate__fadeInRight");

    div.style.zIndex = "1000";
    div.style.animationDuration = "0.3s";

    div.style.backgroundColor = style_types[type].bgColor;
    div.style.width = "300px";
    div.style.color = style_types[type].color;

    div.innerHTML = text ? text : i18n.alerts[type];

    div.setAttribute("role", "alert");
    div.setAttribute("id", id);

    document.body.appendChild(div);

    setTimeout(() => {
         return div.remove();
    }, 3000);
};