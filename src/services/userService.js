const db = require('../models/index');
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);   
            resolve(hashPassword);         
        } catch (error) {
            reject(error);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User does not exist.';
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = 'Email does not exist. Please re-enter your email';
            }
            resolve(userData);
        } catch (error) {
            reject(error);   
        }
    })

}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if(user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } 
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where : {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email has been used. Please enter another email!'
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);  
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                    // image: data.image,
                    // positionId: data.positionId,
                })  
                resolve({
                    errCode: 0,
                    message: 'OK'
                });  
            }
        } catch (error) {
            reject(error);
        }
    })

}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where : {id: userId},
            })
            if(!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User does not exist!'
                })
            }
            await db.User.destroy({
                where : {id: userId},
            });
            resolve({
                errCode: 0,
                message: 'Delete user successfully!'
            })
        } catch (error) {
            reject(error);
        }
    })

}

let updateUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters!',
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            })
            if(user) {
                user.firstName = data.firstName,
                user.lastName = data.lastName,
                user.address = data.address,
                user.phonenumber = data.phonenumber,
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update user successfully!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User does not found!'
                });
            }
        } catch (error) {
            reject(error);
        }
    })

}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
}