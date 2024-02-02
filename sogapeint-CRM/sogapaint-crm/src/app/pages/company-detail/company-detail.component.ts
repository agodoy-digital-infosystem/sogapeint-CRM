import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Company } from 'src/app/core/models/company.models'; // Assurez-vous que le chemin d'accès est correct

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company: Company; // Remplacez par le type approprié si différent
  id: string;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['companyId']; // Assurez-vous que le nom du paramètre correspond à celui défini dans votre route
      this.loadCompany(this.id);
    });
  }

  loadCompany(id: string) {
    this.companyService.getCompanyById(id).subscribe({
      next: (company) => {
        this.company = company;
        console.log("Company loaded: ", this.company);
      },
      error: (error) => {
        console.error("Error loading the company: ", error);
      }
    });
  }
}
