import {
    AirplaneTicket,
    ArrowBack,
    ChevronLeft,
    ChevronRight,
    Close,
    CreateOutlined,
    Dashboard,
    Download,
    ExpandLess,
    ExpandMore,
    Hotel,
    Login,
    Logout,
    Map,
    MenuOutlined,
    Person,
    Search,
    StarOutlined
} from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    AppBar as MuiAppBar, Drawer as MuiDrawer,
    Pagination,
    PaginationItem,
    Skeleton,
    Stack,
    styled,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import { getCurrentUser } from "../services/authService";

export const WaveSkeleton = (props) => <Skeleton animation="wave" {...props} />;

export const LoadingOverlay = () => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
        <CircularProgress size={60} style={{ color: '#FFFFFF' }} />
    </div>
);

export const LoadingFlightItem = () => {
    return (
        <>
            <Box className="grid grid-cols-1 gap-4 rounded-md">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Box key={index} className="bg-white shadow-md rounded-lg p-6 relative">
                        <Box className="flex justify-between items-center mb-4">
                            <WaveSkeleton variant="text" width="40%" />
                            <Box>
                                <WaveSkeleton variant="text" width={100} />
                            </Box>
                        </Box>
                        <div className="flex space-x-3 mt-4 mb-2">
                            <WaveSkeleton variant="rectangular" height={50} width={50} className='rounded' />
                            <WaveSkeleton variant="rectangular" height={50} width={50} className='rounded' />
                            <WaveSkeleton variant="rectangular" height={50} width={50} className='rounded' />
                        </div>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export const LoadingDataGrid = () => {
    const rows = Array(10).fill(null);
    const columns = Array(6).fill({ width: [280, 220, 280, 220, 280, 110] });

    return (
        <>
            {/* Actions Header */}
            <div className="bg-white p-4 flex items-center justify-between w-full mb-4 rounded-md">
                <WaveSkeleton variant="text" width="10%" height={25} />
                <WaveSkeleton variant="rectangular" width="6%" height={25} className="rounded-md mr-3" />
            </div>

            <div className="bg-white p-4 rounded-md">
                {/* Table Header */}
                <div className="flex justify-end items-center pb-4 border-b gap-3">
                    {[...Array(4)].map((_, i) => (
                        <WaveSkeleton
                            key={`header-${i}`}
                            variant="rectangular"
                            width={60}
                            height={25}
                            className="rounded-md"
                        />
                    ))}
                </div>

                {/* Table Rows */}
                {rows.map((_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-4 border-b py-3">
                        {columns[0].width.map((width, colIdx) => (
                            <WaveSkeleton
                                key={`row-${rowIdx}-col-${colIdx}`}
                                variant="rectangular"
                                width={width}
                                height={25}
                                className="rounded-md"
                            />
                        ))}
                    </div>
                ))}

                {/* Footer */}
                <div className="flex justify-end items-center mt-1 pt-4 gap-3">
                    <WaveSkeleton variant="rectangular" width={150} height={25} className="rounded" />
                    <WaveSkeleton variant="rectangular" width={50} height={25} className="rounded" />
                    {[...Array(2)].map((_, i) => (
                        <WaveSkeleton
                            key={`footer-${i}`}
                            variant="circular"
                            width={25}
                            height={25}
                            className="rounded"
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export const BlueButton = styled(Button)({
    backgroundColor: '#5C6675',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#4b5563',
    },
    '&.Mui-disabled': {
        backgroundColor: '#E0E0E0',
        color: '#A6A6A6'
    },
});

export const OutlinedBlueButton = styled(Button)({
    color: '#373F49',
    borderColor: '#5c6675',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    '&:hover': {
        borderColor: '#4b5563',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
});

export const BlueTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#5c6675',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#5c6675',
    },
});

export const GoBackHome = () => {
    return (
        <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'none',
                padding: '10px 14px',
                backgroundColor: '#374151',
                '&:hover': {
                    backgroundColor: '#333b47',
                },
                borderRadius: '5px',
                boxShadow: 'none',
                width: '50%',
                margin: '0 auto',
            }}
        >
            <ArrowBack />
            <Typography variant="button" sx={{ color: 'white' }}>
                Go back home
            </Typography>
        </Button>
    );
};

export const ErrorPage = ({ errorType, imageSrc }) => {
    const errorMessages = {
        403: {
            title: "403",
            subtitle: "Page not allowed",
            description: "Sorry, access to this page is not allowed."
        },
        404: {
            title: "404",
            subtitle: "Page not found",
            description: "Sorry, we couldn't find the page you're looking for."
        }
    };

    const { title, subtitle, description } = errorMessages[errorType] || errorMessages[404];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mb-8 flex justify-center">
                    <img src={imageSrc} alt={subtitle} className='w-64 h-64' />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{title}</h1>
                <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{subtitle}</p>
                <p className="mt-2 text-lg text-gray-600">{description}</p>
                <div className="mt-8">
                    <GoBackHome />
                </div>
            </div>
        </div>
    );
};

const DropdownAnimation = ({ isOpen, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
                transition={{ stiffness: 100, damping: 15 }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

export const RoundIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    width: '40px',
    height: '40px',
}));

export const ProfileButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'isDropdownOpen', })(({ theme, isDropdownOpen }) => ({
    color: 'black',
    width: '100px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '6px',
    backgroundColor: isDropdownOpen ? theme.palette.action.hover : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return `${formattedDate} at ${formattedTime}`;
};

export const formatFullDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatPrice = (price) => {
    if (price == null) return '0.00';
    return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const LoginButton = () => {
    const navigate = useNavigate();

    return (
        <>
            <RoundIconButton
                onClick={() => navigate('/login')}
                sx={{ color: '#686159' }}
            >
                <Login />
            </RoundIconButton>
        </>
    )
}

const getEmptyStateMessage = (context, items, searchTerm, statusFilter) => {
    const entity = context === 'flights' ? 'flight booking' : context === 'tours' ? 'tour purchase' : context === 'hotel' ? 'hotel booking' : context = 'rooms' ? 'room booking' : 'flights';

    if (items.length === 0 && searchTerm) return `No ${entity} match your search term!`;

    if (items.length === 0) return `No ${entity} found!`;
    if (searchTerm && statusFilter !== 'All') return `No ${entity} match your search and selected filters.`;
    if (searchTerm) return `No ${entity} match your search term.`;
    if (statusFilter !== 'All') return `No ${entity} match the selected filters.`;
    return `No ${entity} found.`;
};

export const EmptyState = ({
    imageSrc,
    context = 'flights',
    items = [],
    searchTerm = '',
    statusFilter = 'All',
    containerClass = 'p-8',
    imageClass = 'w-60 h-60',
}) => {
    const message = getEmptyStateMessage(context, items, searchTerm, statusFilter);

    return (
        <div className={`flex flex-col items-center justify-center bg-white rounded-sm shadow-sm ${containerClass}`}>
            <img src={imageSrc} alt={message} className={`${imageClass} object-contain mb-4`} />
            <p className="text-base font-semibold mb-2">{message}</p>
        </div>
    );
};

export const calculatePageCount = (items, itemsPerPage) => Math.ceil(items.length / itemsPerPage);

export const handlePageChange = (setPage) => (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
};

export const getPaginatedItems = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
};

export const CustomPagination = ({ count, page, onChange, size = 'large' }) => {
    const paginationEnabled = count > 1;

    if (!paginationEnabled) return null;

    return (
        <Stack spacing={2} sx={{
            marginTop: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Pagination
                count={count}
                page={page}
                onChange={onChange}
                shape="rounded"
                variant="outlined"
                size={size}
                sx={{
                    '& .MuiPaginationItem-page': {
                        color: '#686159',
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#4B5563',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#4B5563',
                            color: 'white',
                        },
                    },
                }}
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{
                            display: item.type === 'previous' && page === 1 ? 'none' : 'inline-flex',
                            ...(item.type === 'next' && page === count ? { display: 'none' } : {}),
                        }}
                    />
                )}
            />
        </Stack>
    );
};

export const ProfileIcon = ({ handleProfileDropdownToggle, isDropdownOpen }) => {
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

    return (
        <Tooltip title="Profile" arrow>
            <div className="flex items-center">
                <ProfileButton
                    onMouseDown={handleProfileDropdownToggle}
                    isDropdownOpen={isDropdownOpen}
                    centerRipple={false}
                >
                    {loading ? (
                        <WaveSkeleton variant="text" width={30} height={30} />
                    ) : (
                        <CustomPerson />
                    )}
                    {loading ? (
                        <WaveSkeleton variant="text" width={80} height={20} className='ml-2' />
                    ) : (
                        user?.firstName && (
                            <span className="text-sm overflow-hidden text-ellipsis ml-2 ">
                                {user.firstName}
                            </span>
                        )
                    )}
                </ProfileButton>
            </div>
        </Tooltip>
    );
};

export const ProfileDropdown = ({ isOpen, isAdmin, handleLogout }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div
            className="absolute right-0 mt-1 w-48 bg-white border shadow-lg rounded-lg p-2"
            tabIndex="0"
        >
            <DropdownAnimation isOpen={isOpen}>
                {isAdmin && (
                    <>
                        <button
                            onClick={() => handleNavigate('/dashboard/users')}
                            className='flex items-center w-full px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100 text-left'
                        >
                            <Dashboard className='mr-2 text-[#5c6675]' />
                            Dashboard
                        </button>
                        <Divider className="!mb-2" />
                    </>
                )}

                <button
                    onClick={() => handleNavigate('/profile/me')}
                    className='flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left'
                >
                    <Person className='mr-2 text-[#5c6675]' />
                    Profile
                </button>

                <button
                    onClick={() => handleNavigate('/profile/flight-purchases')}
                    className='flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left'
                >
                    <AirplaneTicket className='mr-2 text-[#5c6675]' />
                    Flights
                </button>

                <button
                    onClick={() => handleNavigate('/profile/tour-purchases')}
                    className='flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left'
                >
                    <Map className='mr-2 text-[#5c6675]' />
                    Tours
                </button>

                <button
                    onClick={() => handleNavigate('/profile/room-purchases')}
                    className='flex items-center w-full px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100 text-left'
                >
                    <Hotel className='mr-2 text-[#5c6675]' />
                    Rooms
                </button>

                <Divider className="!mb-2" />

                <button
                    onClick={handleLogout}
                    className='flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left'
                >
                    <Logout className='mr-2 text-[#5c6675]' />
                    Log Out
                </button>
            </DropdownAnimation>
        </div>
    );
};
export const CustomPerson = ({ sx }) => <Person sx={{ ...sx, color: '#5c6675' }} />;
export const CustomAirplaneTicket = ({ sx }) => <AirplaneTicket sx={{ ...sx, color: '#5c6675' }} />;
export const CustomMap = ({ sx }) => <Map sx={{ ...sx, color: '#5c6675' }} />;
export const CustomHotel = ({ sx }) => <Hotel sx={{ ...sx, color: '#5c6675' }} />;
export const CustomStar = ({ sx }) => <StarOutlined sx={{ ...sx, color: '#5c6675' }} />;

export const ActiveListItemButton = styled(ListItemButton)(({ selected }) => ({
    backgroundColor: selected ? '#5c6675' : 'white',
    color: selected ? 'black' : 'inherit',
    borderRight: selected ? '4px solid #5c6675' : '',
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: selected ? '#7C7164' : '#F8F8F8',
    },
}));

export const ActiveListItem = ({ icon, primary, handleClick, selected, sx }) => (
    <ActiveListItemButton onClick={handleClick} selected={selected} sx={sx}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
    </ActiveListItemButton>
);

export const SidebarLayout = ({ children }) => {
    return (
        <Box sx={{
            position: { xs: 'static', md: 'absolute' },
            top: { md: '24px' },
            left: { md: '10' },
            width: { xs: '100%', md: '320px' },
            bgcolor: 'white',
            p: { xs: 2, md: 3 },
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            borderRadius: '6px',
            mt: { xs: 10, md: 2 }
        }}>
            {children}
        </Box>
    )
}

export const LoadingInformation = () => {
    return (
        <Box className='space-y-0'>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} />
                </div>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} />
                </div>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} />
                </div>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} className='rounded' />
                </div>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} className='rounded' />
                </div>
            </Box>
            <WaveSkeleton variant="text" width={90} height={40} className='rounded' />
        </Box>
    );
};

export const downloadUserData = (user) => {
    if (!user) return;

    const formatDate = (date) =>
        `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    const createDownloadLink = (data, fileName) => {
        const link = document.createElement('a');
        link.href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const date = formatDate(new Date());
    const fileName = `${user.firstName}_${user.lastName}_PersonalData_${date}.json`;
    const data = JSON.stringify(user, null, 2);

    createDownloadLink(data, fileName);
};

export const CustomBox = (props) => (
    <Box className="bg-white p-3 sm:p-4 rounded-lg w-full focus:outline-none" {...props} />
);

export const CustomTypography = (props) => (
    <Typography className="!text-xl !font-bold !mb-2" {...props} />
);

export const CustomDeleteModal = ({ open, onClose, onDelete, title, message }) => (
    <AnimatePresence>
        <Modal open={open} onClose={onClose} className="flex items-center justify-center outline-none">
            <BounceAnimation>
                <Box
                    className="bg-white p-4 rounded-lg shadow-lg w-full"
                >
                    <Typography variant="h6" className="text-xl font-bold mb-2">
                        {title}
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        {message}
                    </Typography>
                    <div className="flex justify-end mt-4">
                        <OutlinedBlueButton onClick={onClose} variant="outlined" className="!mr-4">
                            Cancel
                        </OutlinedBlueButton>
                        <BlueButton onClick={onDelete} variant="contained" color="error">
                            Delete
                        </BlueButton>
                    </div>
                </Box>
            </BounceAnimation>
        </Modal>
    </AnimatePresence>
);

export const DeleteImageModal = ({ open, onClose, onDelete, imageUrl }) => (
    <AnimatePresence>
        <Modal open={open} onClose={onClose} className="flex items-center justify-center outline-none">
            <BounceAnimation>
                <Box className="bg-white p-4 rounded-lg shadow-lg w-full">
                    <Typography variant="h6" className="text-xl font-bold mb-2">
                        Are you sure you want to delete this image?
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        This action cannot be undone.
                    </Typography>
                    <div className="flex justify-end mt-4">
                        <OutlinedBlueButton onClick={onClose} variant="outlined" className="!mr-4">
                            Cancel
                        </OutlinedBlueButton>
                        <BlueButton onClick={() => onDelete(imageUrl)} variant="contained" color="error">
                            Delete
                        </BlueButton>
                    </div>
                </Box>
            </BounceAnimation>
        </Modal>
    </AnimatePresence>
);

export const ImagePreviewModal = ({ open, onClose, imageUrls }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevious = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
    };

    if (!imageUrls?.length) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="image-preview-modal"
            className="flex items-center justify-center"
        >
            <div
                onClick={onClose}
                className="fixed inset-0 flex items-center justify-center bg-black/70">
                <button
                    onClick={onClose}
                    className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                    <Close className="w-6 h-6 text-white" />
                </button>

                <IconButton onClick={onClose} className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                    <Close />
                </IconButton>

                {imageUrls.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="fixed left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="fixed right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}

                <div className="relative max-w-6xl w-full mx-4 flex flex-col items-center">
                    <div className="w-full flex justify-center">
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`Preview ${currentImageIndex + 1}`}
                            className="max-h-[80vh] w-auto object-contain"
                        />
                    </div>

                    {imageUrls.length > 1 && (
                        <div className="mt-4 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                            {currentImageIndex + 1} / {imageUrls.length}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export const BounceAnimation = forwardRef(({ children }, ref) => (
    <motion.div
        ref={ref}
        initial={{
            y: "100%",
            opacity: 0
        }}
        animate={{
            y: 0,
            opacity: 1
        }}
        exit={{
            y: "100%",
            opacity: 0
        }}
        transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
            mass: 1.2,
            bounce: 0.25
        }}
    >
        {children}
    </motion.div>
));

export const CustomModal = ({ open, onClose, children, ...props }) => (
    <AnimatePresence>
        <Modal
            open={open}
            onClose={onClose}
            {...props}
            className="flex items-center justify-center p-4 sm:p-0"
        >
            <BounceAnimation>
                <Box className="bg-white rounded-lg shadow-lg w-full mx-auto max-w-[95vw] sm:max-w-md focus:outline-none">
                    {children}
                </Box>
            </BounceAnimation>
        </Modal>
    </AnimatePresence>
);

export const Header = ({
    title,
    loading,
    searchTerm,
    setSearchTerm,
    showSearch = false,
    placeholder,
    isUserData = false,
    onDownloadUserData,
}) => {
    return (
        <div className="bg-white p-4 rounded-md shadow-sm mb-3 flex justify-between items-center">
            <Typography variant="h5" className="text-gray-800 font-semilight">
                {loading ? (
                    <WaveSkeleton width={150} />
                ) : (
                    title
                )}
            </Typography>
            <div className="flex items-center space-x-4">
                {showSearch && (
                    <TextField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={placeholder}
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:focus fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                            },
                        }}
                        InputProps={{
                            endAdornment: <Search className="text-gray-400 ml-1" />
                        }}
                    />
                )}
                {isUserData && (
                    <>
                        <BlueButton
                            onClick={onDownloadUserData}
                            startIcon={<Download />}
                        >
                            Download Data
                        </BlueButton>
                    </>
                )}
            </div>
        </div>
    );
};

export const ProfileLayout = ({ children }) => {
    return (
        <Box
            sx={{
                maxWidth: '1250px',
                mx: 'auto',
                px: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { md: 3 },
                position: 'relative',
                mb: 10,
                mt: 5
            }}
        >
            <ProfileSidebar />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    ml: { md: '332px' },
                    width: '100%',
                    mt: { xs: 4, md: 5 },
                }}
            >
                {children}
            </Box>
        </Box >
    );
};

export const AuthActions = ({
    auth,
    isDropdownOpen,
    handleProfileDropdownToggle,
    handleLogout,
    isAdmin
}) => {
    return (
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
                {auth ? (
                    <div className="relative ml-4">
                        <ProfileIcon
                            handleProfileDropdownToggle={handleProfileDropdownToggle}
                            isDropdownOpen={isDropdownOpen}
                            auth={auth}
                        />
                        {isDropdownOpen && (
                            <ProfileDropdown
                                isOpen={isDropdownOpen}
                                isAdmin={isAdmin}
                                handleLogout={handleLogout}
                            />
                        )}
                    </div>
                ) : (
                    <LoginButton />
                )}
            </div>
        </div>
    );
};

const drawerWidth = 250;

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundColor: 'white',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const DashboardAppBar = ({ open, children }) => {
    return (
        <AppBar
            position="absolute"
            open={open}
            sx={{ boxShadow: '1px 0px 3px rgba(0, 0, 0, 0.1)', display: 'flex' }}
        >
            {children}
        </AppBar>
    );
};

export const DashboardToolbar = ({ children }) => {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {children}
        </Toolbar>
    )
}

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    })
);

export const ActionButton = styled(Button)({
    position: 'relative',
    right: '10px',
    width: '30px',
    height: '30px',
    '&:hover': {
        backgroundColor: '#F8F8F8',
    },
});

export const BlueCreateOutlinedIcon = styled(CreateOutlined)({
    color: '#5c6675',
});

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const AddChipButton = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 hover:shadow-md active:scale-95'}`}
        >
            <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
        </button>
    );
};

export const StyledChip = ({ label, onDelete }) => {
    return (
        <div className="inline-flex items-center px-3 py-1 ml-1 mb-2 bg-gray-500 text-white rounded-full shadow-sm transition-colors duration-200">
            <span className="text-sm font-medium">{label}</span>
            <button
                onClick={onDelete}
                className="ml-2 p-1 hover:bg-gray-400 rounded-full transition-colors duration-200"
            >
                <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-3 h-3 text-white"
                >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    );
};

export function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    style={{ fill: '#5C6675' }}
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    style={{ fill: '#5C6675' }}
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    style={{ fill: '#5C6675' }}
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    style={{ fill: '#5C6675' }}
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box className='mt-4 font-bold text-stone-500' style={{ color: '#5C6675' }}>No rows found</Box>
        </StyledGridOverlay>
    );
}

export const CustomToolbar = () => {
    return (
        <>
            <div className="flex justify-end px-4">
                <GridToolbar />
            </div>
            <Divider />
        </>
    );
};

export const CollapsibleListItem = ({ open, handleClick, icon, primary, children }) => (
    <>
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {children}
            </List>
        </Collapse>
    </>
);

export const CollapseIcon = ({ toggleDrawer }) => {
    return (
        <Tooltip title="Collapse" arrow>
            <IconButton onClick={toggleDrawer}>
                <ChevronLeft />
            </IconButton>
        </Tooltip>
    );
}

export const ExtendIcon = ({ toggleDrawer, open }) => {
    return (
        <Tooltip title="Extend" arrow>
            <IconButton
                edge="start"
                color="primary"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{ ...(open && { display: 'none' }) }}
                className='mr-36'
            >
                <MenuOutlined />
            </IconButton>
        </Tooltip>
    )
}

export const DashboardCollapse = ({ toggleDrawer }) => {
    return (
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <CollapseIcon toggleDrawer={toggleDrawer} />
        </Toolbar>
    )
}

export const DashboardNavbar = ({ open, toggleDrawer, auth, isDropdownOpen, handleProfileDropdownToggle, handleLogout, isAdmin }) => {
    const navigate = useNavigate();

    return (
        <DashboardAppBar open={open}>
            <DashboardToolbar>
                <ExtendIcon toggleDrawer={toggleDrawer} open={open} />

                <div className="flex justify-between items-center top-0 left-0 right-0 z-50 mx-auto-xl px-12 w-full">
                    <Tooltip title="Home" arrow>
                        <div onClick={() => navigate('/')} className="cursor-pointer text-black text-2xl">
                            Travel Agency
                        </div>
                    </Tooltip>

                    <AuthActions
                        auth={auth}
                        isDropdownOpen={isDropdownOpen}
                        handleProfileDropdownToggle={handleProfileDropdownToggle}
                        handleLogout={handleLogout}
                        isAdmin={isAdmin}
                    />
                </div>
            </DashboardToolbar>
        </DashboardAppBar>
    )
}

export const StyledGridOverlay = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: '#817369',
    },
    '& .no-rows-secondary': {
        fill: '#A49589',
    },
});

export const pluralize = (word, count) => {
    if (count === 1) return word;
    return word.endsWith('y') ? `${word.slice(0, -1)}ies` : `${word}s`;
};

export const getLocalStorageState = (key, defaultValue) => {
    const savedState = localStorage.getItem(key);
    return savedState !== null ? JSON.parse(savedState) : defaultValue;
};

export const saveLocalStorageState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const DashboardHeader = ({
    title,
    selectedItems = [],
    setAddItemOpen,
    setDeleteItemOpen,
    itemName
}) => {
    const isMultipleSelected = selectedItems.length > 1;
    const itemNamePlural = pluralize(itemName, selectedItems.length);

    const handleScrollToTop = () => {
        const mainContent = document.querySelector('[role="main"]');
        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-white sticky top-16 z-50 p-4 flex items-center justify-between w-full mb-4 rounded-md shadow-sm border-b">
            <Tooltip title="Scroll to top" arrow>
                <Button
                    onClick={handleScrollToTop}
                    sx={{
                        fontSize: '1.3rem',
                        fontWeight: 500,
                        padding: '4px 10px',
                    }}
                >
                    {title}
                </Button>
            </Tooltip>
            <div>
                <OutlinedBlueButton onClick={() => setAddItemOpen(true)} className='!mr-4'>
                    Add {itemName}
                </OutlinedBlueButton>
                {selectedItems.length > 0 && (
                    <OutlinedBlueButton
                        onClick={() => setDeleteItemOpen(true)}
                    >
                        {isMultipleSelected ? `Delete ${itemNamePlural}` : `Delete ${itemName}`}
                    </OutlinedBlueButton>
                )}
            </div>
        </div>
    );
};

export const getCityMap = (city) => {
    const input = city?.toLowerCase() || '';

    const cityMap = {
        // Europe
        'berlin': 'de',
        'paris': 'fr',
        'rome': 'it',
        'madrid': 'es',
        'london': 'gb',
        'amsterdam': 'nl',
        'brussels': 'be',
        'zurich': 'ch',
        'vienna': 'at',
        'warsaw': 'pl',
        'stockholm': 'se',
        'oslo': 'no',
        'copenhagen': 'dk',
        'helsinki': 'fi',
        'lisbon': 'pt',
        'athens': 'gr',
        'dublin': 'ie',
        'moscow': 'ru',
        'saint petersburg': 'ru',
        'moscow city': 'ru',
        'tirana': 'al',
        'doha': 'qa',
        'prishtina': 'xk',
        'istanbul': 'tr',
        'prague': 'cz',
        'budapest': 'hu',
        'sofia': 'bg',
        'belgrade': 'rs',
        'zagreb': 'hr',
        'bratislava': 'sk',
        'ljubljana': 'si',
        'vilnius': 'lt',
        'riga': 'lv',
        'tallinn': 'ee',
        'reykjavik': 'is',
        'luxembourg': 'lu',

        // Middle East
        'dubai': 'ae',
        'abu dhabi': 'ae',
        'tehran': 'ir',
        'riyadh': 'sa',
        'jeddah': 'sa',

        // Asia
        'tokyo': 'jp',
        'seoul': 'kr',
        'beijing': 'cn',
        'shanghai': 'cn',
        'bangkok': 'th',
        'hanoi': 'vn',
        'jakarta': 'id',
        'manila': 'ph',
        'kuala lumpur': 'my',
        'new delhi': 'in',
        'mumbai': 'in',
        'singapore': 'sg',
        'hong kong': 'hk',

        // Americas
        'new york': 'us',
        'los angeles': 'us',
        'chicago': 'us',
        'san francisco': 'us',
        'toronto': 'ca',
        'vancouver': 'ca',
        'mexico city': 'mx',
        'buenos aires': 'ar',
        'sao paulo': 'br',
        'rio de janeiro': 'br',

        // Oceania
        'sydney': 'au',
        'melbourne': 'au',
        'auckland': 'nz',

        // Africa
        'cairo': 'eg',
        'lagos': 'ng',
        'nairobi': 'ke',
        'johannesburg': 'za',
        'cape town': 'za',

        // Default
        'unknown': 'xx',
    };

    return cityMap[input] || 'xx';
};

export const getFlagURL = (city) => `https://flagcdn.com/w80/${getCityMap(city)}.png`;

export const CityFlag = ({ city }) => {
    return (
        <div className="flex flex-col items-center">
            <img
                src={getFlagURL(city)}
                alt={`${city} flag`}
                className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm mt-1">{city}</span>
        </div>
    );
};

export const DashboardCityFlag = ({ city }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={getFlagURL(city)}
                alt={`${city} flag`}
                className="w-8 h-6 mr-2 inline"
                onError={(e) => (e.target.style.display = 'none')}
            />
            {city}
        </div>
    );
};

// Shared styling configuration
const getColumnStyles = () => ({
    alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
    },
    font: {
        bold: false,
        color: { rgb: '2F4F4F' },
        name: 'Arial',
        sz: 11
    }
});

const getHeaderStyles = () => ({
    alignment: {
        horizontal: 'center',
        vertical: 'center'
    },
    font: {
        bold: true,
        color: { rgb: 'FFFFFF' },
        name: 'Arial',
        sz: 12
    },
    fill: {
        fgColor: { rgb: '4F81BD' },
        patternType: 'solid'
    }
});

const formatWorksheet = (worksheet) => {
    // Set column widths
    const cols = worksheet['!cols'] = [];
    const standardWidth = { wch: 18 };
    const dateWidth = { wch: 25 };
    const emailWidth = { wch: 18 };
    const nameWidth = { wch: 18 };

    // Assign specific column widths
    cols[0] = nameWidth;
    cols[1] = emailWidth;
    cols[2] = standardWidth;
    cols[3] = standardWidth;
    cols[4] = dateWidth;
    cols[5] = dateWidth;
    cols[6] = dateWidth;

    // Set row height
    const rows = worksheet['!rows'] = [];
    rows[0] = { hpt: 25 }; // Header row height

    // Apply alternating row colors
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);

            if (!worksheet[cell_ref]) continue;

            // Apply basic cell styling
            worksheet[cell_ref].s = getColumnStyles();

            // Apply header row styling
            if (R === 0) {
                worksheet[cell_ref].s = getHeaderStyles();
            }
            // Apply alternating row colors
            else if (R % 2 === 1) {
                worksheet[cell_ref].s = {
                    ...getColumnStyles(),
                    fill: {
                        fgColor: { rgb: 'F0F8FF' },
                        patternType: 'solid'
                    }
                };
            }
        }
    }

    return worksheet;
};

export const handleExportFlightToExcel = (reportData) => {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const formatDateTime = (date) =>
        new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    const worksheet = XLSX.utils.json_to_sheet(reportData.map(row => ({
        'Flight Name': row.flight.name,
        'User Email': row.user.email,
        'Seats Reserved': row.seatsReserved,
        'Total Price': formatCurrency(row.totalPrice),
        'Purchase Date': formatDate(row.purchaseDate),
        'Start Date': formatDateTime(row.flight.startDate),
        'End Date': formatDateTime(row.flight.endDate),
    })));

    // Apply formatting
    const formattedWorksheet = formatWorksheet(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, formattedWorksheet, 'Flight Report');

    // Add metadata
    workbook.Props = {
        Title: "Flight Booking Report",
        Subject: "Flight Reservations",
        Author: "Travel Booking System",
        CreatedDate: new Date()
    };

    XLSX.writeFile(workbook, `flight_report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const handleExportTourToExcel = (reportData) => {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const formatDateTime = (date) =>
        new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    const worksheet = XLSX.utils.json_to_sheet(reportData.map(row => ({
        'Tour Name': row.tour.name,
        'User Email': row.user.email,
        'Reserved Tickets': row.reservedTickets,
        'Total Price': formatCurrency(row.totalPrice),
        'Purchase Date': formatDate(row.purchaseDate),
        'Start Date': formatDateTime(row.tour.startDate),
        'End Date': formatDateTime(row.tour.endDate),
    })));

    // Apply formatting
    const formattedWorksheet = formatWorksheet(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, formattedWorksheet, 'Tour Report');

    // Add metadata
    workbook.Props = {
        Title: "Tour Booking Report",
        Subject: "Tour Reservations",
        Author: "Travel Booking System",
        CreatedDate: new Date()
    };

    XLSX.writeFile(workbook, `tour_report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const handleExportRoomToExcel = (reportData) => {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const formatDateTime = (date) =>
        new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    const worksheet = XLSX.utils.json_to_sheet(reportData.map(row => ({
        'Room Type': row.room.roomType,
        'User Email': row.user.email,
        'Guests': row.guests,
        'Total Price': formatCurrency(row.totalPrice),
        'Status': row.status,
        'Start Date': formatDateTime(row.startDate),
        'End Date': formatDateTime(row.endDate),
    })));

    // Apply formatting
    const formattedWorksheet = formatWorksheet(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, formattedWorksheet, 'Room Report');

    // Add metadata
    workbook.Props = {
        Title: "Room Booking Report",
        Subject: "Room Reservations",
        Author: "Hotel Booking System",
        CreatedDate: new Date()
    };

    XLSX.writeFile(workbook, `room_report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const knownEmailProviders = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'mail.com',
    'aol.com',
    'zoho.com',
    'protonmail.com',
    'yandex.com',
    'fastmail.com',
    'gmx.com',
    'tutanota.com',
    'hushmail.com',
    'live.com',
    'me.com',
    'msn.com',
    'webmail.com',
    'front.com',
    'rediffmail.com',
    'cogeco.ca',
    'comcast.net',
    'verizon.net',
    'btinternet.com',
    'bellsouth.net',
    'sbcglobal.net',
    'blueyonder.co.uk',
    'charter.net',
    'earthlink.net',
    'optimum.net',
    'xfinity.com',
    'freenet.de',
    'mail.ru',
    'sina.com',
    'qq.com',
    '163.com',
    '126.com',
    'aliyun.com',
    '126.com',
    'example',
    'test',
    'custommail'
];