import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    return this.http.get<any[]>(`${environment.apiUrl}/api/auth/companies`);
  }

  /**
   * Recherche des entreprises.
   *
   * Envoie une requête GET avec un paramètre de requête pour rechercher des entreprises.
   * @param query La chaîne de caractères pour filtrer les entreprises.
   * @returns Un Observable contenant un tableau d'entreprises filtrées.
   */
  searchCompanies(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/auth/company/search`, { params: { q: query } });
  }

  /**
   * Récupère une entreprise par son identifiant.
   *
   * Envoie une requête GET pour obtenir une entreprise par son identifiant.
   * @param id L'identifiant de l'entreprise.
   * @returns Un Observable contenant l'entreprise.
   */
  getCompanyById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/auth/company/${id}`);
  }
}
