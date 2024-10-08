// Function that checks whether a page banner should be displayed on a particular view
const show_page_banner = (view) => {
     let page_banner = document.querySelector("#page_banner");

     if (!page_banner) return;

     let not_allow_views = ['home'];

     if (!not_allow_views.includes(view)) return;

     return page_banner.remove();
};

show_page_banner(view);
