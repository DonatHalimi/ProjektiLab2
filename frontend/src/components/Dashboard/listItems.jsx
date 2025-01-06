import {
    AirplaneTicketOutlined,
    Apartment,
    Assessment,
    DashboardCustomize,
    DashboardOutlined,
    FlightTakeoff,
    FmdGood,
    Group,
    HotelOutlined,
    KingBedOutlined,
    LocalAirportOutlined,
    Map,
    MapOutlined,
    PeopleOutlineOutlined,
    PersonOutline,
    Report,
    SingleBed,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveListItem, CollapsibleListItem } from '../../assets/CustomComponents';

export const mainListItems = ({ setCurrentView }) => {
    const [crudOpen, setCrudOpen] = useState(true);
    const [usersOpen, setUsersOpen] = useState(true);
    const [flightsOpen, setFlightsOpen] = useState(true);
    const [toursOpen, setToursOpen] = useState(true);
    const [hotelsOpen, setHotelsOpen] = useState(true);
    const [reportsOpen, setReportsOpen] = useState(true);

    const [activeItem, setActiveItem] = useState('');
    const navigate = useNavigate();

    const handleItemClick = (view) => {
        setCurrentView(view);
        setActiveItem(view);
        navigate(`/dashboard/${view}`);
    };

    useEffect(() => {
        const path = window.location.pathname.split('/')[2];
        if (path) {
            setActiveItem(path);
        } else {
            setActiveItem('users');
        }

        const savedStates = JSON.parse(localStorage.getItem('collapsibleState')) || {};
        setCrudOpen(savedStates.crudOpen ?? true);
        setUsersOpen(savedStates.usersOpen ?? true);
        setFlightsOpen(savedStates.flightsOpen ?? true);
        setToursOpen(savedStates.toursOpen ?? true);
        setHotelsOpen(savedStates.hotelsOpen ?? true);
        setReportsOpen(savedStates.reportsOpen ?? true);
    }, []);

    useEffect(() => {
        const collapsibleState = {
            crudOpen,
            usersOpen,
            flightsOpen,
            toursOpen,
            hotelsOpen,
            reportsOpen,
        };
        localStorage.setItem('collapsibleState', JSON.stringify(collapsibleState));
    }, [crudOpen, usersOpen, flightsOpen, toursOpen, hotelsOpen, reportsOpen]);

    return (
        <>
            {/* Dashboard item */}
            <ActiveListItem
                icon={<DashboardOutlined />}
                primary="Dashboard"
                handleClick={() => handleItemClick('main')}
                selected={activeItem === 'main'}
            />

            {/* CRUDs Collapsible List */}
            <CollapsibleListItem
                open={crudOpen}
                handleClick={() => setCrudOpen(!crudOpen)}
                icon={<DashboardCustomize />}
                primary="CRUDs"
            >
                {/* Users Collapsible List */}
                <CollapsibleListItem
                    open={usersOpen}
                    handleClick={() => setUsersOpen(!usersOpen)}
                    icon={<Group />}
                    primary="User"
                >
                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('users')}
                        selected={activeItem === 'users'}
                        icon={<PersonOutline />}
                        primary="Users"
                    />

                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('roles')}
                        selected={activeItem === 'roles'}
                        icon={<PeopleOutlineOutlined />}
                        primary="Roles"
                    />
                </CollapsibleListItem>

                {/* Flights Collapsible List */}
                <CollapsibleListItem
                    open={flightsOpen}
                    handleClick={() => setFlightsOpen(!flightsOpen)}
                    icon={<LocalAirportOutlined />}
                    primary="Flight"
                >
                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('flights')}
                        selected={activeItem === 'flights'}
                        icon={<FlightTakeoff />}
                        primary="Flights"
                    />

                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('flightPurchases')}
                        selected={activeItem === 'flightPurchases'}
                        icon={<AirplaneTicketOutlined />}
                        primary="Flight Purchases"
                    />
                </CollapsibleListItem>

                {/* Tours Collapsible List */}
                <CollapsibleListItem
                    open={toursOpen}
                    handleClick={() => setToursOpen(!toursOpen)}
                    icon={<FmdGood />}
                    primary="Tour"
                >
                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('tours')}
                        selected={activeItem === 'tours'}
                        icon={<MapOutlined />}
                        primary="Tours"
                    />

                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('tourPurchases')}
                        selected={activeItem === 'tourPurchases'}
                        icon={<Map />}
                        primary="Tour Purchases"
                    />
                </CollapsibleListItem>

                {/* Hotels Collapsible List */}
                <CollapsibleListItem
                    open={hotelsOpen}
                    handleClick={() => setHotelsOpen(!hotelsOpen)}
                    icon={<Apartment />}
                    primary="Hotel"
                >
                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('hotels')}
                        selected={activeItem === 'hotels'}
                        icon={<HotelOutlined />}
                        primary="Hotels"
                    />

                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('rooms')}
                        selected={activeItem === 'rooms'}
                        icon={<SingleBed />}
                        primary="Rooms"
                    />

                    <ActiveListItem
                        sx={{ pl: 4 }}
                        handleClick={() => handleItemClick('roomPurchases')}
                        selected={activeItem === 'roomPurchases'}
                        icon={<KingBedOutlined />}
                        primary="Room Purchases"
                    />
                    
                </CollapsibleListItem>

                {/* Reports Collapsible List */}
                <CollapsibleListItem
                    open={reportsOpen}
                    handleClick={() => setReportsOpen(!reportsOpen)}
                    icon={<Assessment />}
                    primary="Reports"
                >
                    <ActiveListItem
                        handleClick={() => handleItemClick('flightPurchaseReports')}
                        selected={activeItem === 'flightPurchaseReports'}
                        icon={<FlightTakeoff />}
                        primary="Flight Reports"
                    />

                    <ActiveListItem
                        handleClick={() => handleItemClick('tourPurchaseReports')}
                        selected={activeItem === 'tourPurchaseReports'}
                        icon={<Map />}
                        primary="Tour Reports"
                    />
                </CollapsibleListItem>
            </CollapsibleListItem>
        </>
    );
};

export const secondaryListItems = (
    <>
        {/* <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItemButton> */}
    </>
); 
