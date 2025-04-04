import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Skeleton } from "@mui/material";

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

const ProductList = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const productsPerPage = 10;

    useEffect(() => {
        fetch("https://dummyjson.com/products")
            .then((res) => res.json())
            .then((data) => {
                const updatedProducts = data.products.map((product: ProductType) => ({
                    ...product,
                    minimumOrderQuantity: Math.floor(Math.random() * 5) + 1,
                    availabilityStatus: product.stock > 0 ? "In Stock" : "Out of Stock"
                }));

                setProducts(updatedProducts);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container>
                {[...Array(10)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={80} style={{ marginBottom: 10 }} />
                ))}
            </Container>
        );
    }

    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <Container>
            {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                    const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
                    return (
                        <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                            <ProductCard>
                                <Thumbnail src={product.thumbnail || ""} alt={product.title || "No Title"} />
                                <ProductInfo>
                                    <strong>{product.title || "No Title"}</strong>
                                    <p>{product.category} | {product.brand}</p>
                                    <PriceContainer>
                                        <OldPrice>${product.price.toFixed(2)}</OldPrice>
                                        <NewPrice>${discountedPrice}</NewPrice>
                                    </PriceContainer>
                                    <p>Min Order: {product.minimumOrderQuantity}</p>
                                    <p>Stock: {product.stock}</p>
                                    <Availability status={product.availabilityStatus}>{product.availabilityStatus}</Availability>
                                    <RatingStars>{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</RatingStars>
                                </ProductInfo>
                            </ProductCard>
                        </Link>
                    );
                })
            ) : (
                <p>No products available.</p>
            )}

            <Pagination>
                <PageButton disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</PageButton>
                <span> Page {page} </span>
                <PageButton disabled={indexOfLastProduct >= products.length} onClick={() => setPage(page + 1)}>Next →</PageButton>
            </Pagination>
        </Container>
    );
};

export default ProductList;

