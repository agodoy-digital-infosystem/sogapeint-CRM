import { User } from './auth.models';
import { Document } from './document.models';
import { Contract } from './contract.models'; // Assurez-vous que ce modèle est correctement défini

export interface Company {
  id: string; 
  names: string[];
  normalized_name: string;
  address?: string;
  employees?: User[]; // Peut-être remplacé par des identifiants de type string si vous ne chargez pas les objets User complets
  industry?: string[];
  websites?: string[];
  phone?: string[];
  email?: string[];
  additionalFields?: { key: string, value: string }[];
  documents?: Document[]; // Peut-être remplacé par des identifiants de type string si vous ne chargez pas les objets Document complets
  contractsAsCustomer?: Contract[]; 
  contractsAsContact?: Contract[]; 
  contractsAsExternalContributor?: Contract[];
}

