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
   * récupère tous les noms des entreprises.
   * 
   * Envoie une requête GET pour obtenir une liste de tous les noms d'entreprises.
   * @returns Un Observable contenant un tableau de noms d'entreprises.
   */
  getCompaniesNames(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/auth/companiesNames`);
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

  /**
   * Met à jour une entreprise.
   *
   * Envoie une requête PUT pour mettre à jour une entreprise.
   * @param id L'identifiant de l'entreprise.
   * @param companyData Les données de l'entreprise à mettre à jour.
   * @returns Un Observable contenant la réponse de la requête.
   */
  updateCompany(id: string, companyData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/auth/company/${id}`, companyData);
  }
  
  /**
   * Crée une entreprise.
   *
   * Envoie une requête POST pour créer une nouvelle entreprise.
   * @param companyData Les données de la nouvelle entreprise.
   * @returns Un Observable contenant la réponse de la requête.
   */
  createCompany(companyData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/company`, companyData);
  }
}
