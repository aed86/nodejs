var Applications = require('../models/applications').Applications;

/**
 * Получение количества заявок по ЮрЛицу
 */
exports.applicationCount = function (params) {

    var searchOptions = {};
    switch(params.type) {
        case 'client':
            searchOptions = {
                legalEntity: params.legalEntity,
                client: params.id
            };
            break;
        case 'carrier':
            searchOptions = {
                legalEntity: params.legalEntity,
                carrier: params.id
            };
            break;
    }

    return Applications
        .find(searchOptions)
        .count();
};