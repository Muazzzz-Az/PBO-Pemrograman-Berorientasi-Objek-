// src/services/userService.js
const USER_KEY = 'user';
const REGISTERED_USERS_KEY = 'registered_users';

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const getAllUsers = () => {
  const saved = localStorage.getItem(REGISTERED_USERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveAllUsers = (users) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

// ==========================================
// EXPORTED FUNCTIONS
// ==========================================

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Get user by ID
export const getUserById = (userId) => {
  const users = getAllUsers();
  const idNum = parseInt(userId);
  return users.find(u => u.id === idNum);
};

// Get user by username
export const getUserByUsername = (username) => {
  const users = getAllUsers();
  return users.find(u => u.username === username || u.fullName === username);
};

// Get all registered users
export const getAllRegisteredUsers = () => {
  return getAllUsers();
};

// Update user
export const updateUser = (updatedUser) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    saveAllUsers(users);
  }

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === updatedUser.id) {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }

  window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
  window.dispatchEvent(new Event('storage'));

  return updatedUser;
};

// Register new user
export const registerUser = async (userData) => {
  const newUser = {
    id: Date.now(),
    ...userData,
    role: 'user',
    isVerified: false,
    createdAt: new Date().toISOString()
  };

  const existingUsers = getAllUsers();
  saveAllUsers([...existingUsers, newUser]);

  return newUser;
};

// ==========================================
// TAMBAHKAN FUNGSI INI
// ==========================================
export const initializeMissingArtists = () => {
  const users = getAllUsers();
  const commissions = JSON.parse(localStorage.getItem('creartsi_artist_commissions') || '[]');
  let changed = false;

  console.log('Initializing missing artists...');
  console.log('Current users:', users);
  console.log('Commissions found:', commissions.length);

  // Tambahkan artist dari commissions yang belum ada
  commissions.forEach(comm => {
    if (comm.artistName) {
      const exists = users.find(u =>
        u.username === comm.artistName ||
        u.fullName === comm.artistName ||
        u.id === comm.artistId
      );

      if (!exists) {
        users.push({
          id: comm.artistId || Date.now(),
          username: comm.artistName.toLowerCase().replace(/ /g, ''),
          fullName: comm.artistName,
          email: `${comm.artistName.toLowerCase()}@artist.com`,
          role: 'artist',
          isVerified: true,
          bio: comm.description || 'Artist on CreartsI',
          avatarUrl: comm.coverImage || null,
          createdAt: new Date().toISOString()
        });
        changed = true;
        console.log('Added missing artist from commission:', comm.artistName);
      }
    }
  });

  // Pastikan artist dengan username 'miw' dan ID 8 ada
  const miwExists = users.find(u => u.username === 'miw' || u.id === 8);
  if (!miwExists) {
    users.push({
      id: 8,
      username: 'miw',
      fullName: 'miw',
      email: 'miw@artist.com',
      role: 'artist',
      isVerified: true,
      bio: 'Digital artist open for commissions!',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      createdAt: new Date().toISOString()
    });
    changed = true;
    console.log('Added miw artist');
  }

  if (changed) {
    saveAllUsers(users);
    console.log('✅ Artist data initialized!', users);
  } else {
    console.log('No missing artists found.');
  }

  return changed;
};

// Export default untuk kompatibilitas
const userService = {
  getCurrentUser,
  getUserById,
  getUserByUsername,
  getAllRegisteredUsers,
  updateUser,
  registerUser,
  initializeMissingArtists
};

export default userService;