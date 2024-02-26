import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
* Service pour la gestion des contrats.
*
* Ce service fournit des fonctionnalités pour interagir avec les données des contrats,
* telles que l'obtention de la liste des contrats et la recherche de contrats.
*/
@Injectable({
    providedIn: 'root'
})
export class ContractService {
    
    /**
    * Constructeur du service ContractService.
    * @param http HttpClient pour les requêtes HTTP.
    */
    constructor(private http: HttpClient) {}
    
    /**
    * Récupère tous les contrats.
    *
    * Envoie une requête GET pour obtenir une liste de tous les contrats.
    * @returns Un Observable contenant un tableau de contrats.
    */
    getContracts(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/contracts`);
    }
    
    /**
    * Recherche des contrats.
    *
    * Envoie une requête GET avec un paramètre de requête pour rechercher des contrats.
    * @param query La chaîne de caractères pour filtrer les contrats.
    * @returns Un Observable contenant un tableau de contrats filtrés.
    */
    searchContracts(query: string): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/auth/contract/search`, { params: { q: query } });
    }
    
    /**
    * Récupère un contrat par son identifiant.
    *
    * Envoie une requête GET pour obtenir un contrat par son identifiant.
    * @param id L'identifiant du contrat.
    * @returns Un Observable contenant le contrat.
    */
    getContractById(contractId: string): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/auth/contract/${contractId}`);
    }
    
    /**
    * Crée un nouveau contrat.
    * 
    * Envoie une requête POST pour créer un nouveau contrat avec les données fournies.
    * @param contractData Les données du contrat à créer.
    * @returns Un Observable contenant la réponse du serveur.
    */
    addContract(contractData: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/auth/contract`, contractData);
    }
    
    /**
     * Met à jour un contrat existant.
     * 
     * Envoie une requête PUT pour mettre à jour un contrat existant avec les données fournies.
     * @param contractId L'identifiant du contrat à mettre à jour.
     * @param contractData Les données du contrat à mettre à jour.
     * @returns Un Observable contenant la réponse du serveur.
     */ 
    updateContract(contractId: string, contractData: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/auth/contract/${contractId}`, contractData);
    }
}
