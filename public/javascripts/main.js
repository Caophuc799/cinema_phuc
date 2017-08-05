// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtnGoTop").style.display = "block";
    } else {
        document.getElementById("myBtnGoTop").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    scrollTo(document.body, 0, 600);
    // document.body.scrollTop = 0; // For Chrome, Safari and Opera 
    // document.documentElement.scrollTop = 0; // For IE and Firefox
}

$(function () {

    $(document).on('scroll', function () {

        if ($(window).scrollTop() > 500) {
            $('.scroll-top-wrapper').addClass('show');
        } else {
            $('.scroll-top-wrapper').removeClass('show');
        }
    });

});


function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop == to) return;
        scrollTo(element, to, duration - 10);
    }, 2);
}