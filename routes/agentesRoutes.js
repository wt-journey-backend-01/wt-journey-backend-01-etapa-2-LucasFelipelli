const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

router.get   ('/'   , agentesController.getAllAgentes);
router.post  ('/'   , agentesController.cadastrarAgente);

router.get   ('/:id', agentesController.getAgenteById);
router.put   ('/:id', agentesController.atualizarAgenteCompleto);
router.patch ('/:id', agentesController.atualizarAgenteParcial);
router.delete('/:id', agentesController.deletarAgente);

module.exports = router;
