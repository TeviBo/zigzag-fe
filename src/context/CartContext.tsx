import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  emoji?: string;
};

export type Coupon = {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
  coupon: Coupon | null;
  setCoupon: (coupon: Coupon | null) => void;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discountAmount = cartTotal * (coupon.discount_value / 100);
    } else {
      discountAmount = coupon.discount_value;
    }
  }
  
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        clearCart,
        coupon,
        setCoupon,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
