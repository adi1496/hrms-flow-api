const mongoose = require('mongoose');

const countryTaxesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'Country name is unique']
    },
    domainName: {
        type: String,
        required: [true, 'Domain name is required'],
        unique: [true, 'Domain name is unique']
    },
    taxes: [
        {
            taxName: String,
            taxValue: Number,
            isFromTotal: {
                type: Boolean,
                default: true
            }
        }
    ]
});

const CountryTaxes = mongoose.model('CountryTaxes', countryTaxesSchema);

module.exports = CountryTaxes;