// src/app/services/entrega.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Entrega } from '../models/entrega-interface';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/entregas';

  // Método privado para no repetir token y headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('EntregaService: no se encontró token en localStorage');
      // devolver headers vacíos en vez de lanzar: así la petición se hace y el backend responde 401 si corresponde
      return new HttpHeaders();
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // ----------------- ENTREGAS -----------------

  crearEntrega(formData: FormData): Observable<Entrega> {
    return this.http.post<Entrega>(this.baseUrl, formData, { headers: this.getAuthHeaders() });
  }

  obtenerEntregas(proyectoId: string): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`, { headers: this.getAuthHeaders() });
  }

  obtenerEntregasPorAlumno(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/mis-entregas`, { headers: this.getAuthHeaders() });
  }

  obtenerEntregaPorId(entregaId: string): Observable<Entrega> {
    const headers = this.getAuthHeaders();
    return this.http.get<Entrega>(`${this.baseUrl}/${entregaId}`, { headers });
  }

  // ----------------- CORRECCIONES -----------------

  crearCorreccion(entregaId: string, nota: number, comentario: string): Observable<any> {
    const body = { entrega: entregaId, nota, comentario };
    return this.http.post(`${this.baseUrl.replace('entregas', 'correcciones')}`, body, { headers: this.getAuthHeaders() });
  }

  obtenerCorrecciones(entregaId: string): Observable<any> {
    return this.http.get(`${this.baseUrl.replace('entregas', 'correcciones')}/entrega/${entregaId}`, { headers: this.getAuthHeaders() });
  }
}
