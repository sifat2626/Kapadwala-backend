"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const router = express_1.default.Router();
// Route for creating a new user
router.post('/create-user', 
// auth(USER_ROLE.admin),
(0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserControllers.createUser);
// Route for changing a user's role
router.patch('/change-role/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserRoleValidationSchema), user_controller_1.UserControllers.updateUserRole);
// Route for deleting a user
router.delete('/delete-user/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.deleteUser);
// Route for subscribing a user
router.patch('/subscribe/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.subscribeUser);
// Route to add a favorite company
router.post('/:companyId/favorites', (0, protect_1.default)(), user_controller_1.UserControllers.addFavoriteCompany);
// Route to remove a favorite company
router.delete('/:companyId/favorites', (0, protect_1.default)(), user_controller_1.UserControllers.removeFavoriteCompany);
router.get('/favorites', (0, protect_1.default)(), user_controller_1.UserControllers.getAllFavoriteCompanies);
router.get('/me', (0, protect_1.default)(), user_controller_1.UserControllers.getMe);
exports.UserRoutes = router;
