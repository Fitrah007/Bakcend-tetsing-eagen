# Library API

## Deskripsi

Library API adalah aplikasi backend untuk mengelola sistem perpustakaan. Aplikasi ini memungkinkan Anda untuk mengelola buku, anggota, dan peminjaman buku. Dapat digunakan untuk menampilkan daftar buku yang tersedia, detail buku, serta mengelola peminjaman dan pengembalian buku.

## Fitur

- **Menampilkan Semua Buku**: Menampilkan daftar buku yang tersedia di perpustakaan.
- **Menampilkan Detail Buku**: Menampilkan detail buku berdasarkan kode buku.
- **Menampilkan Anggota dan Buku yang Dipinjam**: Menampilkan daftar anggota serta buku yang mereka pinjam.
- **Meminjam Buku**: Memungkinkan anggota untuk meminjam buku jika memenuhi syarat.
- **Mengembalikan Buku**: Memungkinkan anggota untuk mengembalikan buku dan menangani penalti jika melebihi batas waktu.

## Teknologi yang Digunakan

- **Node.js**: Untuk server-side JavaScript.
- **Express.js**: Framework web untuk Node.js.
- **Sequelize**: ORM untuk database.
- **YAML**: Untuk dokumentasi API menggunakan Swagger.
- **Swagger**: Untuk dokumentasi dan pengujian API.

## Instalasi

1. **Clone Repository**

   ```bash
   git clone https://github.com/Fitrah007/Bakcend-tetsing-eagen.git

2. **instal npm**
    ```bash
    npm install

3. **Buat file .env**
    Buat file .env dan sesuaikan dengan file .env.example

4. **Aktifkan database**
    ```bash
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all

5. **jalankan aplikasi**
    ```bash
    npm run dev