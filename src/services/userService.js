import db from '../models/index'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hasPassword = await bcrypt.hashSync(password, salt);
            resolve(hasPassword);
        } catch (error) {
            reject(error)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exists
                //compare the password
                let user = await db.User.findOne({
                    where: { email: email },
                    //chỉ return về 3 fields
                    attributes: ['email', 'roleId', 'password'],
                })
                if (user) {
                    let check = await bcrypt.compareSync( password, user.password );
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK'
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Please try again`
            }
            resolve(userData);
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        //sẽ return về password
                        exclude: ['password'],
                    }
                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password'],
                    },
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //validate form
            if (!data.email || !data.password || !data.firstName || !data.lastName || !data.address) {
                resolve({
                    errCode: 1,
                    message: 'Please provide all required fields: email, password, firstName, lastName'
                });
                return;
            }

            //check email is exist 
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already, please try another email'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address, 
                    phoneNumber: data.phoneNumber || '', 
                    gender: data.gender || '', 
                    roleId: data.roleId === '1' ? true : false
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                //tại vì đã config raw: true ở config, mà destroy chỉ hiểu khi cái biến user là 1 cái instance của sequelize(có thể nói là 1 cái object của sequelize),
                //còn raw: true thì user chỉ là 1 object bth
                raw: false
            })
            if(!user) {
                resolve({
                    errCode: 2,
                    message: 'The user does not exist'
                })
            } else {
                await user.destroy();// cách này khi config raw: false,
                // await db.User.destroy({ cách này khi config raw: true
                //     where: { id: userId }
                // })
                resolve({
                    errCode: 0,
                    message: 'The user is successfully deleted'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                //tại vì đã config raw: true ở config, mà destroy chỉ hiểu khi cái biến user là 1 cái instance của sequelize(có thể nói là 1 cái object của sequelize),
                //còn raw: true thì user chỉ là 1 object bth
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update user successfully'
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'User is not found'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter!'
                })
            } else {
                // let res = {};
                let allCode = await db.AllCode.findAll({
                    where: { type: typeInput }
                });
                // res.errCode = 0;
                // res.message = 'OK'
                // res.data = allCode
                // resolve(res)
                resolve({
                    errCode: 0,
                    message: 'OK',
                    data: allCode
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
    editUser: editUser,
    getAllCodeService: getAllCodeService
}