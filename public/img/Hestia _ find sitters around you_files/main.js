//Navbar, totop-btn
window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var band = document.getElementById("nav-band");
var mq = window.matchMedia("@media screen and (max-width: 70rem)");
var col1of2=document.getElementsByClassName("col-1-of-2");

var sticky = navbar.offsetTop;

function myFunction() {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) //get down
    {
        navbar.classList.add("navbar-sticky");
        band.classList.add("navbar-band");
        navbar.classList.remove("navbar-header");

        document.getElementById("toTopBtn").style.visibility = "visible";

        if(mq)
        {
            for(var i = 0; i < col1of2.length; i++)//sister(story) card col-1-of-1
            {
                col1of2[i].classList.remove("col-1-of-2");
                col1of2[i].classList.add("row");
                col1of2[i].classList.add("col-1-of-2");
            }
        }
        else{
            for(var i = 0; i < col1of2.length; i++)//sister(story) card col-1-of-1
            {
                
                col1of2[i].classList.remove("row");
                
            }
        }
        

    } 
    else //getup
    {
        navbar.classList.remove("navbar-sticky");
        band.classList.remove("navbar-band");
        navbar.classList.add("navbar-header");

        document.getElementById("toTopBtn").style.visibility = "hidden";
        if(mq)
        {
            for(var i = 0; i < col1of2.length; i++)//sister(story) card col-1-of-1
            {
                col1of2[i].classList.remove("col-1-of-2");
                col1of2[i].classList.add("row");
                col1of2[i].classList.add("col-1-of-2");
            }
        }
        else{
            for(var i = 0; i < col1of2.length; i++)//sister(story) card col-1-of-1
            {
                
                col1of2[i].classList.remove("col-1-of-2");
                col1of2[i].classList.remove("row");
                col1of2[i].classList.add("col-1-of-2");
                
            }
        }
        
    }

 }

//Smoot Scoll
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


