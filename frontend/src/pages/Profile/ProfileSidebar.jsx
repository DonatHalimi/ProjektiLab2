import { AirplaneTicketOutlined, HotelOutlined, MapOutlined, PersonOutlined, StarBorderOutlined } from '@mui/icons-material';
import { Divider, List, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActiveListItem, CustomAirplaneTicket, CustomHotel, CustomMap, CustomPerson, CustomStar, SidebarLayout } from '../../assets/CustomComponents';
import { getCurrentUser } from '../../services/authService';

const ProfileSidebar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const path = location.pathname.split('/')[2];
        setActiveItem(path || 'me');
    }, [location]);

    const handleItemClick = (view) => {
        setActiveItem(view);
        navigate(`/profile/${view}`);
    };

    const greetingTime = new Date().getHours() < 12 ? "morning" : (new Date().getHours() < 18 ? "afternoon" : "evening");
    const greetingHeader = `Good ${greetingTime}, ${user?.firstName || 'User'}.`;
    const greetingMessage = 'Thank you for being part of NAME';

    const items = [
        { key: 'me', label: 'Profile', icon: <CustomPerson isActive={true} />, inactiveIcon: <PersonOutlined />, },
        { key: 'flight-purchases', label: 'Flights', icon: <CustomAirplaneTicket isActive={true} />, inactiveIcon: <AirplaneTicketOutlined />, },
        { key: 'tour-purchases', label: 'Tours', icon: <CustomMap isActive={true} />, inactiveIcon: <MapOutlined />, },
        { key: 'room-purchases', label: 'Rooms', icon: <CustomHotel isActive={true} />, inactiveIcon: <HotelOutlined />, },
        { key: 'reviews', label: 'Reviews', icon: <CustomStar isActive={true} />, inactiveIcon: <StarBorderOutlined />, },
    ];

    return (
        <SidebarLayout>
            {loading ? (
                <>
                    <Skeleton width='90%' />
                    <Skeleton width='85%' />
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom className="!text-gray-800 !font-semilight">
                        {greetingHeader}
                    </Typography>
                    <span className="text-md">{greetingMessage}</span>
                </>
            )}
            <Divider className='!mt-4 !mb-2' />
            <List component="nav">
                {items.map(({ key, label, icon, inactiveIcon }) => (
                    <ActiveListItem
                        key={key}
                        handleClick={() => handleItemClick(key)}
                        selected={activeItem === key}
                        icon={activeItem === key ? icon : inactiveIcon}
                        primary={label}
                    />
                ))}
            </List>
        </SidebarLayout>
    );
};

export default ProfileSidebar;