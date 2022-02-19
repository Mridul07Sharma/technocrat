(function($) {
    "use strict";
    if ($('.menu-trigger').length) {
        $(".menu-trigger").on('click', function() {
            $(this).toggleClass('active');
            $('.header-area .nav').slideToggle(200);
        });
    }

    function mobileNav() {
        var width = $(window).width();
        $('.submenu').on('click', function() {
            if (width < 767) {
                $('.submenu ul').removeClass('active');
                $(this).find('ul').toggleClass('active');
            }
        });
    }
})(window.jQuery);