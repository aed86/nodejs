/**
 * Модель перевозчиков
 * @type {mongoose|exports|module.exports}
 */

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var Applications = new Schema({
    legalEntity: {
        type: String,
        required: true
    },
    //Перевозчик
    carrier: {
        type: Schema.ObjectId,
        ref: 'Carrier'
    },
    carrierDate: {
        type: Date,
        default: Date.now
    },
    //Номер заявки
    carrierCount: {
        type: Number,
        default: 1
    },
    client: {
        type: Schema.ObjectId,
        ref: 'Client'
    },
    clientDate: {
        type: Date,
        default: Date.now
    },
    //Номер заявки
    clientCount: {
        type: Number,
        default: 1
    },
    provider: {
        type: Schema.ObjectId,
        ref: 'Provider'
    },
    providerDate: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Applications = mongoose.model('Applications', Applications);