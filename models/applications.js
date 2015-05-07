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
    carrier: {
        type: Schema.ObjectId,
        ref: 'Carrier'
    },
    client: {
        type: Schema.ObjectId,
        ref: 'Client'
    },
    provider: {
        type: Schema.ObjectId,
        ref: 'Provider'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Applications = mongoose.model('Applications', Applications);