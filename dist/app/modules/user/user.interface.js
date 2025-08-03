"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Status = exports.Approval = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["AGENT"] = "AGENT";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var Approval;
(function (Approval) {
    Approval["APPROVED"] = "APPROVED";
    Approval["SUSPEND"] = "SUSPEND";
})(Approval || (exports.Approval = Approval = {}));
var User_Status;
(function (User_Status) {
    User_Status["ACTIVE"] = "ACTIVE";
    User_Status["INACTIVE"] = "INACTIVE";
    User_Status["BLOCKED"] = "BLOCKED";
})(User_Status || (exports.User_Status = User_Status = {}));
