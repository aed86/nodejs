(function ($) {
    $(document).on('submit', '#register_form',  function () {
        var form = $(this);

        $(".help-inline").html('');
        form.find('.has-error').removeClass('has-error');

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
                    if (_.isObject(res.message)) {
                        for (var key in res.message) {
                            var $div = $("[name='"+ key +"']").closest('div');
                            $div.find('.help-inline').html(res.message[key].message);
                            $div.addClass('has-error');
                        }
                    } else {
                        $('.error').html(res.message);
                    }
                }
            }
        });

        return false;
    });

    $(document).on('keyup', '#register_form',  function () {
        $(this).find('.has-error').removeClass('has-error');
    });


})(jQuery);
