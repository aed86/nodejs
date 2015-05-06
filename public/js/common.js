(function ($) {

    var types = ['claim', 'carrier', 'client'];
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
                    var $countElm = $("#countInfo");
                    if ($countElm.length) {
                        var count = parseInt($countElm.text());
                        $countElm.text(count - 1);
                    }
                });
            }
        });
    });
})(jQuery);


var showFlashMessage = function() {
    var $flashMessage = $("#flashMessage");
    if ($flashMessage.length) {
        setTimeout(function() {
            $flashMessage.fadeOut(400, function() {
                $flashMessage.html('');
            });
        }, 3000)
    }
};