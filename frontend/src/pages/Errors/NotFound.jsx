import React from 'react';
import notFound from '../../assets/img/errors/not-found.png';
import { ErrorPage } from '../../assets/CustomComponents';

const NotFound = () => {
    return (
        <>
            <ErrorPage
                errorType={404}
                imageSrc={notFound}
            />
        </>
    );
};

export default NotFound;