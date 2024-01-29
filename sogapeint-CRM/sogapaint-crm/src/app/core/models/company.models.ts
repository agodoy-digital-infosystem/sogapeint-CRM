import { User } from './auth.models';
import { Document } from './document.models';

// Définition de l'interface Company qui représente une entreprise dans le CRM
export interface Company {
    // Identifiant unique de l'entreprise, généré automatiquement par MongoDB
    id: string; 

    // Un tableau de chaînes pour stocker plusieurs noms possibles de l'entreprise
    names: string[];
    
    // Un nom normalisé pour l'entreprise, requis et unique pour chaque entreprise
    normalized_name: string;
    
    // Adresse de l'entreprise, facultative (peut être non fournie)
    address?: string;
    
    // Tableau d'employés (références au modèle User), facultatif et permet de lier les employés à l'entreprise
    employees?: User[];
    
    // Tableau de chaînes pour les différents secteurs d'activité de l'entreprise, facultatif
    industry?: string[];
    
    // Tableau d'URLs pour les sites web de l'entreprise, facultatif
    websites?: string[];
    
    // Tableau de numéros de téléphone, facultatif
    phone?: string[];
    
    // Tableau d'adresses email, facultatif
    email?: string[];
    
    // Un objet pour stocker des champs supplémentaires de différents types, offrant une flexibilité dans les données enregistrées
    additionalFields?: {[key: string]: any};
    
    // Un tableau de documents associés à l'entreprise, chaque document ayant un nom, une date d'ajout et un utilisateur l'ayant ajouté
    documents?: Document[];
    
    // Un tableau pour stocker les contrats associés à l'entreprise, défini dans un autre modèle
    contracts?: Contract[]; // À définir dans un autre modèle
}



// Placeholder pour le modèle Contract, qui doit être défini ailleurs
interface Contract {
    // Définir les propriétés du contrat ici
}
