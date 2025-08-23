/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TErrorSources, TGenericResponse } from "../interfaces/error.type";

export const handleDuplicateError = (err: any): TGenericResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchedArray[1]} already exists!!`,
  };
};

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericResponse => {
  return {
    statusCode: 400,
    message: err.message,
  };
};

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericResponse => {
  const errorSources: TErrorSources[] = [];
  const errors = Object.values(err.errors);
  errors.forEach((errObj: any) => {
    errorSources.push({
      path: errObj.path,
      message: errObj.message,
    });
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export const handleZodError = (err: any): TGenericResponse => {
  const errorSources: TErrorSources[] = [];
  const issues = Object.values(err.issues);
  issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources,
  };
};
