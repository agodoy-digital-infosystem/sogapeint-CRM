/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { orders, action, args } = data;

  let result;
  try {
    switch (action) {
      case 'sortOrders':
        result = sortOrders(orders, args.sortColumn, args.sortDirection);
        break;
      case 'searchOrders':
        result = searchOrders(orders, args.searchTerm);
        break;
      case 'filterOrders':
        result = filterOrders(orders, args.activeTags);
        break;
      default:
        throw new Error(`Unrecognized action: ${action}`);
    }
  } catch (error) {
    // En cas d'erreur dans le worker, renvoie une erreur au composant principal
    postMessage({ error: error.message });
    return;
  }

  // Si tout se passe bien, renvoie le résultat au composant principal
  postMessage(result);
});

function sortOrders(orders, sortColumn, sortDirection) {
  if (!sortColumn) return orders;

  return orders.sort((a, b) => {
    let valueA = getColumnValue(a, sortColumn) || ""; // S'assurer que valueA n'est pas null/undefined
    let valueB = getColumnValue(b, sortColumn) || ""; // S'assurer que valueB n'est pas null/undefined

    // Convertir en minuscule pour un tri insensible à la casse
    valueA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA;
    valueB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB;

    // Si les deux valeurs sont des nombres, les convertir pour éviter un tri alphabétique
    if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
      valueA = +valueA;
      valueB = +valueB;
    }

    // Comparaison pour le tri
    let comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;

    // Gérer le sens du tri
    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

function searchOrders(orders, searchTerm) {
  if (!searchTerm) return orders;
  const lowercasedTerm = searchTerm.toLowerCase();

  return orders.filter(order => searchInOrder(order, lowercasedTerm));
}

function filterOrders(orders, activeTags) {
  return orders.filter(order => activeTags.every(tag => orderHasTag(order, tag)));
}

function orderHasTag(order, tag) {
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
      return false; // Si le tag n'est pas reconnu, ne filtrez pas par celui-ci
  }
}

function searchInOrder(order, searchTerm) {
  return Object.values(order).some(value => {
    if (typeof value === 'object' && value !== null) {
      return searchInObject(value, searchTerm);
    }
    return value.toString().toLowerCase().includes(searchTerm);
  });
}

function searchInObject(obj, searchTerm) {
  return Object.values(obj).some(value => {
    if (typeof value === 'object' && value !== null) {
      return searchInObject(value, searchTerm);
    }
    return value.toString().toLowerCase().includes(searchTerm);
  });
}

function getColumnValue(order, column) {
  switch (column) {
    case "contact":
      // Supposons que 'contact' est un objet avec 'firstname' et 'lastname' directement sur l'objet 'order'
      return order.contact ? `${order.contact.firstname} ${order.contact.lastname}` : '';
    case "external_contributor":
      // De même pour 'external_contributor'
      return order.external_contributor ? `${order.external_contributor.firstname} ${order.external_contributor.lastname}` : '';
    case "occupied":
      // Convertissez le boolean en string pour le tri. Supposons que 'occupied' est un boolean.
      return order.occupied ? 'oui' : 'non'; // Ou autre représentation de votre choix
    case "status":
      // Ici, nous devons convertir les valeurs de statut en représentations de chaînes utilisées dans l'UI
      return mapStatusToLabel(order.status);
    default:
      // Pour d'autres valeurs qui sont directement sur l'objet 'order'
      // return order[column] ? order[column].toString() : '';
      const value = order[column];
      return value !== null && value !== undefined ? value.toString() : '';
  }
}

function mapStatusToLabel(status) {
  switch(status) {
    case 'achieve':
      return 'Réalisé';
    case 'invoiced':
      return 'Facturé';
    case 'anomaly':
      return 'Anomalie';
    case 'in_progress':
      return 'En cours';
    case 'canceled':
      return 'Annulé';
    default:
      return 'Non attribué';
  }
}


