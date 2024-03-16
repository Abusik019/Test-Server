const emitter = require('./events.js')

function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(emailRegex.test(email)){
        console.log('Ok')
        emitter.emit('message', 'Valid email');
    }else{
        console.log('Invalid')
        emitter.emit('error', 'Invalid email')
    }
}

module.exports = {
    validateEmail
}