// let catId = false;

// const categoryFilter = async (id, page = 1) => {
//     catId = document.getElementById('cat_id' + id).value;
//     console.log(catId, 'am cat idddd');

//     const response = await fetch(`/category_fil`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             catId: catId,
//             page: page
//         })
//     });

//     const data = await response.json();
//     console.log(data);

//     if (data.productData.length > 0) {
//         filteredDataDisplay(data.productData);
//         updatePagination(data.pages, data.currentPage, 'categoryFilter', catId);
//     } else {
//         proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
//         clearPagination();
//     }
// };




let catId = false;

const categoryFilter = async (id, page = 1) => {
    
    catId = document.getElementById('cat_id' + id).value;


    const response = await fetch(`/category_fil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            catId: catId,
            page: page
        })
    });

    const data = await response.json();


    if (data.productData.length > 0) {
        filteredDataDisplay(data.productData);
        updatePagination(data.pages, data.currentPage, 'categoryFilter', catId);
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
        clearPagination();
    }
};

const getProductsPage = async (page, catId = '', sort = '') => {
    const response = await fetch('/product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page, catId, sort })
    });

    const data = await response.json();
    if (data.proData.length > 0) {
        filteredDataDisplay(data.proData);
        updatePagination(data.pages, data.currentPage, 'getProductsPage', catId, sort);
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
        clearPagination();
    }
};




const sortLowToHigh = async (page = 1) => {
    const sort = 1;

    const response = await fetch(`/sort_product_price`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sort: sort,
            catId: catId ,
            page: page
        })
    });

    const data = await response.json();
    if (data.productData.length > 0) {
        filteredDataDisplay(data.productData);
        updatePagination(data.pages, data.currentPage, 'sortLowToHigh', catId, sort);
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
        clearPagination();
    }
};




const sortHighToLow = async (page = 1) => {
    const sort = -1;
    const response = await fetch(`/sort_product_price`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sort: sort,
            catId: catId,
            page: page
        })
    });

    const data = await response.json();
    if (data.productData.length > 0) {
        filteredDataDisplay(data.productData);
        updatePagination(data.pages, data.currentPage, 'sortHighToLow', catId, sort);
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
        clearPagination();
    }
};



// Function to update pagination links for High to low low to high
// const updatePagination = (pages, currentPage, currentFunction, catId = '', sort = '') => {
//     const paginationList = document.getElementById("paginationList");
//     paginationList.innerHTML = "";

//     pages.forEach(page => {
//         const listItem = document.createElement("li");
//         listItem.classList.add("page-item");
//         if (page === currentPage) {
//             listItem.classList.add("active");
//         }
//         const link = document.createElement("a");
//         link.classList.add("page-link");
//         link.href = `javascript:${currentFunction}(${page});`;
//         link.innerText = page;
//         listItem.appendChild(link);
//         paginationList.appendChild(listItem);
//     });
// };



//////////////////just experiment

const updatePagination = (pages, currentPage, currentFunction, catId = '', sort = '') => {
    if(currentFunction == 'categoryFilter'){


    const paginationList = document.getElementById("paginationList");
    paginationList.innerHTML = "";

    pages.forEach(page => {
        const listItem = document.createElement("li");
        listItem.classList.add("page-item");
        if (page === currentPage) {
            listItem.classList.add("active");
        }
        const link = document.createElement("a");
        link.classList.add("page-link");
        if (sort) {
            link.href = `javascript:${currentFunction}(${catId ? `'${catId}'` : 'null'}, ${page}, '${sort}');`;
        } else {
            link.href = `javascript:${currentFunction}(${catId ? `'${catId}'` : 'null'}, ${page});`;
        }
        link.innerText = page;
        listItem.appendChild(link);
        paginationList.appendChild(listItem);
    });
}
 else{

    const paginationList = document.getElementById("paginationList");
    paginationList.innerHTML = "";

    pages.forEach(page => {
        const listItem = document.createElement("li");
        listItem.classList.add("page-item");
        if (page === currentPage) {
            listItem.classList.add("active");
        }
        const link = document.createElement("a");
        link.classList.add("page-link");
        link.href = `javascript:${currentFunction}(${page});`;
        link.innerText = page;
        listItem.appendChild(link);
        paginationList.appendChild(listItem);
    });

 }
};






//it is woring for category
// const updatePagination = (pages, currentPage, currentFunction, catId = '', sort = '') => {
//     const paginationList = document.getElementById("paginationList");
//     paginationList.innerHTML = "";

//     pages.forEach(page => {
//         const listItem = document.createElement("li");
//         listItem.classList.add("page-item");
//         if (page === currentPage) {
//             listItem.classList.add("active");
//         }
//         const link = document.createElement("a");
//         link.classList.add("page-link");
//         if (sort) {
//             link.href = `javascript:${currentFunction}(${catId ? `'${catId}'` : 'null'}, ${page}, '${sort}');`;
//         } else {
//             link.href = `javascript:${currentFunction}(${catId ? `'${catId}'` : 'null'}, ${page});`;
//         }
//         link.innerText = page;
//         listItem.appendChild(link);
//         paginationList.appendChild(listItem);
//     });
// };




// Function to clear pagination links
function clearPagination() {
    const paginationList = document.getElementById("paginationList");
    paginationList.innerHTML = "";
}

const proContainer = document.getElementById('pro_container');

// Function to display filtered data
const filteredDataDisplay = (data) => {
    proContainer.innerHTML = '';
    proContainer.innerHTML = `<div class="row product-grid-3" id="productList"></div>`;
    const productList = document.getElementById('productList');

    data.forEach((product) => {
        productList.innerHTML +=
            `<div class="col-lg-4 col-md-4 col-12 col-sm-6">
                <div class="product-cart-wrap mb-30">
                    <div class="product-img-action-wrap">
                        <div class="product-img product-img-zoom">
                            <a href="/productview?id=${product._id}">
                                <img class="default-img" src="/images/products/${product.imageUrl[0]}" alt="">
                                <img class="hover-img" src="/images/products/${product.imageUrl[1]}" alt="">
                            </a>
                        </div>
                        <div class="product-action-1">
                            <a aria-label="Quick view" class="action-btn hover-up" href="/productview?id=${product._id}">
                                <i class="fi-rs-search"></i></a>
                        </div>
                        <div class="product-badges product-badges-position product-badges-mrg">
                        </div>
                    </div>
                    <div class="product-content-wrap">
                        <div class="product-category">
                            ${product.category.category}
                        </div>
                        <h2><a href="/productview?id=${product._id}">${product.name}</a>
                        <input type="hidden" id="name${product._id}" value="${product.name}">
                        <input type="hidden" id="id" value="${product._id}">
                        </h2>
                        <div class="product-price">
                            <span>₹${product.price}</span>
                        </div>
                        <div class="product-action-1 show">
                            <span id="click${product._id}">
                            <a onclick="addToWishlist('${product._id}')" id="icon-2" aria-label="Add To Wishlist"
                                class="wish action-btn hover-up" href="#"><i class="fi-rs-heart"></i></a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>`;
    });
};
    




/// Add to wishlist ////////////



const addToWishlist = async (id) => {

    const proName = document.getElementById('name' + id).value
    document.getElementById('click' + id).innerHTML =
        `<a aria-label="Add To Wishlist"
    class="wish action-btn hover-up" href="#"><i class="fa-solid fa-heart"></i></a>`

    let response = await fetch(`/add_to_wishlist?id=${id}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })

    let data = await response.json()
    if (data) {
        alertify.set('notifier', 'position', 'bottom-center');
        alertify.success(`${proName} Added to wishlist`)
        //.then(()=> window.location.reload())
    }
}


/// remove from wishlist  ////////////


const removeFromWishlist = async (id) => {
    const proName = document.getElementById('name' + id).value

    document.getElementById('click' + id).innerHTML =
        `<a aria-label="Add To Wishlist" class="wish action-btn hover-up" href="#"><i class="fi-rs-heart"></i></a>`

    let response = await fetch(`/remove_from_wishlist?id=${id}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })

    let data = await response.json()
    if (data) {
        alertify.set('notifier', 'position', 'bottom-center');
        alertify.success(`${proName} Removed from wishlist`)
    }
}


/// Product search ////////////


const searchProducts = async () => {
    const query = document.getElementsByName('search-product')[0].value

    const response = await fetch(`/products_filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            search: query,
            catId: catId
        })
    });

    const data = await response.json();



    if (data.length > 0) {
        filteredDataDisplay(data)
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`
    }
}




const sortAZ = async (page = 1) => {
    const sort = 'asc';
    const response = await fetch(`/sort_product_name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sort: sort,
            catId: catId,
            page: page
        })
    });

    const data = await response.json();
    if (data.productData.length > 0) {
        filteredDataDisplay(data.productData);
        updatePagination(data.pages, data.currentPage, 'sortAZ', catId, sort);
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
        clearPagination();
    }
};

const sortZA = async (page = 1) => {
    const sort = 'desc';
    const response = await fetch(`/sort_product_name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sort: sort,
            catId: catId,
            page: page
        })
    });

    const data = await response.json();
    if (data.productData.length > 0) {
        filteredDataDisplay(data.productData);
        updatePagination(data.pages, data.currentPage, 'sortZA', catId, sort);
    } else {
        proContainer.innerHTML = `<h2 class="m-5">No product available</h2>`;
        clearPagination();
    }
};

// Existing functions remain unchanged









