import React from 'react';

const pages = {
    users: React.lazy(() => import('../pages/Dashboard/UsersPage')),
    roles: React.lazy(() => import('../pages/Dashboard/RolesPage')),
    flights: React.lazy(() => import('../pages/Dashboard/FlightsPage')),
    flightPurchases: React.lazy(() => import('../pages/Dashboard/FlightPurchasesPage')),
    tours: React.lazy(() => import('../pages/Dashboard/ToursPage')),
    tourPurchases: React.lazy(() => import('../pages/Dashboard/TourPurchasesPage')),
    hotels: React.lazy(() => import('../pages/Dashboard/HotelsPage')),
    rooms: React.lazy(() => import('../pages/Dashboard/RoomsPage')),
    roomPurchases: React.lazy(() => import('../pages/Dashboard/RoomPurchasesPage')),
    flightPurchaseReports: React.lazy(() => import('../pages/Dashboard/flightPurchaseReports')),
};

export default pages;