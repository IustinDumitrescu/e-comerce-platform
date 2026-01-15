const CART_KEY = "cart";

export function getStorageCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setStoredCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}