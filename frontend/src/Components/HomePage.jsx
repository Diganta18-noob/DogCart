import React from 'react';
import { useSelector } from 'react-redux';
import { selectRole, selectUser } from '../userSlice';
import pawmartCover from '../assets/images/pawmartcover.png';
import './HomePage.css';

const HomePage = () => {
    const role = useSelector(selectRole);
    const user = useSelector(selectUser);

    return (
        <div className="home-container">
            <div className="home-cover" style={{ backgroundImage: `url(${pawmartCover})` }}>
                <div className="cover-overlay">
                    <h1 className="cover-title">PawMart</h1>
                </div>
            </div>

            <div className="home-content">
                <p className="welcome-text">
                    Welcome to <strong>PawMart</strong>, your one-stop destination for premium pet products and accessories.
                    Explore a wide range of pet food, toys, grooming supplies, and more. Whether you're a pet parent or a
                    pet enthusiast, find everything you need for your furry companions. Start shopping today and make your pet's life happier!
                </p>

                <div className="contact-section">
                    <h2 className="contact-title">Contact Us</h2>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-label">Phone:</span>
                            <span className="contact-value">+91 98765 43210</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Email:</span>
                            <span className="contact-value">support@pawmart.com</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Address:</span>
                            <span className="contact-value">123 Paw Street, Pet City, IN</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
