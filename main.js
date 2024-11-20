/*=============== SHOW MENU ===============*/

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Menu hidden */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav_link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById("header");
  // Add a class if the bottom offset is greater than 50 of the viewport
  this.scrollY >= 50
    ? header.classList.add("shadow-header")
    : header.classList.remove("shadow-header");
};
window.addEventListener("scroll", shadowHeader);

/*=============== SWIPER FAVORITES ===============*/
const swiperFavorites = new Swiper('.favorites_swiper', {
  loop: true,
  grabCursor: true,
  slidesPerView: 'auto',
  centeredSlides: 'auto'
})
/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById('scroll-up')
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
  this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
    : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
  const scrollDown = window.scrollY

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute('id'),
      sectionsClass = document.querySelector('.nav_menu a[href*=' + sectionId + ']')

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add('active-link')
    } else {
      sectionsClass.classList.remove('active-link')
    }
  })
}
window.addEventListener('scroll', scrollActive)
/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 300,
  reset: true, // Animations repeat
})

sr.reveal(`.home_data, .favorites_container, .footer_container`)
sr.reveal(`.home_circle, .home_img`, { delay: 600, scale: .5 })
sr.reveal(`.home_chips-1, .home_chips-2, .home_chips-3`, { delay: 1000, interval: 100 })
sr.reveal(`.home_leaf`, { delay: 1200 })
sr.reveal(`.home_tomato-1, .home_tomato-2`, { delay: 1400, interval: 100 })
sr.reveal(`.care_img, .contact_img`, { origin: 'left' })
sr.reveal(`.care_list, .contact_data`, { origin: 'right' })
sr.reveal(`.banner_item, .products_card`, { interval: 100 })


// *******
let productDom = document.getElementById("productDom")
let cartBtn = document.getElementById("cartBtn")
let itemCounter = document.getElementById("itemCounter")
let cartDom = document.getElementById('cart-contant')
let clearBtn = document.getElementById("clearCart")
let total = document.getElementById("total")


// addEventListener

document.addEventListener("DOMContentLoaded", displayProduct)
cartBtn.addEventListener("click", cartView)
cartDom.addEventListener("click", DeleteCartDom)
clearBtn.addEventListener("click", clearCart)

let cart2 = []
let countElement = 0

// class 
class Products {
    async getProducts() {
        try {
            let result = await fetch("./assests/js/data.json")
            let data = await result.json()
            return data.items
        } catch (err) {
            console.log(err)
        }
    }
}
class UI {
    displayProduct(product) {
        let results = ""
        product.forEach(({ title, price, image, id }) => {
            results += `
            <div class="card shadow p-3 mb-5 rounded" style="width: 15rem;background-color:hsl(170, 90%, 34%);border-radius:50%;">
                <img src="${image}" class="card-img-top" alt="...">
                <div class="card-body text-center" >
                    <h3 class="card-title">${title}</h3>
                    <p class="fw-bold">Price: ${price}</p>
                    <div class="d-flex">
                        <button class="btn btn-secondary  addToCart" data-id=${id}>Add to Cart</button>
                        <button disabled="disabled" class="btn btn-secondary">View</button>
                    </div>

                </div>
            </div>
            `
            productDom.innerHTML = results
        });
    }

    static getButton(products) {
        const buttons = [...document.querySelectorAll(".addToCart")]
        buttons.forEach(button => {
            let id = button.dataset.id
            let cart = Storage.getCart() || cart2
            let inCart = cart.find(item => item.id == id)
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true
            }

            button.addEventListener("click", e => {
                e.target.innerHTML = "In Cart"
                e.target.disabled = true
                let cartProduct = products.filter(product => product.id == id)
                Storage.saveCart(cartProduct[0])
                UI.countItem(Storage.getCart())

            })
        });
    }
    static getCartDisplay() {
        let items = Storage.getCart()
        UI.total(items)

        if (items !== null) {
            let totalRow = ""
            items.forEach((item) => {

                totalRow += `
                <tr>
                    <td ><img src="${item.image}" class="cart-image" alt=""></td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    
                    <td ><a href="#"class="delete" > <i class="ri-delete-bin-5-fill " data-id=${item.id} ></i></a></td>
                </tr>
                    `
            });
            cartDom.innerHTML = totalRow
        }

    }
    static countItem(cart) {
        if (cart == null) {
            itemCounter.innerText = cart.length
        } else {
            itemCounter.innerText = cart.length
        }
    }
    static DeleteFromLocalStorage(id) {
        let carts = Storage.getCart()
        carts.forEach((item, index) => {
            if (item.id == id) {
                carts.splice(index, 1)
            }
        });
        localStorage.setItem("cart", JSON.stringify(carts))
    }
    static total(cart) {
        let itemTotal = 0

        cart.forEach(item => {
            itemTotal += item.price
        });
        total.innerText = itemTotal
    }
   
}

//  Storage

class Storage {
    static saveCart(item) {
        let carts
        if (localStorage.getItem("cart") == null) {
            carts = []
        } else {
            carts = JSON.parse(localStorage.getItem("cart"))
        }
        carts.push(item)
        localStorage.setItem("cart", JSON.stringify(carts))

    }
    static getCart() {
        let cartItem
        if (localStorage.getItem("cart") == null) {
            cartItem = []
        } else {
            cartItem = JSON.parse(localStorage.getItem("cart"))
        }
        return cartItem
    }
}

// Functionality

async function displayProduct() {
    let productList = new Products()
    let ui = new UI()
    let product = await productList.getProducts()
    ui.displayProduct(product)
    UI.getButton(product)
    UI.countItem(Storage.getCart())
    cartView()
  

}

function cartView() {
    UI.getCartDisplay()
}

function DeleteCartDom(e) {
    if (e.target.classList.contains("ri-delete-bin-5-fill")) {
        let id = e.target.dataset.id

        UI.DeleteFromLocalStorage(id)
        UI.getCartDisplay()
        UI.countItem(Storage.getCart())
        displayProduct()

    }
}

function clearCart() {
    localStorage.clear()
    UI.getCartDisplay()
    displayProduct()
}
