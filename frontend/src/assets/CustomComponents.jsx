import { ArrowBack } from "@mui/icons-material";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const LoadingOverlay = () => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
        <CircularProgress size={60} style={{ color: '#FFFFFF' }} />
    </div>
);

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