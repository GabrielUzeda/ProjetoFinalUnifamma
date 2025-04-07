const express = require('express');
const router = express.Router();

// Rota de saúde
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = router;