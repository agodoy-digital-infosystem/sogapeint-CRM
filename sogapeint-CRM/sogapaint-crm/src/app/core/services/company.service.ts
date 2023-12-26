import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Assurez-vous que le chemin est correct

/**
 * Service pour la gestion des entreprises.
 *
 * Ce service fournit des fonctionnalités pour interagir avec les données des entreprises,
 * telles que l'obtention de la liste des entreprises et la recherche d'entreprises.
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  /**
   * Constructeur du service CompanyService.
   * @param http HttpClient pour les requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les entreprises.
   *
   * Envoie une requête GET pour obtenir une liste de toutes les entreprises.
   * @returns Un Observable contenant un tableau d'entreprises.
   */
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/auth/entreprises`);
  }

  /**
   * Recherche des entreprises.
   *
   * Envoie une requête GET avec un paramètre de requête pour rechercher des entreprises.
   * @param query La chaîne de caractères pour filtrer les entreprises.
   * @returns Un Observable contenant un tableau d'entreprises filtrées.
   */
  searchCompanies(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/auth/entreprises/search`, { params: { q: query } });
  }
}
