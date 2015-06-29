(function ($) {

    var Table = function () {
        var _providersBuf = [];

        return {
            init: function () {
                $('.datepicker').each(function () {
                    var $this = $(this);
                    var currentDate = $(this).val();
                    if (currentDate) {
                        var date = $.datepicker.formatDate("dd.mm.yy", new Date(currentDate));
                        $this
                            .datepicker({
                                dateFormat: $.datepicker.regional['ru'].dateFormat
                            })
                            .datepicker('setDate', date);
                    } else {
                        $('.datepicker').datepicker();
                    }
                });
                //this.updateProviderSelect();
                this.updateCarrierCount();
                this.updateClientCount();
            },
            getProviderByClientId: function (clientId) {
                return $.ajax({
                    url: '/client/getProviders/' + clientId,
                    method: 'POST',
                    dataType: 'json'
                });
            },
            updateProviderSelect: function () {
                var $clientSelect = $('#client');
                var $providerSelect = $('#provider');
                var $city = $('#cityProvider');
                var clientId = $clientSelect.val();
                if (!clientId) return;

                this.getProviderByClientId(clientId).then(function (res) {
                    if (res.success) {
                        _providersBuf = res.providers;
                        $providerSelect.empty();
                        $city.html('');
                        $.each(res.providers, function (key, provider) {
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
            updateProviderCity: function (providerId) {
                var provider = _.find(_providersBuf, function (provider) {
                    return provider.id == providerId;
                });
                $('#cityProvider').html(provider.city);
            },
            updateCarrierCount: function () {
                var carrierId = $('#carrier').val();
                if (carrierId) {
                    $.ajax({
                        url: '/carrier/info/' + carrierId,
                        method: 'GET',
                        dataType: 'json',
                        success: function (response) {
                            if (response.success) {
                                $("#carrierCount").html(parseInt(response.carrier.count) + 1);
                            }
                        }
                    });
                }
            },
            updateClientCount: function () {
                var clientId = $('#client').val();
                if (clientId) {
                    $.ajax({
                        url: '/client/info/' + clientId,
                        method: 'GET',
                        dataType: 'json',
                        success: function (response) {
                            if (response.success) {
                                $("#clientCount").html(parseInt(response.client.count) + 1);
                            }
                        }
                    });
                }
            }
        }
    };

    $(document).ready(function () {
        var table = new Table();
        table.init();

        $(this).on('change', '#client', function () {
            table.updateProviderSelect();
            table.updateClientCount();
        });

        $(this).on('change', '#provider', function () {
            table.updateProviderCity(this.value);
        });

        $(this).on('change', '#carrier', function () {
            table.updateCarrierCount();
        });

        $(this).on('click', '.remove', function () {
            var $tr = $(this).closest('tr');
            var id = $tr.attr('id');

            $.ajax({
                url: "table/" + id,
                method: "DELETE",
                dataType: "json",
                success: function (response) {
                    if (response.success) {
                        // TODO: smth
                        $tr.remove();
                        showFlashMessage(response.message);
                        //window.location.href = "/table";
                    }
                }
            });

            return false;
        });


    });
})(jQuery);
