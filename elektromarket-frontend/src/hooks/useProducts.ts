import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/products'
import type { ProductFilters } from '../types'
import { DEFAULT_PAGE_SIZE } from '../utils/constants'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await productsApi.getProducts({
        pageSize: DEFAULT_PAGE_SIZE,
        ...filters,
      })
      return data
    },
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await productsApi.getProduct(slug)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await productsApi.getFeatured()
      return data.data
    },
  })
}

export function useNewArrivals(limit = 12) {
  return useQuery({
    queryKey: ['products', 'new', limit],
    queryFn: async () => {
      const { data } = await productsApi.getNewArrivals(limit)
      return data.data
    },
  })
}

export function useOnSaleProducts(limit = 12) {
  return useQuery({
    queryKey: ['products', 'sale', limit],
    queryFn: async () => {
      const { data } = await productsApi.getOnSale(limit)
      return data.data
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await productsApi.getCategories()
      return data.data
    },
  })
}

export function useProductSearch(query: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: async () => {
      const { data } = await productsApi.search(query, filters)
      return data
    },
    enabled: query.length >= 2,
  })
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await productsApi.getBrands()
      return data.data
    },
  })
}
