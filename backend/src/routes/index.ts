import { Router } from 'express';
import cropRoutes from './cropRoutes';
import schemeRoutes from './schemeRoutes';
import marketRoutes from './marketRoutes';
import soilRoutes from './soilRoutes';
import advisoryRoutes from './advisoryRoutes';
import taskRoutes from './taskRoutes';
import weatherRoutes from './weatherRoutes';
import dashboardRoutes from './dashboardRoutes';
import chatRoutes from './chatRoutes';
import diseaseRoutes from './diseaseRoutes';

const router = Router();

router.use('/crops', cropRoutes);
router.use('/schemes', schemeRoutes);
router.use('/market-prices', marketRoutes);
router.use('/soil-data', soilRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/todos', taskRoutes);
router.use('/weather', weatherRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chat', chatRoutes);
router.use('/disease', diseaseRoutes);

export default router;
