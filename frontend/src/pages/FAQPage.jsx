import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button } from '@mui/material';
import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { FAQItem, GoBackButton } from '../assets/CustomComponents';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ContactSlider from '../components/Slider/ContactSlider';
import { getFAQs } from '../services/faqService';

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [collapseCounter, setCollapseCounter] = useState(0);
    const [expandAll, setExpandAll] = useState(false);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const data = await getFAQs();
                setFaqs(data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFAQs();
    }, []);

    const handleToggleAll = () => {
        setExpandAll(!expandAll);
        setCollapseCounter(prev => prev + 1);
    };

    return (
        <>
            <Navbar />
            <ContactSlider />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-brown-50 mt-4">
                <GoBackButton />
                <div className="bg-white text-bold p-4 rounded-md shadow-sm mb-3 flex justify-between items-center px-2">
                    <h1 className="text-2xl font-bold font-semilight ml-2 text-gray-600">Frequently Asked Questions</h1>
                    <Button
                        onClick={handleToggleAll}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brown-600 hover:text-brown-800 bg-brown-50 hover:bg-brown-100 rounded-md transition-colors duration-200"
                    >
                        <motion.span
                            animate={{ rotate: expandAll ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {expandAll ? <ExpandLess /> : <ExpandMore />}
                        </motion.span>
                        <span className="hidden sm:inline">
                            {expandAll ? 'Collapse All' : 'Expand All'}
                        </span>
                    </Button>
                </div>

                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        shouldCollapse={collapseCounter}
                        expandAll={expandAll}
                    />
                ))}
            </div>

            <div className='mt-20' />
            <Footer />
        </>
    );
};

export default FAQPage;