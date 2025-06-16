
let tiposMaterial= [];
let proxId= 0;

exports.getAll = () => tiposMaterial;

exports.getById = (id) => tiposMaterial.find(u => u.id == id);

exports.create = (tipoData) => {
  const newTipo ={id: proxId++ , ...tipoData};
  tiposMaterial.push(newTipo);
  return newTipo;
}

exports.update = (id, updatedData) => {
  const index = tiposMaterial.findIndex( u => u.id == id);
  if (index === -1) return null;
  tiposMaterial[index] = {...tiposMaterial[index], ...updatedData};
  return tiposMaterial[index];
}

exports.delete = (id) => {
  const prevLength = tiposMaterial.length;
  tiposMaterial = tiposMaterial.filter(u=> u.id != id);
  return tiposMaterial.length < prevLength;
}