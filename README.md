# PBO-Pemrograman-Berorientasi-Objek-

# 🎨 Creartsl - Creative Arts Marketplace Indonesia

**Creartsl** adalah platform marketplace seni digital khusus untuk pasar Indonesia yang menghubungkan **Client** dengan **Artist** melalui sistem manajemen komisi yang aman dan terorganisir. Platform ini dirancang untuk mempermudah ekosistem kreatif lokal dalam bertransaksi seni digital.

## ✨ Fitur Utama
* **Discovery Artist:** Cari artist favorit berdasarkan kategori dan gaya seni.
* **Discovery Commission & Digital Product:** Cari jasa komisi dan produk digital sesuai kebutuhan.
* **Commission Tracking:** Pantau status progres karya dari awal pemesanan hingga selesai.
* **Personalized Portfolio:** Artist dapat menampilkan galeri karya terbaik mereka.
* **Real-Time Chat:** Komunikasi langsung antara client dan artist untuk diskusi detail komisi.

## 🛠️ Tech Stack
Proyek ini dibangun menggunakan arsitektur **Client-Server** dengan pembagian sebagai berikut:
* **Backend:** Java Spring Boot, Spring Security (Auth), H2 Database.
* **Frontend:** React.js, Material UI (MUI), Socket.io-client.
* **Real-Time Engine:** Socket.io (Java Server implementation).

## 🚀 Cara Menjalankan Proyek (Local Setup)
Ikuti langkah-langkah berikut untuk menjalankan Creartsl di komputer lokal Anda:
### 1. Persyaratan Sistem
Pastikan Anda sudah menginstal:
* Java JDK 17 atau versi terbaru.
* Node.js (versi 16 atau terbaru).
* Maven.

### 2. Kloning Repositori
[https://github.com/Muazzzz-Az/PBO-Pemrograman-Berorientasi-Objek-.git](https://github.com/Muazzzz-Az/PBO-Pemrograman-Berorientasi-Objek-.git)

### 3. Menjalankan Backend (Spring Boot)
1. Buka folder backend di IntelliJ IDEA atau terminal.
2. Tunggu Maven mengunduh dependensi.
3. Jalankan class PBOApplication.java.
4. Backend akan berjalan di: http://localhost:8080

### 4. Menjalankan Frontend (React)
1. Buka terminal baru dan masuk ke folder frontend seperti berikut:
  * cd frontend
  * npm install
  * npm start
2. Aplikasi akan terbuka secara otomatis di: http://localhost:3000


---


### 📖 Cara Penggunaan (User Guide)

#### **Sebagai Client:**
* **Register/Login:** Buat akun terlebih dahulu untuk dapat mengakses seluruh fitur pemesanan.
* **Browse:** Telusuri katalog komisi yang tersedia di halaman utama sesuai dengan gaya seni yang kamu cari.
* **Chat:** Klik tombol **Chat** pada profil artist untuk mendiskusikan konsep, referensi, dan detail teknis lainnya secara langsung (wajib req dan diapprove oleh artist untuk mengakses chat).
* **Order:** Lakukan pemesanan jasa komisi pada section *Commission Services* ataupun produk digital pada section *Shop*.
* **My Purchase:** Pantau pesanan jasa komisi, produk digital, dan semua transaksi yang sedang berjalan dan selesai.
* **Cart:** Pesanan akan masuk ke cart sebagai wishlist.

#### **Sebagai Artist:**
* **Switch to Artist:** Aktifkan mode artist melalui pengaturan profil untuk mulai membuka jasa komisi.
* **Post Portfolio:** Pada *Creator Dashboard* Unggah karya-karya terbaik sebagai portfolio yang nantinya bisa dilihat oleh client.
* **Post Commission:** Pada *Creator Dashboard* Buat layanan komisi baru dengan mengunggah contoh karya terbaik, ToS, harga, dan deskripsi jasa.
* **Post Digital Product:** Pada *Creator Dashboard* Unggah produk digital dengan memasukkan harga, kategori, stok, dan deskripsi produk.
* **My Commission:** Sistem tracking yang membuat daftar komisi yang masuk, sedang dikerjakan, dan telah selesai.
* **Manage Chat:** Pantau dan balas pesan masuk dari calon pembeli secara *real-time* melalui menu **Messages** untuk mempermudah komunikasi.


---

### 👥 Tim
Proyek ini dikembangkan sebagai tugas akhir semester mata kuliah **Pemrograman Berorientasi Objek (PBO)**.

1. **Muaz Alfattah Fadhani** 
2. **Nailah Salmah** 
3. **Nabila Syahri** 
4. **Muhammad Aryadefa** 

---

<p align="center">
  <b>© 2026 Creartsl Team</b><br>
  <i>Connecting Creativity, One Commission at a Time.</i>
</p>
