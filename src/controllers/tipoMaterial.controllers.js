
const tipoMaterialService= require('../services/tipoMaterial.services');

exports.getAllTipos = (req, res) =>{
  const tipos= tipoMaterialService.getAll();
  res.json(tipos);
}

exports.getTipoById= (req, res) => {
  const tipo = tipoMaterialService.getById(req.params.id);
  if(!tipo) return res.status(404).json({error: 'tipo material no encontrado'});
  res.json(tipo);
}

exports.createTipo= (req, res) => {
  const newTipo = tipoMaterialService.create(req.body);
  res.status(201).json(newTipo);
}

exports.updateTipo = (req, res) => {
  const updatedTipo = tipoMaterialService.update(req.params.id, req.body);
  if(!updatedTipo) return res.status(404).json({error: 'tipo material no encontrado'});
  res.json(updatedTipo);
}

exports.deleteTipo = (req, res) => {
  const deleted = tipoMaterialService.delete(req.params.id);
  if(!deleted) return res.status(404).json({error: 'tipo material no encontrado'});
  res.status(200).json({message: 'tipo material eliminado correctamente'});
}
