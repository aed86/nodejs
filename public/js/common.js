(function ($) {

    var types = ['claim', 'carrier'];
    /**
     * Удалить строку из таблицы
     */
    $(document).on('click', '.removeItem', function () {
        var $this = $(this);
        var id = $this.data('id');
        var itemType = $this.data('item');

        if (types.indexOf(itemType) == -1) {
            return;
        }

        var url = "/" + itemType + "/" + id;
        var data = {};

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            method: 'DELETE',
            success: function (res) {
            },
            complete: function () {
                $this.closest('tr').fadeOut(400, function() {
                    $(this).remove();
                });
            }
        });
    });

})(jQuery);