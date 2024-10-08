// Function to serach product from topbar
const search_product = (keywords) => {
     if (!keywords) return;

     let url = data.page.host + "/search?keyword=" + keywords;

     console.log(url)

     window.location.href = url;
};
