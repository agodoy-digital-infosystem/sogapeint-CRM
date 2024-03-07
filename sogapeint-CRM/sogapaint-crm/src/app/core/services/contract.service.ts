import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './auth.service';
import { Inject } from '@angular/core';

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
    private authToken: string = this.authService.getToken();
    
    /**
    * Constructeur du service ContractService.
    * @param http HttpClient pour les requêtes HTTP.
    */
    constructor(
        private http: HttpClient,
        @Inject(AuthenticationService) private authService: AuthenticationService 
        ) {}
        
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
        
        /**
        * Récupère les contrats en cours
        * 
        * Envoie une requête GET pour obtenir une liste de tous les contrats en cours.
        * @returns Un Observable contenant un tableau de contrats.
        */
        getOnGoingContracts(): Observable<any[]> {
            return this.http.get<any[]>(`${environment.apiUrl}/api/auth/onGoingContracts`);
        }
        
        /**
        * Récupère les contrats qui ne sont pas en cours
        * 
        * Envoie une requête GET pour obtenir une liste de tous les contrats quine sont pas en cours.
        * @returns Un Observable contenant un tableau de contrats.
        */
        getNotOnGoingContracts(): Observable<any[]> {
            return this.http.get<any[]>(`${environment.apiUrl}/api/auth/notOnGoingContracts`);
        }
        
        /**
        * Récupère les contrats en cours sous forme de stream à /streamOnGoingContracts
        * 
        * Envoie une requête GET pour obtenir une liste de tous les contrats en cours sous forme de stream.
        * @returns Un Observable contenant un tableau de contrats.
        */
        // getOnGoingContractsStream(): Observable<any[]> {
        //     return this.http.get<any[]>(`${environment.apiUrl}/api/auth/streamOnGoingContracts`);
        // }
        getOnGoingContractsStream(): Observable<any[]> {
            const contractsSubject = new Subject<any[]>();
            
            const eventSource = new EventSource(`${environment.apiUrl}/api/auth/streamOnGoingContracts`);
            eventSource.onmessage = event => {
                contractsSubject.next(JSON.parse(event.data));
            };
            eventSource.onerror = error => {
                contractsSubject.error(error);
                eventSource.close();
            };
            
            return contractsSubject.asObservable();
        }
        
        /**
        * Récupère les contrats qui ne sont pas en cours sous forme de stream à /streamNotOnGoingContracts
        * 
        * Envoie une requête GET pour obtenir une liste de tous les contrats qui ne sont pas en cours sous forme de stream.
        * @returns Un Observable contenant un tableau de contrats.
        */
        // getNotOnGoingContractsStream(): Observable<any[]> {
        //     return this.http.get<any[]>(`${environment.apiUrl}/api/auth/streamNotOnGoingContracts`);
        // }
        getNotOnGoingContractsStream(): Observable<any[]> {
            const contractsSubject = new Subject<any[]>();
            
            const eventSource = new EventSource(`${environment.apiUrl}/api/auth/streamNotOnGoingContracts`);
            eventSource.onmessage = event => {
                contractsSubject.next(JSON.parse(event.data));
            };
            eventSource.onerror = error => {
                contractsSubject.error(error);
                eventSource.close();
            };
            
            return contractsSubject.asObservable();
        }
        
        public closeEventSource(eventSource: EventSource) {
            if (eventSource) {
                eventSource.close();
            }
        }
    }
