import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';

const App: React.FC = () => {
    const [isProductListVisible, setProductListVisible] = useState(true);

    const toggleProductList = () => {
        setProductListVisible(!isProductListVisible);
    };

    return (
        <Router>
            <div style={{ display: 'flex', height: '100vh' }}>
                {/* Left side: Product details (or placeholder) */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Routes>
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route
                            path="*"
                            element={<div style={{ padding: '20px', fontFamily: 'Trebuchet MS' }}>Please select a product from the list.</div>}
                        />
                    </Routes>
                </div>

                {/* Right side: Product list (Toggleable) */}
                <div
                    style={{
                        width: '300px',
                        borderLeft: '1px solid #ccc',
                        overflowY: 'auto',
                        padding: '20px',
                        display: isProductListVisible ? 'block' : 'none',
                    }}
                >
                    <ProductList />
                </div>
            </div>

            {/* Toggle Button */}
            {window.innerWidth <= 768 &&
                <button
                    onClick={toggleProductList}
                    style={{
                        position: 'fixed',
                        top: '5px',
                        right: '20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                >
                    {isProductListVisible ? 'Hide' : 'Show'} Product List
                </button>
            }
        </Router>
    );
};

export default App;

