import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";


interface ReviewType {
    reviewerName: string;
    date: string;
    rating: number;
    comment: string;
}

interface ProductType {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    availabilityStatus: string;
    minimumOrderQuantity: number;
    returnPolicy: string;
    shippingInformation: string;
    sku: string;
    weight: number;
    warrantyInformation: string;
    dimensions: { width: number; height: number; depth: number };
    reviews?: ReviewType[];
}

const ProductDetailsContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: auto;
    font-family: "Trebuchet MS", sans-serif;
`;

const ProductImage = styled.img`
    width: 100%;
    max-width: 350px;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const PriceContainer = styled.div`
    font-size: 18px;
    margin: 10px 0;
`;

const OldPrice = styled.span`
    text-decoration: line-through;
    color: #999;
    margin-right: 10px;
`;

const NewPrice = styled.span`
    font-weight: bold;
    color: #e63946;
`;

const RatingStars = styled.div`
    color: #ffcc00;
    font-size: 18px;
`;

const Availability = styled.span<{ status: string }>`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => (props.status === "In Stock" ? "green" : "red")};
`;

const ProductInfo = styled.div`
    margin: 20px 0;
`;

const ReviewCard = styled.div`
    border-bottom: 1px solid #ccc;
    padding: 10px;
    background: #f8f9fa;
    margin-top: 10px;
`;

const ReviewDate = styled.span`
    font-size: 14px;
    color: #777;
    margin-left: 10px;
`;

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
};

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`https://dummyjson.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <ProductDetailsContainer>
                <CircularProgress />
            </ProductDetailsContainer>
        );
    }

    if (!product) {
        return (
            <ProductDetailsContainer>
                <p>Product not found.</p>
            </ProductDetailsContainer>
        );
    }

    const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

    return (
        <ProductDetailsContainer>
            <h2>{product.title}</h2>
            <ProductImage src={product.thumbnail || ""} alt={product.title || "No Title"} />
            <p>{product.description || "No description available."}</p>

            <ProductInfo>
                <p>
                    <strong>Brand:</strong> {product.brand || "Unknown"} | <strong>Category:</strong> {product.category || "Unknown"}
                </p>
                <PriceContainer>
                    <OldPrice>${product.price.toFixed(2)}</OldPrice>
                    <NewPrice>${discountedPrice}</NewPrice>
                </PriceContainer>
                <p>
                    <strong>Stock:</strong> {product.stock || 0} | <strong>Rating:</strong>
                    <RatingStars>
                        {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
                    </RatingStars>
                </p>
                <Availability status={product.availabilityStatus}>
                    {product.availabilityStatus}
                </Availability>
                <p><strong>Minimum Order Quantity:</strong> {product.minimumOrderQuantity}</p>
                <p><strong>Weight:</strong> {product.weight} kg</p>
                <p><strong>Dimensions:</strong> {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} inches</p>
                <p><strong>Shipping Information:</strong> {product.shippingInformation}</p>
                <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
                <p><strong>Warranty Information:</strong> {product.warrantyInformation}</p>
                <p><strong>SKU:</strong> {product.sku}</p>
            </ProductInfo>

            <h3>Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                    <ReviewCard key={index}>
                        <strong>{review.reviewerName}</strong>
                        <RatingStars>
                            {"★".repeat(Math.floor(review.rating))}{"☆".repeat(5 - Math.floor(review.rating))}
                        </RatingStars>
                        <p>{review.comment}</p>
                        <ReviewDate>{formatDate(review.date)}</ReviewDate>
                    </ReviewCard>
                ))
            ) : (
                <p>No reviews available.</p>
            )}
        </ProductDetailsContainer>
    );
};

export default ProductDetails;


