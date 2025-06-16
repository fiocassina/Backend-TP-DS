
const express = require('express');
const router = express.Router();

const tipoMaterialController = require('../controllers/tipoMaterial.controllers');

router.get('/',tipoMaterialController.getAllTipos);

router.get('/:id', tipoMaterialController.getTipoById);

router.post('/', tipoMaterialController.createTipo);

router.put('/:id', tipoMaterialController.updateTipo);

router.delete('/:id', tipoMaterialController.deleteTipo);

module.exports = router;