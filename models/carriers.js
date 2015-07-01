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
    applications: [
        {
            legalEntity: String,
            number: {
                type: Number,
                default: 1
            },
            application: {
                type: Schema.ObjectId,
                ref: 'Application'
            }
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
});

exports.CarrierModel = mongoose.model('Carrier', schema);