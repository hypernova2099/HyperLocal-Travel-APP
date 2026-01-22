const express = require('express');
const authRequired = require('../middleware/auth');
const { createDayPlan, getMyPlans } = require('../controllers/dayPlanController');

const router = express.Router();

router.post('/', authRequired, createDayPlan);
router.get('/my', authRequired, getMyPlans);

module.exports = router;
