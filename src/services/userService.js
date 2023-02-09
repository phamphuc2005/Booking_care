const db = require('../models/index');
const mailService = require('./mailService');
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);

let buildRandomNumber = () => {
    let result = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    return result;
}

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
                    where: {email: email, isDelete: 0},
                    // attributes: {
                    //     exclude: ['password']
                    // },
                    include: [
                        {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                    ],
                    raw: true,
                    nest: true
                    // attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName', 'phonenumber'],
                    // raw: true
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
                    where : {isDelete: 0},
                    attributes: {
                        exclude: ['password']
                    }
                })
            } 
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where : {id: userId, isDelete: 0},
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
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                    isDelete: 0
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
    // console.log(userId);
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where : {id: userId, isDelete: 0},
                raw: false
            })
            if(!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User does not exist!'
                })
            } else {
                user.isDelete = 1;
                await user.save();
                // await db.User.destroy({
                //     where : {id: userId},
                // });
            }
            resolve({
                errCode: 0,
                message: 'Delete user successfully!'
            })
        } catch (error) {
            reject(error);
        }
    })
}

let unDeleteUser = (userId) => {
    // console.log(userId);
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where : {id: userId, isDelete: 1},
                raw: false
            })
            if(!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User does not exist!'
                })
            } else {
                user.isDelete = 0;
                await user.save();
                // await db.User.destroy({
                //     where : {id: userId},
                // });
            }
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
            if(!data.id || !data.gender || !data.roleId || !data.positionId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let user = await db.User.findOne({
                    where: {id: data.id, isDelete: 0},
                    raw: false
                })
                if(user) {
                    user.firstName = data.firstName,
                    user.lastName = data.lastName,
                    user.phonenumber = data.phonenumber,
                    user.address = data.address,
                    user.gender = data.gender,
                    user.roleId = data.roleId,
                    user.positionId = data.positionId;
                    if (data.avatar) {
                        user.image = data.avatar
                    }
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
            }
            
        } catch (error) {
            reject(error);
        }
    })

}

let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!typeInput) {
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where : {type: typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    })

}

let handleRegister = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.firstName || !data.lastName || !data.email || !data.password) {
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let check = await checkUserEmail(data.email);
                if(check === true) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Email has been used. Please enter another email !'
                    });
                } else {
                    let random_number = buildRandomNumber();
                    await mailService.sendConfirmRegister({
                        email: data.email,
                        random_number: random_number
                    }) 
                    let account = await db.Register.findOne({
                        where: {email: data.email},
                        raw: false
                    })
                    if(account) {
                        account.email = data.email;
                        account.random_number = random_number;
                        await account.save();
                    } else {
                        await db.Register.create({
                            email: data.email,
                            random_number: random_number,
                        });
                    }
                    resolve({
                        errCode: 0,
                        message: 'OK'
                    });  
                }
            }
        } catch (error) {
            reject(error);
            console.log('----',error);
        }
    })
}

let handleConfirmRegister = (data) => {
    console.log(data);
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.email || !data.random_number) {
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let check = await db.Register.findOne({
                    where: {
                        email: data.email,
                        random_number: data.random_number
                    },
                    raw: false
                })
                if(check) {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.password);  
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        // address: data.address,
                        // phonenumber: data.phonenumber,
                        gender: 'O',
                        roleId: 'R2',
                        positionId: 'P0',
                        // image: data.avatar,
                        isDelete: 0
                    }) 
                    resolve({
                        errCode: 0,
                        message: 'OK'
                    });
                } else {
                    resolve ({
                        errCode: 2,
                        errMessage: 'Confirmation code is incorrect !'
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let handleUserInfo = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let user = await db.User.findOne({
                    where : {id: +inputId, isDelete: 0},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                    ],
                    raw: false,
                    nest: true
                });
                if(user) {
                    resolve({
                        errMessage: "OK!",
                        errCode: 0,
                        data: user
                    })
                } else {
                    resolve({
                        errMessage: "Don't have user!",
                        errCode: 2
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleGetTrashUsers = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.User.findAll({
                where: {isDelete: 1},
                attributes: {
                    exclude: ['password']
                }
            });
            resolve({
                errMessage: "OK!",
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService,
    handleRegister,
    handleConfirmRegister,
    handleUserInfo,
    handleGetTrashUsers,
    unDeleteUser
}