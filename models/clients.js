/**
 * Модель запросов
 * @type {mongoose|exports|module.exports}
 */

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var Client = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
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
    providers:[{
        type: Schema.ObjectId,
        ref: 'Provider'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

Client.path('name').validate(function(v) {
    return v.length > 0 && v.length< 70;
}, 'Имя клиента должно быть от 0 до 70 символов');

Client.path('description').validate(function(v) {
    return v.length >= 0 && v.length< 270;
});

exports.Client = mongoose.model('Client', Client);