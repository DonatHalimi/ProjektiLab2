import { ArrowBack, ArrowForward } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';

const ContactSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dragStart, setDragStart] = useState(null);
    const sliderRef = useRef(null);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'Get in Touch',
            description: 'We\'re here to help and answer any question you might have'
        },
        {
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'Customer Support',
            description: '24/7 dedicated support for all your travel needs'
        },
        {
            image: "https://images.unsplash.com/photo-1502920514313-52581002a659?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'Let\'s Connect',
            description: 'Your journey begins with a simple message'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleDragStart = (e) => {
        setDragStart(e.clientX || e.touches[0].clientX);
    };

    const handleDragEnd = (e) => {
        if (!dragStart) return;
        const dragEnd = e.clientX || e.changedTouches[0].clientX;
        if (dragStart - dragEnd > 50) {
            nextSlide();
        } else if (dragEnd - dragStart > 50) {
            prevSlide();
        }
        setDragStart(null);
    };

    return (
        <div
            ref={sliderRef}
            onMouseDown={handleDragStart}
            onMouseMove={(e) => e.preventDefault()}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={handleDragEnd}
            className="relative h-[580px] overflow-hidden rounded-md shadow-md mb-8"
        >
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'}`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
                        <h2 className="text-4xl font-bold mb-4 select-none">{slide.title}</h2>
                        <p className="text-xl text-center select-none">{slide.description}</p>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
            >
                <ArrowBack />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
            >
                <ArrowForward />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContactSlider;