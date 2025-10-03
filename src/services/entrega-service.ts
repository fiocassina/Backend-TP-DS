import Entrega, { Entrega as IEntrega } from "../model/entrega-model";

class EntregaService {
  async getEntregasByProyecto(idProyecto: string): Promise<IEntrega[]> {
    try {
      return await Entrega.find({ proyecto: idProyecto })
        .populate("alumno", "nombre apellido")   
        .populate("proyecto", "titulo")          
        .exec();
    } catch (error: any) {
      throw new Error(`Error al obtener entregas: ${error.message}`);
    }
  }

  async createEntrega(data: Partial<IEntrega>): Promise<IEntrega> {
    try {
      const entrega = new Entrega(data);
      return await entrega.save();
    } catch (error: any) {
      throw new Error(`Error al crear la entrega: ${error.message}`);
    }
  }

  async updateEntrega(idEntrega: string, data: Partial<IEntrega>): Promise<IEntrega | null> {
    try {
      return await Entrega.findByIdAndUpdate(idEntrega, data, { new: true }).exec();
    } catch (error: any) {
      throw new Error(`Error al actualizar la entrega: ${error.message}`);
    }
  }

  async deleteEntrega(idEntrega: string): Promise<IEntrega | null> {
    try {
      return await Entrega.findByIdAndDelete(idEntrega).exec();
    } catch (error: any) {
      throw new Error(`Error al eliminar la entrega: ${error.message}`);
    }
  }
}

export default new EntregaService();
