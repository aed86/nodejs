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
    created: {
        type: Date,
        default: Date.now
    }
});

schema.path('name').validate(function(v) {
    return v.length > 0 && v.length< 70;
});

schema.path('description').validate(function(v) {
    return v.length > 0 && v.length< 270;
});

exports.ClaimModel = mongoose.model('Claim', schema);