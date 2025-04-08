import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";

interface ProductType {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    minimumOrderQuantity: number;
    availabilityStatus: string;
}

const Container = styled.div`
    padding: 0px;
    font-family: "Trebuchet MS", sans-serif;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

const PageButton = styled.button`
    padding: 10px 15px;
    margin: 0 10px;
    border: none;
    border-radius: 5px;
    background: #007bff;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;

    &:hover {
        background: #0056b3;
        transform: scale(1.05);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const ProductCard = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    transition: background 0.3s;
    
    &:hover {
        background: #f9f9f9;
    }
`;

const Thumbnail = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 5px;
`;

const ProductInfo = styled.div`
    flex: 1;
    color: black;
`;

const PriceContainer = styled.div`
    font-size: 14px;
`;

const OldPrice = styled.span`
    text-decoration: line-through;
    color: #999;
    margin-right: 5px;
`;

const NewPrice = styled.span`
    font-weight: bold;
    color: #e63946;
`;

const RatingStars = styled.div`
    color: #ffcc00;
    font-size: 14px;
`;

const Availability = styled.span<{ status: string }>`
    font-size: 14px;
    font-weight: bold;
    color: ${(props) => (props.status === "In Stock" ? "green" : "red")};
`;

interface ProductListProps {
    onProductClick?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductClick }) => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const productsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://dummyjson.com/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, []);

    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleProductClick = (id: number) => {
        if (window.innerWidth <= 768 && onProductClick) {
            onProductClick(); // hide list on mobile
        }
        navigate(`/product/${id}`);
    };

    if (loading) {
        return (
            <Container>
                {[...Array(10)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={80} style={{ marginBottom: 10 }} />
                ))}
            </Container>
        );
    }

    return (
        <Container>
            {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                    <ProductCard key={product.id} onClick={() => handleProductClick(product.id)}>
                        <Thumbnail src={product.thumbnail || ""} alt={product.title || "No Title"} />
                        <ProductInfo>
                            <strong>{product.title || "No Title"}</strong>
                            <p>{product.category || "Unknown"} | {product.brand || "Unknown"}</p>
                            <p>Price: ${product.price || 0} (Discount: {product.discountPercentage || 0}%)</p>
                            <p>Stock: {product.stock || 0} | Rating: {product.rating || "N/A"}</p>
                        </ProductInfo>
                    </ProductCard>
                ))
            ) : (
                <p>No products available.</p>
            )}

            <Pagination>
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span> Page {page} of {totalPages} </span>
                <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </Pagination>
        </Container>
    );
};

export default ProductList;
