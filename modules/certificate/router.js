import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.get('/getCertificate', controller.getCertificate);
router.get('/getCertificateByToken', controller.getCertificateByToken);
router.get('/getCertificateById/:id', controller.getCertificateById);
router.post('/createCertificate', controller.createCertificate);
router.put('/updateCertificate/:id', controller.updateCertificate);
router.delete('/deleteCertificate/:id', controller.deleteCertificate);

export default router