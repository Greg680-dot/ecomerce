import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  compareList: Product[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  addToCompare: (product: Product) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      compareList: [],

      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existing = items.find((item) => item.productId === product.id)

        if (existing) {
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                id: crypto.randomUUID(),
                productId: product.id,
                product,
                quantity,
                price: product.price,
              },
            ],
          })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      addToCompare: (product) => {
        const { compareList } = get()
        if (compareList.length >= 4) return
        if (compareList.some((p) => p.id === product.id)) return
        set({ compareList: [...compareList, product] })
      },

      removeFromCompare: (productId) => {
        set({ compareList: get().compareList.filter((p) => p.id !== productId) })
      },

      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'cart-storage',
    },
  ),
)
