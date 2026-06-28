const menu = document.querySelector(".mobile-menu-btn");

const nav = document.querySelector(".nav-links");

const close = document.querySelector(".mobile-close");

menu.onclick = () => {

    nav.classList.add("active");

}

close.onclick = () => {

    nav.classList.remove("active");

}

document.querySelectorAll(".nav-links a").forEach(link => {

    link.onclick = () => {

        nav.classList.remove("active");

    }

});