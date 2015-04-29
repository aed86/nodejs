(function ($) {
    $(document).on('submit', '#register_form',  function () {
        var form = $(this);

        $('.error', form).button('loading');

        $.ajax({
            url: "/register",
            method: "POST",
            data: form.serialize(),
            dataType: "json",
            complete: function () {
                $(":submit", form).button('reset');
            },
            success: function (res) {
                if (res.success) {
                    form.html('Вы зарегистрированы').addClass('alert-success');
                    $('.error', form).button('');
                    window.location.href= '/';
                } else {
                    var error = res.message;
                    $(".error", form).html(error);
                }
            }
        });

        return false;
    });
})(jQuery);
