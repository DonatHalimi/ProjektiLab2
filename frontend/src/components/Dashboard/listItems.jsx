import {
    Airlines,
    AirlinesOutlined,
    Assessment,
    AssessmentOutlined,
    Bedtime,
    BedtimeOutlined,
    DashboardCustomize,
    DashboardCustomizeOutlined,
    FlightLand,
    FlightTakeoff,
    FmdGood,
    FmdGoodOutlined,
    KingBed,
    KingBedOutlined,
    LocalConvenienceStore,
    LocalConvenienceStoreOutlined,
    MapOutlined,
    MapRounded,
    MonetizationOn,
    MonetizationOnOutlined,
    People,
    PeopleOutlineOutlined,
    Person,
    PersonOutline,
    SingleBed,
    SingleBedRounded
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveListItem, CollapsibleListItem, getLocalStorageState, saveLocalStorageState } from '../../assets/CustomComponents';

// User related pages
const userMenuItems = [
    {
        id: 'users',
        icon: { active: Person, inactive: PersonOutline },
        label: 'Users'
    },
    {
        id: 'roles',
        icon: { active: People, inactive: PeopleOutlineOutlined },
        label: 'Roles'
    }
];

// Flight related pages
const flightMenuItems = [
    {
        id: 'flights',
        icon: { active: FlightTakeoff, inactive: FlightLand },
        label: 'Flights'
    },
    {
        id: 'flightPurchases',
        icon: { active: MonetizationOn, inactive: MonetizationOnOutlined },
        label: 'Flight Purchases'
    }
];

// Tour related pages
const tourMenuItems = [
    {
        id: 'tours',
        icon: { active: MapRounded, inactive: MapOutlined },
        label: 'Tours'
    },
    {
        id: 'tourPurchases',
        icon: { active: MonetizationOn, inactive: MonetizationOnOutlined },
        label: 'Tour Purchases'
    }
];

// Hotel related pages
const hotelMenuItems = [
    {
        id: 'hotels',
        icon: { active: LocalConvenienceStore, inactive: LocalConvenienceStoreOutlined },
        label: 'Hotels'
    },
    {
        id: 'rooms',
        icon: { active: SingleBedRounded, inactive: SingleBed },
        label: 'Rooms'
    },
    {
        id: 'roomPurchases',
        icon: { active: KingBed, inactive: KingBedOutlined },
        label: 'Room Purchases'
    }
];

// Report related pages
const reportMenuItems = [
    {
        id: 'flightPurchaseReports',
        icon: { active: FlightTakeoff, inactive: FlightLand },
        label: 'Flight Reports'
    },
    {
        id: 'tourPurchaseReports',
        icon: { active: MapRounded, inactive: MapOutlined },
        label: 'Tour Reports'
    },
    {
        id: 'roomPurchaseReports',
        icon: { active: SingleBedRounded, inactive: SingleBed },
        label: 'Room Reports'
    }
];

// Collapsible sections
const mainSections = [
    {
        id: 'users',
        icon: { active: People, inactive: PeopleOutlineOutlined },
        label: 'User',
        items: userMenuItems,
        stateKey: 'usersOpen'
    },
    {
        id: 'flights',
        icon: { active: Airlines, inactive: AirlinesOutlined },
        label: 'Flight',
        items: flightMenuItems,
        stateKey: 'flightsOpen'
    },
    {
        id: 'tours',
        icon: { active: FmdGood, inactive: FmdGoodOutlined },
        label: 'Tour',
        items: tourMenuItems,
        stateKey: 'toursOpen'
    },
    {
        id: 'hotels',
        icon: { active: Bedtime, inactive: BedtimeOutlined },
        label: 'Hotel',
        items: hotelMenuItems,
        stateKey: 'hotelsOpen'
    },
    {
        id: 'reports',
        icon: { active: Assessment, inactive: AssessmentOutlined },
        label: 'Reports',
        items: reportMenuItems,
        stateKey: 'reportsOpen'
    }
];

export const mainListItems = ({ setCurrentView, collapsed }) => {
    const defaultState = {
        crudOpen: true,
        usersOpen: true,
        flightsOpen: true,
        toursOpen: true,
        hotelsOpen: true,
        reportsOpen: true,
    };

    const [menuState, setMenuState] = useState(getLocalStorageState('menuState', defaultState));
    const [activeItem, setActiveItem] = useState('');
    const navigate = useNavigate();

    const handleItemClick = (view) => {
        setCurrentView(view);
        setActiveItem(view);
        navigate(`/dashboard/${view}`);
    };

    const toggleStateAndSave = (key) => {
        const updatedState = { ...menuState, [key]: !menuState[key] };
        setMenuState(updatedState);
        saveLocalStorageState('menuState', updatedState);
    };

    useEffect(() => {
        const path = window.location.pathname.split('/')[2];
        setActiveItem(path || 'users');
    }, []);

    const renderMenuItem = ({ id, icon, label }) => (
        <ActiveListItem
            key={id}
            handleClick={() => handleItemClick(id)}
            selected={activeItem === id}
            icon={activeItem === id ? <icon.active /> : <icon.inactive />}
            primary={!collapsed ? label : ""}
            sx={{ pl: 4 }}
        />
    );

    return (
        <>
            {/* <ActiveListItem
                icon={activeItem === 'main' ? <DashboardCustomize /> : <DashboardOutlined />}
                primary={!collapsed ? "Dashboard" : ""}
                handleClick={() => handleItemClick('main')}
                selected={activeItem === 'main'}
            /> */}

            <CollapsibleListItem
                open={menuState.crudOpen}
                handleClick={() => toggleStateAndSave('crudOpen')}
                icon={menuState.crudOpen ? <DashboardCustomize /> : <DashboardCustomizeOutlined />}
                primary={!collapsed ? "CRUDs" : ""}
            >
                {mainSections.map(section => (
                    <CollapsibleListItem
                        key={section.id}
                        open={menuState[section.stateKey]}
                        handleClick={() => toggleStateAndSave(section.stateKey)}
                        icon={menuState[section.stateKey] ? <section.icon.active /> : <section.icon.inactive />}
                        primary={!collapsed ? section.label : ""}
                    >
                        {section.items.map(renderMenuItem)}
                    </CollapsibleListItem>
                ))}
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
