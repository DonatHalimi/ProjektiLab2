import React from 'react';
import ContactForm from '../components/Contact/ContactForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ContactSlider from '../components/Slider/ContactSlider';

const ContactPage = () => {
    return (
        <>
            <Navbar />
            <ContactSlider />
            <ContactForm />
            <Footer />
        </>
    );
};

export default ContactPage;