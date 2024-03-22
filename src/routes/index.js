const express = require('express')
const router_customer = require('./customer-routes/index')
const router_admin = require('./admin-routes/index')

const router = express.Router()
router.use('/api', router_customer)
router.use('/api/admin', router_admin)

module.exports = router