(function ($) {
    $(document).on('submit', '#login_form',  function () {
        var form = $(this);

        $('.error', form).button('loading');

        $.ajax({
            url: "/login",
            method: "POST",
            data: form.serialize(),
            dataType: "json",
            complete: function () {
                $(":submit", form).button('reset');
            },
            success: function (res) {
                if (res.success) {
                    form.html('Вы вошли на сайт').addClass('alert-success');
                    $('.error', form).button('');
                    //window.location.href= '/';
                } else {
                    var error = res.message;
                    $(".error", form).html(error);
                }
            }
        });

        return false;
    });
})(jQuery);
