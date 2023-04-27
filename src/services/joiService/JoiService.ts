import joi from "joi";

export const userLogin = joi.object({
    username: joi.string().min(5).required(),
    password: joi.string().min(6).required(),
});

export const userAdd = joi.object({
    name: joi.string().min(5).required(),
    username: joi.string().min(5).required(),
    password: joi.string().min(6).required(),
    role: joi.string().default("user"),
    tryLogin: joi.number().default(0),
    banned: joi.bool().default(false),
    timeBanExp: joi.number().default(0)
});

export const userUpdate = joi.object({
    _id: joi.string().min(5).required(),
    name: joi.string().min(5).allow(null),
    username: joi.string().min(5).allow(null),
    password: joi.string().min(6).allow(null),
    new_password: joi.string().min(6).allow(null),
    confirm_password: joi.string().min(6).allow(null),
    role: joi.string().allow(null),
    tryLogin: joi.number().allow(null),
    banned: joi.bool().allow(null),
    timeBanExp: joi.number().allow(null),
});

export const deviceData = joi.object({
    AC0: joi.object({
        V: joi.number().required(),
        I: joi.number().required(),
        PF: joi.number().required(),
        E: joi.number().required(),
        F: joi.number().required(),
    }).required(),
    AC1: joi.object({
        V: joi.number().required(),
        I: joi.number().required(),
        PF: joi.number().required(),
        E: joi.number().required(),
        F: joi.number().required(),
    }).required(),
});

export const addRoom = joi.object({
    name: joi.string().min(5).required(),
    key: joi.string().allow(null),
    balance: joi.number().default(0).allow(null),
});