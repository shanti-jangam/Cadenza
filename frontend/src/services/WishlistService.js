class WishlistService {
  static WISHLIST_KEY = 'cadenza_wishlist';

  static getWishlist() {
    try {
      const wishlist = localStorage.getItem(this.WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  }

  static saveWishlist(wishlist) {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
  }

  static addToWishlist(track) {
    try {
      const wishlist = this.getWishlist();
      if (!this.isInWishlist(track.id)) {
        wishlist.push(track);
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }

  static removeFromWishlist(trackId) {
    try {
      const wishlist = this.getWishlist();
      const updatedWishlist = wishlist.filter(track => track.id !== trackId);
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  static isInWishlist(trackId) {
    try {
      const wishlist = this.getWishlist();
      return wishlist.some(track => track.id === trackId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  static clearWishlist() {
    try {
      localStorage.removeItem(this.WISHLIST_KEY);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  }
}

export default WishlistService; 