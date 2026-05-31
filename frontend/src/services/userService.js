
const USER_KEY = 'user';
const REGISTERED_USERS_KEY = 'registered_users';

export const userService = {
    // Get current logged in user
    getCurrentUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Update current user
    updateCurrentUser: (updatedUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
        return updatedUser;
    },

    // Check if user is verified artist
    isVerifiedArtist: () => {
        const user = userService.getCurrentUser();
        return user?.isVerified === true || user?.role === 'artist';
    },

    // Check if user is regular user
    isRegularUser: () => {
        const user = userService.getCurrentUser();
        return user && !user.isVerified && user?.role !== 'artist';
    },

    // Register new user
    registerUser: async (userData) => {
        // Simulasi API call
        const newUser = {
            id: Date.now(),
            ...userData,
            role: 'user',
            isVerified: false,
            createdAt: new Date().toISOString()
        };

        const existingUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...existingUsers, newUser]));

        return newUser;
    }
};