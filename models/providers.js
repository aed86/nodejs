/**
 * Модель поставщика
 * @type {mongoose|exports|module.exports}
 */

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var Provider = new Schema({
    name: {
        type: String,
    },
    city: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
});

Provider.path('name').validate(function(v) {
    return v.length > 0 && v.length< 70;
}, 'Имя поставщика должно быть от 0 до 70 символов');

Provider.path('city').validate(function(v) {
    return v.length >= 0;
}, 'Город должен быть заполнен');

exports.Provider = mongoose.model('Provider', Provider);