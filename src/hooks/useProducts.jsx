import { useState } from 'react'
import {keepPreviousData, useQuery} from "@tanstack/react-query"
import  { fetchProducts } from '../services/api'

export function useProducts() {
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)

    const { isPending, isError, error, data, isFetching, isPlaceholderData  } = useQuery({
        queryKey: ['productData', page, searchValue],
        placeholderData: keepPreviousData,
        queryFn: () => fetchProducts(page, searchValue),
    });

    return {
        isFetching,
        isPending,
        isError,
        error,
        setSearchValue,
        setPage,
        page,
        isPlaceholderData,
        products: data?.results || [],
        searchValue,
        hasNextPage: !!data?.next,
    }
}