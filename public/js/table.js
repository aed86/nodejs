(function ($) {

    var Table = function () {
        var _providersBuf = [];

        return {
            init: function () {
                $('.datepicker').datepicker();
                //this.updateProviderSelect();
            },
            getProviderByClientId: function (clientId) {

                return $.ajax({
                    url: '/client/getProviders/' + clientId,
                    method: 'POST',
                    dataType: 'json'
                });
            },
            updateProviderSelect: function() {
                var $clientSelect = $('#client');
                var $providerSelect = $('#provider');
                var $city = $('#cityProvider');
                var clientId = $clientSelect.val();
                if (!clientId) return;

                this.getProviderByClientId(clientId).then(function(res) {
                    if (res.success) {
                        _providersBuf = res.providers;
                        $providerSelect.empty();
                        $city.html('');
                        $.each(res.providers, function(key, provider) {
                            $providerSelect
                                .append($("<option></option>")
                                    .attr("value", provider.id)
                                    .text(provider.name));

                            if (key === 0) {
                                $city.html(provider.city);
                            }
                        });
                    }
                });
            },
            updateProviderCity: function(providerId) {
                var provider = _.find(_providersBuf, function(provider) {
                    return provider.id == providerId;
                });
                $('#cityProvider').html(provider.city);
            }
        }
    };

    $(document).ready(function() {
        var table = new Table();
        table.init();

        $(this).on('change', '#client', function() {
            table.updateProviderSelect();
        });

        $(this).on('change', '#provider', function() {
            table.updateProviderCity(this.value);
        })
    });
})(jQuery);
