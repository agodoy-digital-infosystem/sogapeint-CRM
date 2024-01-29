import { User } from './auth.models';

// Définition de l'interface Document pour représenter un document/fichier dans le CRM
export interface Document {
    id: string;                // Identifiant unique du document pour le référencement facile
    name: string;              // Nom du document
    type: string;              // Type du document (par exemple, pdf, jpg, docx, etc.)
    size: number;              // Taille du fichier en octets
    dateAdded: Date;           // Date à laquelle le document a été ajouté
    addedBy: User;             // Utilisateur qui a ajouté le document
    description?: string;      // Description optionnelle du document
    url: string;               // URL où le document est stocké (peut être un lien vers un stockage externe)
    tags?: string[];           // Tags optionnels pour une recherche et un classement facilités
    version?: number;          // Version du document, utile pour le contrôle de version
    accessPermissions?: string[]; // Permissions d'accès (par exemple, lire, écrire, supprimer)
}
