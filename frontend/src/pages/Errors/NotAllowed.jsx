import React from 'react';
import notAllowed from '../../assets/img/errors/not-allowed.png';
import { ErrorPage } from '../../assets/CustomComponents';

const NotAllowed = () => {
    return (
        <>
            <ErrorPage
                errorType={403}
                imageSrc={notAllowed}
            />
        </>
    );
};

export default NotAllowed;