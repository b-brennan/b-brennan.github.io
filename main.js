// open and close slide menu

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");


// function openSlide(){
//     slideMenu.style.width = "25%"
//     slideMenu.style.marginLeft = "75%"

// }

// function closeSlide(){
//     slideMenu.style.width = "0px"
//     slideMenu.style.marginLeft = "100%"

// }

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
})

document.querySelectorAll("nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.clasList.remove("active")
    navMenu.clasList.remove("active")
}))

