import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import UserFlightPurchase from "./Flights/UserFlightPurchase";
import Slider from "../components/Slider/ContactSlider";

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-20 w-full">
                <Slider />
                <UserFlightPurchase />
            </div>
            <Footer />
        </>
    );
};

export default Home;