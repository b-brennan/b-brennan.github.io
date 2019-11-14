// open and close slide menu

let slideMenu = document.getElementById("menuSlide");

function openSlide(){
    slideMenu.style.width = "25%"
    slideMenu.style.marginLeft = "75%"

}

function closeSlide(){
    slideMenu.style.width = "0px"
    slideMenu.style.marginLeft = "100%"

}