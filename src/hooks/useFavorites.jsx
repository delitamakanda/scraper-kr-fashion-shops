import { useState } from "react";
import {useQuery, useMutation, useQueryClient, keepPreviousData} from "@tanstack/react-query";
import {LIKE_PRODUCT_KEY } from "../constants.js";
import { fetchFavProducts} from "../services/api.js";

export function useFavorites() {
    const [isProductsIsFavorited, setIsProductsIsFavorited ] = useState(false);

    const queryClient = useQueryClient();

    const toggleFavoriteMutation = useMutation({
        mutationFn: (productId) => {
            const likedProductsStorage = JSON.parse(localStorage.getItem(LIKE_PRODUCT_KEY)) || [];
            const updatedLikedProducts = likedProductsStorage.includes(productId)
                ? likedProductsStorage.filter(id => id !== productId)
                : [...likedProductsStorage, productId];

            localStorage.setItem(LIKE_PRODUCT_KEY, JSON.stringify(updatedLikedProducts));
            return updatedLikedProducts;
        },
        onSuccess: (updatedLikedProducts) => {
            setIsProductsIsFavorited(updatedLikedProducts.length > 0);
            queryClient.invalidateQueries('favProductsData');
        }
    });

    const { data: favProductsData, isSuccess  } = useQuery({
        queryKey: ['favProductsData'],
        queryFn: () => fetchFavProducts(),
        placeholderData: keepPreviousData,
        enabled: isProductsIsFavorited
    });

    const toggleLiked = (productId) => () => {
        toggleFavoriteMutation.mutate(productId);
    }

    const productIsLiked = (productId) => {
        const likedProductsStorage = JSON.parse(localStorage.getItem(LIKE_PRODUCT_KEY)) || [];
        return likedProductsStorage.includes(productId);
    }

    return {
        favProductsData,
        toggleLiked,
        productIsLiked,
        isSuccess,
        isProductsIsFavorited,
    }

}