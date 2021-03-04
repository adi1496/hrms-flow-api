const CountryTaxes = require('./../modules/platformModule');

exports.addCountryTaxes = async (req, res, next) => {
    try {
        if(!req.body) return next('There is no body attached');
        const newCountryTaxes = await CountryTaxes.create(req.body);
        if(!newCountryTaxes) return next('Country taxes was not created');

        res.status(200).json({
            status: 'success',
            data: {
                newCountryTaxes: newCountryTaxes
            }
        })
    } catch (error) {
        next(error);
    }
}