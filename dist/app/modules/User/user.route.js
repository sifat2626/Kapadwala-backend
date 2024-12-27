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
const limitUnSubscribedUser_1 = __importDefault(require("../../middlewares/limitUnSubscribedUser"));
const router = express_1.default.Router();
// Route for creating a new user
router.post('/create', (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserControllers.createUser);
// Route for changing a user's role
router.patch('/:id/change-role', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserRoleValidationSchema), user_controller_1.UserControllers.updateUserRole);
// Route for deleting a user
router.delete('/:id/delete', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.deleteUser);
// Route for subscribing a user
router.patch('/:id/subscribe', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.subscribeUser);
// Route to subscribe to the newsletter
router.post('/newsletter/subscribe', (0, protect_1.default)(), (0, limitUnSubscribedUser_1.default)(), user_controller_1.UserControllers.subscribeToNewsletter);
// Route to unsubscribe from the newsletter
router.delete('/newsletter/unsubscribe', (0, protect_1.default)(), (0, limitUnSubscribedUser_1.default)(), user_controller_1.UserControllers.unsubscribeFromNewsletter);
// Route to add a favorite company
router.post('/favorites/:companyId/add', (0, protect_1.default)(), user_controller_1.UserControllers.addFavoriteCompany);
// Route to remove a favorite company
router.delete('/favorites/:companyId/remove', (0, protect_1.default)(), user_controller_1.UserControllers.removeFavoriteCompany);
// Route to get all favorite companies
router.get('/favorites', (0, protect_1.default)(), user_controller_1.UserControllers.getAllFavoriteCompanies);
// Route to add a favorite credit card vendor
router.post('/favorites/vendor/:vendorId/add', (0, protect_1.default)(), user_controller_1.UserControllers.addFavoriteCreditCardVendor);
// Route to remove a favorite credit card vendor
router.delete('/favorites/vendor/:vendorId/remove', (0, protect_1.default)(), user_controller_1.UserControllers.removeFavoriteCreditCardVendor);
// Route to get the currently logged-in user's information
router.get('/me', (0, protect_1.default)(), user_controller_1.UserControllers.getMe);
// Route to get all users (admin and super admin access only)
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.getAllUsers);
// Route to get all favorite credit card vendors
router.get('/favorites/vendors', (0, protect_1.default)(), user_controller_1.UserControllers.getAllFavoriteCreditCardVendors);
exports.UserRoutes = router;
