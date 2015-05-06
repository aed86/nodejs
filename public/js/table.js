(function ($) {

    var Table = function () {
        return {
            init: function () {
                this.updateProviderSelect();
            },
            getProviderByClientId: function (clientId) {
                return $.ajax({
                    url: '/provider/getByClient/' + clientId,
                    method: 'POST',
                    dataType: 'json',
                });
            },
            updateProviderSelect: function() {
                var clientId = $('#client').val();
                this.getProviderByClientId(clientId).then(function(res) {
                    console.log(res);
                })
            }
        }
    };

    $(document).ready(function() {
        var table = new Table();
        table.init();
    });
})(jQuery);
