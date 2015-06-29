/**
 * Модель перевозчиков
 * @type {mongoose|exports|module.exports}
 */

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    // Количество заявок
    count: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.CarrierModel = mongoose.model('Carrier', schema);