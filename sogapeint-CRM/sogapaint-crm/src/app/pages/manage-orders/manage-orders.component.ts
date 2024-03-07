import { Component, OnInit, Renderer2, OnDestroy } from "@angular/core";
import { ContractService } from "../../core/services/contract.service";
import { Router } from "@angular/router";
import { Contract } from "../../core/models/contract.models";
import { UserProfileService } from "src/app/core/services/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-manage-orders",
  templateUrl: "./manage-orders.component.html",
  styleUrls: ["./manage-orders.component.scss"],
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> =
    [];
  pageTitle: string = "Gestion des commandes";
  isLoading = true;
  sortColumn: string = "";
  sortDirection: "asc" | "desc" = "asc";
  filter: string = "";
  filteredOrders: any[] = [];
  ordersToDisplay: any[] = [];
  tags: string[] = [
    "En cours",
    "Non attribué",
    "Réalisé",
    "Facturé",
    "Annulé",
    "Anomalie",
    "Incident",
  ];
  availableTags: string[] = [];
  activeTags: string[] = [];
  orders: Contract[] = [];
  private destroy$ = new Subject<void>();
  private ongoingContractsEventSource: EventSource;
  private notOngoingContractsEventSource: EventSource;

  itemsPerPage = 10;
  currentPage = 1;
  totalOrdersToShow = [];

  constructor(
    private contractService: ContractService,
    private userService: UserProfileService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Sogapeint" },
      { label: "Gestion des commandes", active: true },
    ];
    this.availableTags = this.tags;

    this.activeTags.push("En cours");

    this.availableTags = this.availableTags.filter((tag) => tag !== "En cours");
    // charge les contrats en cours, puis les contrats non en cours seulement après
    this.loadOnGoingContractsStream();
    this.loadNotOnGoingContracts();
    // this.loadOnGoingContractsStream();
  }

  ngOnDestroy() {
    this.contractService.closeEventSource(this.ongoingContractsEventSource);
    this.contractService.closeEventSource(this.notOngoingContractsEventSource);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // loadContracts() {
  //   console.log("Chargement des commandes");
  //   this.isLoading = true;
  //   this.contractService.getOnGoingContracts().subscribe({
  //     next: (data) => {
  //       this.orders = data;
  //       this.filteredOrders = [...this.orders];

  //       this.filteredOrders.forEach((order) => {
  //         order.date_cde = this.convertDateFormat(order.date_cde);
  //         order.start_date_work = this.convertDateFormat(order.start_date_work);
  //         order.end_date_work = this.convertDateFormat(order.end_date_work);
  //       });

  //       this.availableTags = this.tags.filter((tag) => tag !== "En cours");

  //       this.activeTags = ["En cours"];
  //       this.onSearch();

  //       this.isLoading = false;

  //       this.updateOrdersToShow();
  //     },

  //     error: (error) =>
  //       console.error("Erreur lors du chargement des commandes", error),
  //   });
  // }

  loadNotOnGoingContracts() {
    console.log("loadNotOnGoingContracts");
    this.contractService.getNotOnGoingContracts().subscribe({
      next: (notOnGoingContracts) => {
        this.orders = [...this.orders, ...notOnGoingContracts];
      },
      error: (error) => {
        console.error(
          "Erreur lors du chargement des contrats non en cours",
          error
        );
      },
    });
  }

  // processOrders() {
  //   console.log("processOrders");

  //   this.filteredOrders.forEach((order) => {
  //     order.date_cde = this.convertDateFormat(order.date_cde);
  //     order.start_date_work = this.convertDateFormat(order.start_date_work);
  //     order.end_date_work = this.convertDateFormat(order.end_date_work);
  //   });
  //   this.updateOrdersToShow();
  // }

  // loadOnGoingContractsStream() {
  //   this.isLoading = true;
  //   this.contractService
  //     .getOnGoingContractsStream()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (contract: any) => {
  //         this.orders.push(contract);
  //         this.isLoading = false;
  //         if (this.activeTags.includes("En cours")) {
  //           this.filteredOrders.push(contract);
  //           this.updateOrdersToShow();
  //         }
  //       },
  //       error: (error) =>
  //         console.error(
  //           "Erreur lors du chargement des contrats en cours",
  //           error
  //         ),
  //     });
  // }
  loadOnGoingContractsStream() {
    this.isLoading = true; // Indique le début du chargement
  
    this.contractService
      .getOnGoingContractsStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (contract: any) => {
          this.orders.push(contract); // Ajoute chaque contrat reçu à la liste totale des commandes
          this.filteredOrders.push(contract);
          // Vérifie si le nombre de contrats affichés est inférieur à itemsPerPage
          if (this.totalOrdersToShow.length < this.itemsPerPage) {
            this.ordersToDisplay.push(contract); // Ajoute le contrat à la liste filtrée pour affichage
            this.updateOrdersToShow(); // Met à jour les contrats à afficher
  
            if (this.totalOrdersToShow.length === 1) {
              this.isLoading = false; // Arrête le chargement une fois itemsPerPage atteint
            }
          }
          // Si itemsPerPage contrats sont affichés, les contrats suivants seront chargés en mémoire mais pas immédiatement affichés
        },
        error: (error) => {
          console.error("Erreur lors du chargement des contrats en cours", error);
          this.isLoading = false; // Arrête le chargement en cas d'erreur
        },
      });
  }

  // filterAndProcessOrders() {
  //   if (this.activeTags.includes("En cours")) {
  //     this.filteredOrders = this.orders.filter((order) =>
  //       this.orderHasTag(order, "En cours")
  //     );
  //   } else {
  //     this.filteredOrders = this.orders;
  //   }

  //   this.updateOrdersToShow();
  // }


  shouldAddToDisplay(): boolean {
    return this.totalOrdersToShow.length < this.itemsPerPage * this.currentPage;
  }

  updateOrdersToShow() {
    // if (!this.shouldAddToDisplay()) return; // Empêche la mise à jour si la limite est atteinte.
    const start = this.itemsPerPage * (this.currentPage - 1);
    const end = this.itemsPerPage * this.currentPage;
    this.totalOrdersToShow = this.filteredOrders.slice(start, end);
    this.ordersToDisplay = this.filteredOrders.slice(0, this.itemsPerPage * this.currentPage); // Met à jour les contrats à afficher
  }

  onScroll(): void {
    console.log("Scrolling");
    this.currentPage++;
    console.log("Current page:", this.currentPage);
    this.updateOrdersToShow();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
      console.log(`Sorting by ${this.sortColumn} ${this.sortDirection}`);
    }
    this.sortOrders();
  }

  onSearch(): void {
    const searchTerms = this.filter.toLowerCase().split(" ");

    let filteredBySearchText = !this.filter
      ? [...this.orders]
      : this.orders.filter((order) =>
          searchTerms.every((term) => this.searchInOrder(order, term))
        );

    this.filteredOrders = filteredBySearchText.filter(
      (order) =>
        this.activeTags.length === 0 ||
        this.activeTags.every((tag) => this.orderHasTag(order, tag))
    );
    this.updateOrdersToShow();
  }

  orderHasTag(order: any, tag: string): boolean {
    switch (tag) {
      case "En cours":
        return order.status === "in_progress";
      case "Réalisé":
        return order.status === "achieve";
      case "Facturé":
        return order.status === "invoiced";
      case "Anomalie":
        return order.status === "anomaly";
      case "Annulé":
        return order.status === "canceled";
      case "Incident":
        return Array.isArray(order.incident) && order.incident.length > 0;
      case "Non attribué":
        return order.status === null;
      default:
        return false;
    }
  }

  searchInOrder(order: any, searchTerm: string): boolean {
    const searchInObject = (obj: any): boolean => {
      return Object.values(obj).some((value) => {
        if (typeof value === "object" && value !== null) {
          return Array.isArray(value)
            ? value.some((subValue) => searchInObject(subValue))
            : searchInObject(value);
        }
        return String(value).toLowerCase().includes(searchTerm);
      });
    };

    return searchInObject(order);
  }

  sortOrders() {
    if (!this.sortColumn) return;

    this.filteredOrders.sort((a, b) => {
      let valueA = this.getColumnValue(a, this.sortColumn);
      let valueB = this.getColumnValue(b, this.sortColumn);

      if (valueA == null) valueA = "";
      if (valueB == null) valueB = "";

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      let comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;

      return this.sortDirection === "asc" ? comparison : -comparison;
    });
    this.updateOrdersToShow();
  }

  getColumnValue(order: any, column: string) {
    switch (column) {
      case "client":
        return `${order?.customer?.firstname} ${order?.customer?.lastname}`;
      case "contact":
        return `${order?.contact?.firstname} ${order?.contact?.lastname}`;
      case "external_contributor":
        return `${order?.external_contributor?.firstname} ${order?.external_contributor?.lastname}`;
      default:
        return order[column];
    }
  }

  activateTag(tag: string) {
    if (!this.activeTags.includes(tag)) {
      this.activeTags.push(tag);
      this.availableTags = this.availableTags.filter((t) => t !== tag);
      this.onSearch();
    }
  }

  deactivateTag(tag: string, event: MouseEvent) {
    event.stopPropagation();
    const index = this.activeTags.indexOf(tag);
    this.availableTags.push(tag);

    this.availableTags.sort(
      (a, b) => this.tags.indexOf(a) - this.tags.indexOf(b)
    );
    if (index > -1) {
      this.activeTags.splice(index, 1);
      this.onSearch();
    }
  }

  selectOrder(order: any) {
    console.log("Commande sélectionnée:", order);
    this.router.navigate(["/order-detail", order._id]);
  }

  // getUserName(userId: string) {
  //   return this.userService.getOne(userId).subscribe({
  //     next: (user) => {
  //       return `${user.firstName} ${user.lastName}`;
  //     },
  //     error: (error) =>
  //       console.error("Erreur lors de la récupération de l'utilisateur", error),
  //   });
  // }

  // mapTagToStatus(tag: string): string | null {
  //   const tagStatusMapping: { [key: string]: string } = {
  //     in_progress: "En cours",
  //     null: "Non attribué",
  //     achieve: "Réalisé",
  //     invoiced: "Facturé",
  //     anomaly: "Anomalie",
  //     canceled: "Annulé",
  //   };

  //   return tagStatusMapping[tag] || null;
  // }

  trackByFn(index, item) {
    return item._id;
  }

  convertDateFormat(dateStr: string): string {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const parts = dateStr.split("/");

      return `${parts[0]}/${parts[1]}/${parts[2].slice(-2)}`;
    }

    return dateStr;
  }
}
