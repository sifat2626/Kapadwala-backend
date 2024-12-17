import { Router } from 'express';
import { CompanyController } from './company.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CompanyValidation } from './company.validation';

const router = Router();

router.post(
  '/',
  validateRequest(CompanyValidation.createCompany),
  CompanyController.createCompany,
);

router.get('/', CompanyController.getAllCompanies);

router.get('/:id', CompanyController.getCompanyById);

router.patch(
  '/:id',
  validateRequest(CompanyValidation.updateCompany),
  CompanyController.updateCompany,
);

router.delete('/:id', CompanyController.deleteCompany);

export const CompanyRoutes = router;
