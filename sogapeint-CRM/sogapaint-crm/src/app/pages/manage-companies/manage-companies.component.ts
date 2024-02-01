import { Component, OnInit, Renderer2 } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/company.models';

@Component({
    selector: 'app-manage-companies',
    templateUrl: './manage-companies.component.html',
    styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent implements OnInit {
    breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
    companies: any[];
    companyColors = {};
    groupedCompanies = {};
    pageTitle: string = 'Gestion des entreprises';
    isLoading = true;
    sortColumn: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';
    filter: string = ''; 
    filteredCompanies: any[] = [];
    columns = [
        { name: 'normalized_name', displayName: 'Entreprise', class: 'entreprise' },
        { name: 'employees', displayName: 'Contacts', class: 'contact' },
        { name: 'contracts', displayName: 'Contrats Total', class: 'contrat total' },
        { name: 'contractsAsCustomer', displayName: 'Client', class: 'contrat client' },
        { name: 'contractsAsContact', displayName: 'Contact', class: 'contrat contact-role' },
        { name: 'contractsAsExternalContributor', displayName: 'Contributeur', class: 'contrat contributeur' },
        { name: 'contractsInProgress', displayName: 'En Cours', class: 'contrat encours' },
        { name: 'contractsCompleted', displayName: 'Terminés', class: 'contrat termine' },
        { name: 'contractsUpcoming', displayName: 'À Venir', class: 'contrat avenir' }
    ];
    tags: string[] = ['En cours', 'Non attribué', 'Réalisé', 'Facturé', 'Anomalie', 'Annulé', 'Incident'];
    availableTags: string[] = [];
    activeTags: string[] = [];
    
    constructor(private companyService: CompanyService, private renderer: Renderer2) { }
    
    ngOnInit(): void {
        this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: this.pageTitle, active: true }];
        this.availableTags = this.tags;
        this.loadCompanies();
    }
    
    /**
    * Charge la liste des entreprises.
    */
    loadCompanies() {
        this.isLoading = true;
        this.companyService.getCompanies() 
        .subscribe(companies => {
            this.companies = companies;
            this.filteredCompanies = companies;
            console.log('Companies', companies);
            this.isLoading = false;
        });
    }
    
    getTotalContracts(company: Company): number {
        return (company.contractsAsCustomer?.length || 0) +
        (company.contractsAsContact?.length || 0) +
        (company.contractsAsExternalContributor?.length || 0);
    }
    
    getContractsInStatus(company: any, status: string): number {
        // Comptabiliser les contrats selon le statut donné.
        const countStatus = (contracts) => contracts.reduce((count, contract) => {
            const contractStatus = this.getContractStatus(contract);
            return count + (contractStatus === status ? 1 : 0);
        }, 0);
        
        // Additionner les comptes pour chaque type de relation contractuelle.
        const totalCustomer = countStatus(company.contractsAsCustomer || []);
        const totalContact = countStatus(company.contractsAsContact || []);
        const totalContributor = countStatus(company.contractsAsExternalContributor || []);
        
        return totalCustomer + totalContact + totalContributor;
    }
    
    getContractStatus(contract): string { // TODO vérifier la logique de cette fonction
        const currentDate = new Date();
        const start_date_works = contract.start_date_works ? new Date(contract.start_date_works) : null;
        const end_date_works = contract.end_date_works ? new Date(contract.end_date_works) : null;
        const end_date_customer = contract.end_date_customer ? new Date(contract.end_date_customer) : null;
        const status = contract.status;
        
        if (status === "achieve" || (end_date_works && end_date_works < currentDate) || (end_date_customer && end_date_customer < currentDate)) {
            return "completed";
        } else if (status === "in_progress" || (start_date_works && start_date_works <= currentDate && (!end_date_works || end_date_works > currentDate))) {
            return "in_progress";
        } else if (!status && start_date_works && start_date_works > currentDate) {
            return "upcoming";
        } else {
            return "unknown";
        }
    }
    
    getContractsAsCustomer(company: Company): number {
        return company.contractsAsCustomer?.length || 0;
    }
    
    getContractsAsContact(company: Company): number {
        return company.contractsAsContact?.length || 0;
    }
    
    getContractsAsExternalContributor(company: Company): number {
        return company.contractsAsExternalContributor?.length || 0;
    }
    
    getEmployees(company: Company): number {
        return company.employees?.length || 0;
    }
    
    getIndustry(company: Company): string {
        return company.industry?.join(', ') || '';
    }
    
    getWebsites(company: Company): string {
        return company.websites?.join(', ') || '';
    }
    
    getPhone(company: Company): string {
        return company.phone?.join(', ') || '';
    }
    
    getEmail(company: Company): string {
        return company.email?.join(', ') || '';
    }
    
    getAdditionalFields(company: Company): string {
        return Object.entries(company.additionalFields || {}).map(([key, value]) => `${key}: ${value}`).join(', ');
    }
    
    getDocuments(company: Company): string {
        return company.documents?.map(document => document.name).join(', ') || '';
    }
    
    // onSearch(): void {
    //     let filteredCompanies = this.companies;
    
    //     // Filtre par tags actifs
    //     if (this.activeTags.length) {
    //         filteredCompanies = filteredCompanies.filter(company =>
    //             this.activeTags.every(tag => this.companyHasTag(company, tag))
    //         );
    //     }
    
    //     // Filtre par texte de recherche
    //     if (this.filter) {
    //         filteredCompanies = filteredCompanies.filter(company => this.searchInCompany(company, this.filter.toLowerCase()));
    //     }
    
    //     this.filteredCompanies = filteredCompanies;
    // }
    onSearch(): void {
        let filteredCompanies = this.companies;
        
        // Filtre par tags actifs
        if (this.activeTags.length) {
            filteredCompanies = filteredCompanies.filter(company =>
                this.activeTags.every(tag => this.companyHasTag(company, tag))
                );
            }
            
            // Filtre par texte de recherche
            if (this.filter) {
                filteredCompanies = filteredCompanies.filter(company => this.searchInCompany(company, this.filter.toLowerCase()));
            }
            
            this.filteredCompanies = filteredCompanies;
        }
        
        searchInCompany(company: any, searchTerm: string): boolean {
            // Fonction récursive pour chercher dans tous les champs et sous-champs
            const searchInObject = (obj: any): boolean => {
                return Object.values(obj).some(value => {
                    if (typeof value === 'object' && value !== null) {
                        // Si la valeur est un objet ou un tableau, chercher récursivement
                        return Array.isArray(value) ? value.some(subValue => searchInObject(subValue)) : searchInObject(value);
                    }
                    // Convertir la valeur en chaîne et vérifier si elle contient le terme de recherche
                    return String(value).toLowerCase().includes(searchTerm);
                });
            };
            
            return searchInObject(company);
        }
        
        
        selectCompany(company: any) {
            console.log('Entreprise sélectionnée:', company);
            // this.router.navigate(['/company-detail', company._id]);
        }
        
        highlightColumn(columnClass: string): void {
            const headClass = `.${columnClass}-head`;
            const cells = document.querySelectorAll(`.${columnClass}`);
            cells.forEach(cell => {
                this.renderer.addClass(cell, 'highlight-column');
            });
            const head = document.querySelectorAll(headClass);
            head.forEach(head => {
                this.renderer.addClass(head, 'highlight-head');
            });
        }
        
        resetHighlight(): void {
            const highlightedCells = document.querySelectorAll('.highlight-column');
            const highlightedHeads = document.querySelectorAll('.highlight-head');
            highlightedCells.forEach(cell => {
                this.renderer.removeClass(cell, 'highlight-column');
            });
            highlightedHeads.forEach(head => {
                this.renderer.removeClass(head, 'highlight-head');
            });
        }
        
        onSort(column: string): void {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
                console.log(`Sorting by ${this.sortColumn} ${this.sortDirection}`);
            }
            this.sortCompanies();
        }
        
        private sortCompanies(): void {
            this.filteredCompanies.sort((a, b) => {
                let valA, valB;
                
                // Gestion des cas spéciaux
                switch (this.sortColumn) {
                    case 'contractsAsCustomer.length':
                    valA = a.contractsAsCustomer?.length || 0;
                    valB = b.contractsAsCustomer?.length || 0;
                    break;
                    case 'contractsAsContact.length':
                    valA = a.contractsAsContact?.length || 0;
                    valB = b.contractsAsContact?.length || 0;
                    break;
                    case 'contractsAsExternalContributor.length':
                    valA = a.contractsAsExternalContributor?.length || 0;
                    valB = b.contractsAsExternalContributor?.length || 0;
                    break;
                    case 'contractsInProgress.length':
                    valA = this.getContractsInStatus(a, 'in_progress');
                    valB = this.getContractsInStatus(b, 'in_progress');
                    break;
                    case 'contractsCompleted.length':
                    valA = this.getContractsInStatus(a, 'completed');
                    valB = this.getContractsInStatus(b, 'completed');
                    break;
                    case 'contractsUpcoming.length':
                    valA = this.getContractsInStatus(a, 'upcoming');
                    valB = this.getContractsInStatus(b, 'upcoming');
                    break;
                    default:
                    // Pour les autres cas, utilise une réflexion dynamique
                    valA = a[this.sortColumn];
                    valB = b[this.sortColumn];
                }
                
                let comparison = 0;
                if (valA > valB) {
                    comparison = 1;
                } else if (valA < valB) {
                    comparison = -1;
                }
                return this.sortDirection === 'asc' ? comparison : comparison * -1;
            });
        }
        
        activateTag(tag: string) {
            if (!this.activeTags.includes(tag)) {
                this.activeTags.push(tag); // Ajouter le tag à la liste des tags actifs
                this.availableTags = this.availableTags.filter(t => t !== tag); // Enlever le tag de la liste des tags disponibles
                this.onSearch(); // Mettre à jour la recherche avec le nouveau tag
            }
        }
        
        // Enlève un tag de la recherche et met à jour la liste des entreprises filtrées
        deactivateTag(tag: string, event: MouseEvent) {
            event.stopPropagation(); // Empêche le clic de se propager à l'élément parent
            const index = this.activeTags.indexOf(tag);
            this.availableTags.push(tag); // Ajouter le tag à la liste des tags disponibles
            // trie les tags disponibles selon l'ordre de la liste des tags
            this.availableTags.sort((a, b) => this.tags.indexOf(a) - this.tags.indexOf(b));
            if (index > -1) {
                this.activeTags.splice(index, 1);
                this.onSearch(); // Mettre à jour la recherche sans le tag
            }
        }
        
        // Vérifie si une entreprise a un tag spécifique basé sur vos critères
        // companyHasTag(company: any, tag: string): boolean {
        //     // Mapping des tags vers les statuts de contrat correspondants
        //     const statusMapping: { [key: string]: string | null } = {
        //         'En cours': 'in_progress',
        //         'Non attribué': null, // TODO Adapter cette valeur si nécessaire
        //         'Réalisé': 'achieve',
        //         'Facturé': 'invoiced',
        //         'Anomalie': 'anomaly',
        //         'Annulé': 'canceled',
        //         // 'Incident' n'est pas un statut mais une propriété distincte, traitée séparément ci-dessous
        //     };
        
        //     // Traitement spécial pour les incidents car ils ne sont pas un statut mais une propriété distincte
        //     if (tag === 'Incident') {
        //         return company.contractsAsCustomer.some((contract: any) => contract.incident && contract.incident.length > 0) ||
        //         company.contractsAsContact.some((contract: any) => contract.incident && contract.incident.length > 0) ||
        //         company.contractsAsExternalContributor.some((contract: any) => contract.incident && contract.incident.length > 0);
        //     }
        
        //     // Obtient le statut correspondant au tag
        //     const status = statusMapping[tag];
        
        //     // Vérifie si au moins un contrat dans n'importe quelle catégorie correspond au statut cherché
        //     return company.contractsAsCustomer.some((contract: any) => contract.status === status) ||
        //     company.contractsAsContact.some((contract: any) => contract.status === status) ||
        //     company.contractsAsExternalContributor.some((contract: any) => contract.status === status);
        // }
        companyHasTag(company: any, tag: string): boolean {
            // Special handling for 'Incident' as it is not a status but a separate property
            if (tag === 'Incident') {
                return company.contractsAsCustomer.some(contract => contract.incident && contract.incident.length > 0) ||
                company.contractsAsContact.some(contract => contract.incident && contract.incident.length > 0) ||
                company.contractsAsExternalContributor.some(contract => contract.incident && contract.incident.length > 0);
            }
            
            // Direct status check for other tags
            const statusMapping = {
                'Réalisé': 'achieve',
                'Facturé': 'invoiced',
                'Anomalie': 'anomaly',
                'Annulé': 'canceled',
            };
            
            if (tag in statusMapping) {
                return company.contractsAsCustomer.some(contract => contract.status === statusMapping[tag]) ||
                company.contractsAsContact.some(contract => contract.status === statusMapping[tag]) ||
                company.contractsAsExternalContributor.some(contract => contract.status === statusMapping[tag]);
            }
            
            // Use getContractStatus for the 'En cours' tag
            if (tag === 'En cours') {
                return company.contractsAsCustomer.some(contract => this.getContractStatus(contract) === 'in_progress') ||
                company.contractsAsContact.some(contract => this.getContractStatus(contract) === 'in_progress') ||
                company.contractsAsExternalContributor.some(contract => this.getContractStatus(contract) === 'in_progress');
            }
            
            // If tag is 'Non attribué', check for contracts without status
            if (tag === 'Non attribué') {
                return company.contractsAsCustomer.some(contract => contract.status === null) ||
                company.contractsAsContact.some(contract => contract.status === null) ||
                company.contractsAsExternalContributor.some(contract => contract.status === null);
            }
            
            return false; // If none of the above conditions are met
        }
        
        
        mapTagToStatus(tag: string): string | null {
            const tagStatusMapping = {
                'En cours': 'in_progress',
                'Non attribué': null,
                'Réalisé': 'achieve',
                'Facturé': 'invoiced',
                'Anomalie': 'anomaly',
                'Annulé': 'canceled',
            };
            
            return tagStatusMapping[tag] || null; // Returns null if the tag is not found in the mapping
        }
        
        
        
        resetFilter() {
            this.filter = '';
            this.activeTags = [];
            this.availableTags = this.tags;
            this.onSearch();
        }
    }