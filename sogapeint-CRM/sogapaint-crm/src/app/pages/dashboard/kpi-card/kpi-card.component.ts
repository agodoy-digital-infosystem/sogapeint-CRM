import { Component, OnInit, Input, LOCALE_ID, Inject } from '@angular/core';
import { KpiService } from '../../../core/services/kpi.service'; // Assurez-vous d'avoir le bon chemin d'accès
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent implements OnInit {
  @Input() selectedKpi: string;
  @Input() selectedPeriod: string;
  
  kpiValue: number;
  kpiChange: number;
  selectedKpiName: string;
  locale: string;
  
  constructor(
    private kpiService: KpiService,
    @Inject(LOCALE_ID) locale: string
    ) {
      this.locale = locale;
    }
  
  ngOnInit(): void {
    this.fetchKpiData();
  }
  
  onKpiChange(): void {
    this.fetchKpiData();
  }
  
  onPeriodChange(): void {
    this.fetchKpiData();
  }
  
  fetchKpiData(): void {
    // Déterminez les dates de début et de fin en fonction de la période sélectionnée.
    const { startDate, endDate } = this.getDatesForSelectedPeriod(this.selectedPeriod);
    const startDateAsDate = new Date(startDate);
    const endDateAsDate = new Date(endDate);
    let { previousStartDate, previousEndDate } = this.getPreviousPeriodDates(this.selectedPeriod, startDateAsDate, endDateAsDate);
    // Faites correspondre le KPI sélectionné avec l'appel de service approprié.
    switch (this.selectedKpi) {
      case 'getOrdersByDate':
      this.selectedKpiName = 'Total des commandes par date';
      this.kpiService.getOrdersByDate(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.total;
        this.kpiService.getOrdersByDate(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getActiveOrdersByDate':
      this.selectedKpiName = 'Commandes actives par date';
      const previousStartDateAsString = formatDate(previousStartDate, 'yyyy-MM-dd', this.locale);
      const previousEndDateAsString = formatDate(previousEndDate, 'yyyy-MM-dd', this.locale);
      this.kpiService.getActiveOrdersByDate(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.total;
        this.kpiService.getActiveOrdersByDate(previousStartDateAsString, previousEndDateAsString).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getInactiveOrdersByDate':
      this.selectedKpiName = 'Commandes inactives par date';
      this.kpiService.getInactiveOrdersByDate(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.total;
        this.kpiService.getInactiveOrdersByDate(previousStartDateAsString, previousEndDateAsString).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getCompletedOrdersByDate':
      this.selectedKpiName = 'Commandes complétées par date';
      this.kpiService.getCompletedOrdersByDate(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.total;
        this.kpiService.getCompletedOrdersByDate(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getAverageExecutionTime':
      this.selectedKpiName = 'Temps d\'exécution moyen';
      this.kpiService.getAverageExecutionTime(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.average;
        this.kpiService.getAverageExecutionTime(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.average, previousData.average);
        });
      });
      break;
      
      case 'getTotalRevenue':
      this.selectedKpiName = 'Revenu total';
      this.kpiService.getTotalRevenue(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.total;
        this.kpiService.getTotalRevenue(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getAverageRevenue':
      this.selectedKpiName = 'Revenu moyen';
      this.kpiService.getAverageRevenue(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.average;
        this.kpiService.getAverageRevenue(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.average, previousData.average);
        });
      });
      break;
      
      case 'getOrdersByServiceByDate':
      this.selectedKpiName = 'Commandes par service par date';
      this.kpiService.getOrdersByServiceByDate(startDate, endDate).subscribe(currentData => {
        // TODO :  vérifier le format quand j'aurai dormi
        // Supposons que currentData retourne un total pour simplifier, ajustez selon le format réel de vos données
        this.kpiValue = currentData.total;
        this.kpiService.getOrdersByServiceByDate(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getOrdersWithIncidents':
      this.selectedKpiName = 'Commandes avec incidents';
      this.kpiService.getOrdersWithIncidents(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.total;
        this.kpiService.getOrdersWithIncidents(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.total, previousData.total);
        });
      });
      break;
      
      case 'getMailResponseRate':
      this.selectedKpiName = 'Taux de réponse aux mails';
      this.kpiService.getMailResponseRate(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.rate;
        this.kpiService.getMailResponseRate(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.rate, previousData.rate);
        });
      });
      break;
      
      case 'getAverageBillingAmount':
      this.selectedKpiName = 'Montant moyen de facturation';
      this.kpiService.getAverageBillingAmount(startDate, endDate).subscribe(currentData => {
        this.kpiValue = currentData.average;
        this.kpiService.getAverageBillingAmount(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          this.kpiChange = this.calculateChange(currentData.average, previousData.average);
        });
      });
      break;
      
      case 'getOrdersStatusDistribution':
      this.selectedKpiName = 'Distribution du statut des commandes';
      this.kpiService.getOrdersStatusDistribution(startDate, endDate).subscribe(currentData => {
        // Supposons que currentData contient la structure de réponse comme indiqué
        const currentStatusDistribution = currentData.statusDistribution;
        // Appel pour la période précédente
        this.kpiService.getOrdersStatusDistribution(formatDate(previousStartDate, 'yyyy-MM-dd', this.locale), formatDate(previousEndDate, 'yyyy-MM-dd', this.locale)).subscribe(previousData => {
          // Calcul de la différence de la distribution du statut entre les deux périodes
          this.kpiChange = this.calculateStatusChange(currentStatusDistribution, previousData.statusDistribution);
          // À implémenter: une fonction qui calcule effectivement la différence entre les distributions de statut
        });
      });
      break;
      
      
      
      
      default:
      // Gérer un cas par défaut si nécessaire.
      break;
    }
  }

  calculateStatusChange(currentDistribution, previousDistribution) {
    let changes = currentDistribution.map(status => {
      let previous = previousDistribution.find(prev => prev._id === status._id) || { count: 0 };
      return {
        status: status._id,
        change: status.count - previous.count
      };
    });
    return changes;
  }
  
  getDatesForSelectedPeriod(period: string): { startDate: string, endDate: string } {
    let startDate = new Date();
    let endDate = new Date();
    
    switch (period) {
      case 'day':
      // Les dates de début et de fin sont les mêmes pour 'day'
      break;
      case 'week':
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);
      break;
      case 'month':
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      break;
      case 'quarter':
      const currentQuarter = Math.floor((startDate.getMonth() / 3));
      startDate = new Date(startDate.getFullYear(), currentQuarter * 3, 1);
      endDate = new Date(startDate.getFullYear(), currentQuarter * 3 + 3, 0);
      break;
      case 'year':
      startDate = new Date(startDate.getFullYear(), 0, 1);
      endDate = new Date(startDate.getFullYear() + 1, 0, 0);
      break;
    }
    const format = 'yyyy-MM-dd';
    // startDate et endDate doivent être des strings au format 'yyyy-MM-dd'
    return {
      startDate: formatDate(startDate, format, this.locale),
      endDate: formatDate(endDate, format, this.locale)
    };
  }
  
  getPreviousPeriodDates(selectedPeriod: string, startDate: Date, endDate: Date): { previousStartDate: Date, previousEndDate: Date } {
    let previousStartDate = new Date(startDate);
    let previousEndDate = new Date(endDate);
    
    switch (selectedPeriod) {
      case 'day':
      previousStartDate.setDate(previousStartDate.getDate() - 1);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      break;
      case 'week':
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      previousEndDate.setDate(previousEndDate.getDate() - 7);
      break;
      case 'month':
      previousStartDate.setMonth(previousStartDate.getMonth() - 1);
      previousEndDate.setMonth(previousEndDate.getMonth() - 1);
      break;
      case 'quarter':
      previousStartDate.setMonth(previousStartDate.getMonth() - 3);
      previousEndDate.setMonth(previousEndDate.getMonth() - 3);
      break;
      case 'year':
      previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
      previousEndDate.setFullYear(previousEndDate.getFullYear() - 1);
      break;
      default:
      throw new Error(`Unknown period: ${selectedPeriod}`);
    }
    
    // Assurez-vous que la période précédente se termine juste avant le début de la période courante
    previousEndDate = new Date(previousStartDate);
    previousEndDate.setDate(previousStartDate.getDate() - 1);
    
    return {
      previousStartDate,
      previousEndDate
    };
  }
  
  
  calculateChange(currentValue: number, previousValue: number): number {
    if (previousValue === 0) {
      return currentValue > 0 ? 1 : 0;
    }
    return (currentValue - previousValue) / previousValue;
  }
  
  
  getCurrentPeriod(period: string): { startDate: string, endDate: string } {
    // Implémentez la logique pour déterminer les dates de début et de fin en fonction de la période sélectionnée.
    return { startDate: '', endDate: '' }; // Exemple de valeur de retour, à remplir avec la logique appropriée.
  }
}
