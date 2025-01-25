import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider/ContactSlider";
import UserFlightPurchase from "./Flights/UserFlightPurchase";

const Home = () => {
    return (
        <>
            <Navbar />
            <Slider />
            <div className="container mx-auto px-20 w-full">
                <UserFlightPurchase />
            </div>
            <Footer />
        </>
    );
};

export default Home;