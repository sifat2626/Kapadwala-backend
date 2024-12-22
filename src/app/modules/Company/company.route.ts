import { Router } from 'express';
import { CompanyController } from './company.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CompanyValidation } from './company.validation';
import auth from '../../middlewares/auth'
import protect from '../../middlewares/protect'
import { USER_ROLE } from '../User/user.constant'

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  validateRequest(CompanyValidation.createCompany),
  CompanyController.createCompany,
);

router.get('/',protect(), CompanyController.getAllCompanies);

router.get('/:id',protect(), CompanyController.getCompanyById);

router.get('/deals/:companyName/',protect(), CompanyController.getDealsByCompanyName);

router.get('/active-deals/:companyName',protect(), CompanyController.getActiveDealsByCompany);

router.patch(
  '/:id',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  validateRequest(CompanyValidation.updateCompany),
  CompanyController.updateCompany,
);

router.delete('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), CompanyController.deleteCompany);

export const CompanyRoutes = router;
