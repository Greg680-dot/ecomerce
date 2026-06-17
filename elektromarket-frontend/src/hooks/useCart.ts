import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '../services/cart'
import { useCartStore } from '../store/cartStore'
import type { Product } from '../types'

export function useCart() {
  const queryClient = useQueryClient()
  const localCart = useCartStore()

  const serverCart = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await cartApi.getCart()
      return data.data
    },
    retry: false,
  })

  const addToCart = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const updateCartItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeFromCart = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const addProductLocally = (product: Product, quantity = 1) => {
    localCart.addItem(product, quantity)
  }

  return {
    items: localCart.items,
    compareList: localCart.compareList,
    itemCount: localCart.getItemCount(),
    subtotal: localCart.getSubtotal(),
    serverCart: serverCart.data,
    isLoading: serverCart.isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    addProductLocally,
    removeItemLocally: localCart.removeItem,
    updateQuantityLocally: localCart.updateQuantity,
    clearCartLocally: localCart.clearCart,
    addToCompare: localCart.addToCompare,
    removeFromCompare: localCart.removeFromCompare,
    clearCompare: localCart.clearCompare,
  }
}
