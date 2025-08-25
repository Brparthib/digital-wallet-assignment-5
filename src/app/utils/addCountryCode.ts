import { parsePhoneNumberFromString } from "libphonenumber-js";

export const addCountryCode = (phone: string, defaultCountry: "BD") => {
  const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);
   if (!phoneNumber || !phoneNumber.isValid()) {
    return null;
  }

  return phoneNumber.formatInternational().replace(/[\s-]/g, "");
};