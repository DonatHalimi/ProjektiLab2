import React from 'react';
import { Email } from '@mui/icons-material';

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
    tourPurchaseReports: React.lazy(() => import('../pages/Dashboard/TourPurchaseReports')),
    roomPurchaseReports: React.lazy(() => import('../pages/Dashboard/RoomPurchaseReports')),
    faqs: React.lazy(() => import('../pages/Dashboard/FAQsPage')),
    contacts: React.lazy(() => import('../pages/Dashboard/ContactsPage')),
};

export default pages;