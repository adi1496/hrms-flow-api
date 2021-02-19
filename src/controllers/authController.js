const Company = require('./../modules/companyModule');

exports.signupCompany = async(req, res, next) => {
    try {
        if(!req.body) return next();

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            businessEmail: req.body.businessEmail,
            businessPhone: req.body.businessPhone,
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            numberOfEmployees: req.body.numberOfEmployees,
            country: req.body.country,
            city: req.body.city
        }

        const newCompany = await Company.create(data);

        if(!newCompany) {
            console.log('Company not registered!');
            return next();
        }

        req.company = newCompany;
        next();

        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         company: newCompany
        //     }
        // })

    } catch (error) {
        console.error(error);
    }
}