import { TipoMaterial } from '../model/tipoMaterial-model'

let tiposMateriales: TipoMaterial[] = [
 
];


let nextId: number = 1;

export const getAll = (): TipoMaterial[] => {
  return tiposMateriales;
};


export const getById = (id: number) => {
  // En el futuro, esto buscaría en una base de datos.
  return { id: 1, nombre: "John Doe" };
};


//export const getById = (id: number): TipoMaterial | undefined => {
 // return tiposMateriales.find(t => Number(t.id) === id);
//};


export const create = (data: { nombre: string }): TipoMaterial => {
  const nuevoMaterial: TipoMaterial = {
    id: String(nextId++),
    nombre: data.nombre,
  };
  tiposMateriales.push(nuevoMaterial);
  return nuevoMaterial;
};


export const update = (id: number, data: Partial<Omit<TipoMaterial, 'id'>>): TipoMaterial | null => {
  const index = tiposMateriales.findIndex((t) => Number(t.id) === id);
  if (index === -1) {
    return null; 
  }
  const materialExistente = tiposMateriales[index];

  const materialActualizado = { ...materialExistente, ...data };
  tiposMateriales[index] = materialActualizado;
  return materialActualizado;
};


export const remove = (id: number): TipoMaterial | null => {
  const index = tiposMateriales.findIndex(t => Number(t.id) === id);
  if (index === -1) {
    return null;
  }

  const [materialEliminado] = tiposMateriales.splice(index, 1);
  return materialEliminado;
};