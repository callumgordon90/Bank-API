import React from 'react';
import { Link } from 'react-router-dom';

// the Header component displays a header on the frontend for the logged in user

const Header = () => {
    return (
        <header>
            <h1>The Bank of Aiudo</h1>
            <div className="links">
                <Link to="/account" className="link">
                    Account
                </Link>
                <Link to="/profile" className="link">
                    Profile
                </Link>
                <Link to="/logout" className="link">
                    Logout
                </Link>
            </div>
        </header>
    );
};

export default Header;