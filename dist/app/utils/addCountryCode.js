"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCountryCode = void 0;
const libphonenumber_js_1 = require("libphonenumber-js");
const addCountryCode = (phone, defaultCountry) => {
    const phoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(phone, defaultCountry);
    if (!phoneNumber || !phoneNumber.isValid()) {
        return null;
    }
    return phoneNumber.formatInternational().replace(/[\s-]/g, "");
};
exports.addCountryCode = addCountryCode;
