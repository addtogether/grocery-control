const mongoose = require('mongoose');
const {isEmail} = require('validator');

const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Pls enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a passoword'],
        minlength: [6, 'You must enter a passowrd of atleast 6 characters'],
    },
    role:{
        type: String,
        default:'admin'
    }
});


adminSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// userSchema.post('save', function(doc, next) {
//     console.log('new user is created..', doc);
//     next();
// })

adminSchema.statics.login = async function(email, password){
    const admin = await this.findOne({email});
    if(admin){
        const res = await bcrypt.compare(password, admin.password);
        if(res){
            return admin;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

module.exports = mongoose.model('admins', adminSchema);