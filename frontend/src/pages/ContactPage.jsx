import React from 'react';
import ContactForm from '../components/Contact/ContactForm';
import ContactSlider from '../components/Slider/ContactSlider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto py-12 px-4">
                <ContactSlider />
                <ContactForm />
            </div>
            <Footer />
        </>
    );
};

export default ContactPage;