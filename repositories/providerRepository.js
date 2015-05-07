var Provider = require('../models/providers').Provider;
var Client = require('../models/clients').Client;

/**
 * Получение списка всех поставщиков по clientId
 *
 * @param clientId
 * @param limit
 * @param next
 * @param callback
 * @returns {*}
 */
exports.providerListByClientId = function (clientId, limit, next, callback) {
    limit = parseInt(limit) > 0 ? parseInt(limit) : 0;

    Client.findById(clientId, function (err) {
        if (err) {
            next('404', 'Клиент не найден');
        }

        Provider
            .find({clientId: clientId})
            .sort({created: 1})
            .limit(limit)
            .exec(callback);
    });
};