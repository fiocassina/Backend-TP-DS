import crypto from 'node:crypto'

export class TipoMaterial {
  constructor(
    public nombre: string,
    public id: string = crypto.randomUUID()
  ) {}
}