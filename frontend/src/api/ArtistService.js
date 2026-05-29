import UserService from './UserService';

// DATA DUMMY TERPUSAT (Mock Data)
// Desain data ini sudah disesuaikan dengan field yang dibaca oleh komponen UI Nailah.
const DUMMY_ARTISTS = [
    { id: 1, artistName: 'Nailah Art', fullName: 'Nailah', artCategory: '2D Avatars', bio: 'Spesialis pembuat VTuber model dan avatar 2D anime style.', profilePicture: 'https://i.pravatar.cc/150?img=5', followersCount: 1250, rating: 4.9 },
    { id: 2, artistName: 'Arya Visuals', fullName: 'Aryadefa', artCategory: 'Illustrations', bio: 'Illustrator lepas yang fokus pada background scenery dan karakter fantasi epic.', profilePicture: 'https://i.pravatar.cc/150?img=11', followersCount: 840, rating: 4.8 },
    { id: 3, artistName: 'Kucing Terbang', fullName: 'Budi Santoso', artCategory: '3D Models', bio: 'Menerima komisi 3D rigging dan modeling untuk game (Blender/Maya).', profilePicture: 'https://i.pravatar.cc/150?img=14', followersCount: 300, rating: 4.5 },
    { id: 4, artistName: 'Emote Master', fullName: 'Siti Aminah', artCategory: 'Emotes + Badges', bio: 'Bikin Twitch emotes lucu, chibi icon, dan badge discord murah meriah.', profilePicture: 'https://i.pravatar.cc/150?img=33', followersCount: 2100, rating: 5.0 },
    { id: 5, artistName: 'Pixel Boy', fullName: 'Dodi', artCategory: 'Stream Assets', bio: 'Overlay animasi pixel art untuk kebutuhan live streaming YouTube & Twitch.', profilePicture: 'https://i.pravatar.cc/150?img=12', followersCount: 560, rating: 4.7 },
];

export default class ArtistService extends UserService {
    constructor() {
        super();
        this.resourcePath = '/artists'; 
    }

    // OVERRIDE: Menarik semua data dengan Fallback OOP
    async getAll() {
        try {
            const response = await this.client.get(this.resourcePath);
            // Jika backend kosong/belum diisi data, selamatkan dengan data dummy
            if (!response.data || response.data.length === 0) {
                console.warn("Database kosong, menyuntikkan Mock Data dari OOP Layer.");
                return DUMMY_ARTISTS;
            }
            return response.data;
        } catch (error) {
            console.error("Backend terputus, beralih ke Mock Data.");
            return DUMMY_ARTISTS;
        }
    }

    // POLIMORFISME: Tarik berdasarkan kategori
    async getByCategory(category) {
        try {
            const response = await this.client.get(`${this.resourcePath}/category/${encodeURIComponent(category)}`);
            if (!response.data || response.data.length === 0) {
                return DUMMY_ARTISTS.filter(a => a.artCategory === category);
            }
            return response.data;
        } catch (error) {
            return DUMMY_ARTISTS.filter(a => a.artCategory === category);
        }
    }

    // POLIMORFISME: Tarik 1 Artist spesifik untuk Halaman Profil
    async getById(id) {
        try {
            const response = await this.client.get(`${this.resourcePath}/${id}`);
            if (!response.data) throw new Error("Kosong");
            return response.data;
        } catch (error) {
            // Konversi id ke integer untuk pencarian data dummy
            return DUMMY_ARTISTS.find(a => a.id === parseInt(id)) || DUMMY_ARTISTS[0];
        }
    }

    // POLIMORFISME: Menarik galeri karya seni dengan Fallback Data
    async getArtworksByArtist(id) {
        try {
            const response = await this.client.get(`${this.resourcePath}/${id}/artworks`);
            if (!response.data || response.data.length === 0) throw new Error("Kosong");
            return response.data;
        } catch (error) {
            console.warn("Menggunakan Mock Data Artworks.");
            // DUMMY DATA ARTWORKS
            return [
                { id: 101, title: 'Bust Up Anime Style (Full Color)', price: 250000, description: 'Cocok untuk foto profil atau avatar.', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&q=80', likesCount: 120, viewsCount: 450 },
                { id: 102, title: 'Chibi Full Body Emotes', price: 150000, description: 'Paket 3 Emotes untuk Twitch/Discord.', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80', likesCount: 85, viewsCount: 310 },
                { id: 103, title: 'VTuber Model (Ready to Rig)', price: 2000000, description: 'File PSD terpisah layer resolusi tinggi.', imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80', likesCount: 430, viewsCount: 1200 },
            ];
        }
    }
}

export const artistService = new ArtistService();
export const userService = new UserService();