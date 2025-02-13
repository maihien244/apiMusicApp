class LoginMiddleware {
    isEmailOrPhoneNumber(req, res, next) {
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const regexPhoneNumber = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
        const text_input = req.body.text_input
        // console.log(req.body.text_input)
        console.log(req.body)
        if(regexEmail.test(text_input)) {
            console.log('email')
            res.locals.typeInput = 'email'
            next()
        } else if(regexPhoneNumber.test(text_input)) {
            console.log('phone number')
            res.locals.typeInput = 'phoneNumber'
            next()
        } else {
            res.json({
                type: 'warning',
                message: ' The your email or phone number is invalid',
            })
        }
    }
}


module.exports = new LoginMiddleware