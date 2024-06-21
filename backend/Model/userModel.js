const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    pic: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
   
},{
    timestamps: true
});
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
/*
This JavaScript code snippet is a part of a Mongoose model for a User. Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. It provides a straight-forward, schema-based solution to model your application data.

The [`pre('save', async function(next){...})`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FDELL%2FDesktop%2Fchatapp%2Fnode_modules%2Fmongoose%2Ftypes%2Findex.d.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A402%2C%22character%22%3A4%7D%5D "node_modules/mongoose/types/index.d.ts") is a Mongoose middleware function that gets executed before the 'save' event on the [`userSchema`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5CUsers%5C%5CDELL%5C%5CDesktop%5C%5Cchatapp%5C%5Cbackend%5C%5CModel%5C%5CuserModel.js%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2FUsers%2FDELL%2FDesktop%2Fchatapp%2Fbackend%2FModel%2FuserModel.js%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FDELL%2FDesktop%2Fchatapp%2Fbackend%2FModel%2FuserModel.js%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A2%2C%22character%22%3A0%7D%5D "backend/Model/userModel.js"). The 'save' event is triggered when you try to save a document to the database. This middleware function is asynchronous, as indicated by the `async` keyword.

Inside the middleware function, there's a conditional check `if(!this.isModified('password')){...}`. The [`isModified`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FDELL%2FDesktop%2Fchatapp%2Fnode_modules%2Fmongoose%2Ftypes%2Fdocument.d.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A186%2C%22character%22%3A4%7D%5D "node_modules/mongoose/types/document.d.ts") method is a Mongoose document method that checks if the value of a certain path has been modified. In this case, it checks if the password has been modified. If the password has not been modified, it calls [`next()`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5CUsers%5C%5CDELL%5C%5CDesktop%5C%5Cchatapp%5C%5Cbackend%5C%5CModel%5C%5CuserModel.js%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2FUsers%2FDELL%2FDesktop%2Fchatapp%2Fbackend%2FModel%2FuserModel.js%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FDELL%2FDesktop%2Fchatapp%2Fbackend%2FModel%2FuserModel.js%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A31%2C%22character%22%3A38%7D%5D "backend/Model/userModel.js"), which passes control to the next middleware function in the stack. If there are no more middleware functions, Mongoose will proceed with the 'save' operation.

If the password has been modified, the function generates a salt using `bcrypt.genSalt(10)`. Bcrypt is a library to help you hash passwords. The `genSalt` function is used to generate a salt. The number 10 is the number of rounds to use when generating the salt. The higher the rounds, the more secure the salt, but the longer it takes to generate.

After the salt is generated, the password is hashed using `bcrypt.hash(this.password, salt)`. The `hash` function takes the plain text password and the salt, and generates a hashed password. This hashed password is then stored in the database. This is a common practice to secure user passwords. If the database is compromised, the attacker will only get hashed passwords, which are useless without the original salt.
 
The condition `if(!this.isModified('password')){...}` is checked to determine whether the password field of the document has been modified. 

In the context of a User model, this condition is often used in a 'save' middleware function to decide whether to hash the password. If the password has not been modified (i.e., the user has not changed their password), there's no need to hash it again, so the function can skip the hashing process and call `next()` to proceed to the next middleware function or the database operation.

This is an optimization that saves unnecessary computation. Hashing is a relatively expensive operation, so it's best to avoid doing it when it's not necessary. 

Also, hashing the password again would result in a different hash (since bcrypt also uses a salt that is generated each time you hash something), even if the password itself did not change. This would be incorrect behavior, because the same password should always result in the same hash.
*/


const User = mongoose.model('User', userSchema);
module.exports = User;