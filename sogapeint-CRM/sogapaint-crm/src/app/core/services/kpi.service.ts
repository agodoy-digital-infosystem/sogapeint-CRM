import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KpiService {
    private apiUrl = '/api/kpi';
    
    constructor(private http: HttpClient) {}
    
    getTotalOrders(): Observable<any> {
        return this.http.get(`${this.apiUrl}/totalOrders`);
    }
    
    getOrdersByDate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/ordersByDate`, { params: { startDate, endDate } });
    }
    
    getActiveOrders(): Observable<any> {
        return this.http.get(`${this.apiUrl}/activeOrders`);
    }
    
    getActiveOrdersByDate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/activeOrdersByDate`, { params: { startDate, endDate } });
    }
    
    getInactiveOrders(): Observable<any> {
        return this.http.get(`${this.apiUrl}/inactiveOrders`);
    }
    
    getInactiveOrdersByDate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/inactiveOrdersByDate`, { params: { startDate, endDate } });
    }
    
    getCompletedOrders(): Observable<any> {
        return this.http.get(`${this.apiUrl}/completedOrders`);
    }
    
    getCompletedOrdersByDate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/completedOrdersByDate`, { params: { startDate, endDate } });
    }
    
    getAverageExecutionTime(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/averageExecutionTime`, { params: { startDate, endDate } });
    }
    
    // Continuez à ajouter des méthodes pour chaque endpoint...
    
    getTotalRevenue(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/totalRevenue`, { params: { startDate, endDate } });
    }
    
    getAverageRevenue(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/averageRevenue`, { params: { startDate, endDate } });
    }
    
    getOrdersByService(): Observable<any> {
        return this.http.get(`${this.apiUrl}/ordersByService`);
    }
    
    getOrdersByServiceByDate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/ordersByServiceByDate`, { params: { startDate, endDate } });
    }
    
    getOrdersWithIncidents(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/ordersWithIncidents`, { params: { startDate, endDate } });
    }
    
    getMailResponseRate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/mailResponseRate`, { params: { startDate, endDate } });
    }
    
    getContributorsEfficiency(): Observable<any> {
        return this.http.get(`${this.apiUrl}/contributorsEfficiency`);
    }
    
    getOccupationRate(): Observable<any> {
        return this.http.get(`${this.apiUrl}/occupationRate`);
    }
    
    getAverageBillingAmount(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/averageBillingAmount`, { params: { startDate, endDate } });
    }
    
    getAverageExternalContributorPaymentDelay(): Observable<any> {
        return this.http.get(`${this.apiUrl}/averageExternalContributorPaymentDelay`);
    }
    
    getOrdersStatusDistribution(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/ordersStatusDistribution`, { params: { startDate, endDate } });
    }
    
    getCustomerRenewalRate(startDate: string, endDate: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/customerRenewalRate`, { params: { startDate, endDate } });
    }
    
}
