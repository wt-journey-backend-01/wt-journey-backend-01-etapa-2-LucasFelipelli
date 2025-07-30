const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get   ('/'   , casosController.getAllCasos);
router.post  ('/'   , casosController.criarCaso);

router.get('/search', casosController.searchCasoByQuery);

router.get   ('/:id', casosController.getCasoById);
router.put   ('/:id', casosController.atualizarCasoCompleto);
router.patch ('/:id', casosController.atualizarCasoParcial);
router.delete('/:id', casosController.deletarCaso);

router.get('/:caso_id/agente', casosController.getAgenteDoCaso);

module.exports = router;
