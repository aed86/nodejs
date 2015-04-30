(function ($) {
    $(document).on('click', '#logoutBtn', function () {
        $.ajax({
            url: "/logout",
            method: "POST",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    window.location.href = res.redirectTo || '/';
                }
            }
        });

        return false;
    });
})(jQuery);
