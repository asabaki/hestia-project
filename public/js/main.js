//Navbar, totop-btn
window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var band = document.getElementById("nav-band");
var sticky = navbar.offsetTop;

//var sitter1=document.getElementsById("sitter1");
//var sitter2=document.getElementsById("sitter2");
//var mq = window.matchMedia("@media screen and (max-width: 70rem)");




function myFunction() 
{
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) //small screen
    {
        navbar.classList.add("navbar-sticky");
        band.classList.add("navbar-band");
        navbar.classList.remove("navbar-header");
     

        document.getElementById("toTopBtn").style.visibility = "visible";

    } 
    else //big screen
    {
        navbar.classList.remove("navbar-sticky");
        band.classList.remove("navbar-band");
        navbar.classList.add("navbar-header");

        document.getElementById("toTopBtn").style.visibility = "hidden";
        
    }
 }

//Smooth Scoll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

//alway on top when reload page
window.onbeforeunload=function(){
    window.scrollTo(0,-1);
};



