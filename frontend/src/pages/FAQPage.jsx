import React, { useEffect, useState } from 'react';
import { getFAQs } from '../services/faqService';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <Typography variant="h4" component="h1" gutterBottom>
                Frequently Asked Questions
            </Typography>
            {faqs.map((faq) => (
                <Accordion key={faq._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default FAQPage; 