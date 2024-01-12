import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';

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




  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: this.pageTitle, active: true }];
    this.loadCompanies();
  }

  /**
   * Charge la liste des entreprises.
   */
  loadCompanies() {
    this.companyService.getCompanies() 
        .subscribe(companies => {
          this.companies = companies;
          this.groupCompanies();
        });
  }

  isDuplicate(companyName: string): boolean {
    const lowerCaseNames = this.companies.map(company => company.toLowerCase());
    const count = lowerCaseNames.filter(name => name === companyName.toLowerCase()).length;
    return count > 1;
  }

  generateColorForCompany(companyName: string): string {
    const lowerCaseName = companyName.toLowerCase();
    if (!this.companyColors[lowerCaseName]) {
      // Génère une couleur aléatoire
      const color = '#' + Math.floor(Math.random()*16777215).toString(16);
      this.companyColors[lowerCaseName] = color;
    }
    return this.companyColors[lowerCaseName];
  }

  getOppositeColor(companyName: string): string {
    // Obtenez la couleur d'arrière-plan
    const color = this.generateColorForCompany(companyName);
    // Supprimez le symbole # au début
    const hex = color.slice(1);
    // Calculez le complément à 1
    const oppositeHex = (0xFFFFFF ^ parseInt(hex, 16)).toString(16);
    // Ajoutez des zéros au début si nécessaire pour obtenir une chaîne de 6 caractères
    const paddedOppositeHex = ("000000" + oppositeHex).slice(-6);
    // Retournez la couleur opposée
    return "#" + paddedOppositeHex;
  }

  groupCompanies(): void {
    this.companies.forEach(company => {
      const lowerCaseName = company.toLowerCase().replace(/\s+\d+$/, '');
      if (!this.groupedCompanies[lowerCaseName]) {
        this.groupedCompanies[lowerCaseName] = [];
      }
      this.groupedCompanies[lowerCaseName].push(company);
    });

  }
}