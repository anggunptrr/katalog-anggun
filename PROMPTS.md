# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt: Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**Hasil: Koneksi Supabase berhasil dibuat di lib/supabase/server.js menggunakan @supabase/supabase-js. Halaman utama app/page.jsx diubah menjadi Server Component yang melakukan fetch data langsung dari tabel "produk". Komponen KartuProduk berhasil me-render data produk secara dinamis, teks "Belum ada produk" muncul saat tabel kosong, dan pesan error ditangani dalam blok try-catch. CatatanBelumAktif berhasil dihapus.**

**Perbaikan: Awalnya data tidak muncul karena variabel lingkungan di .env.local belum terbaca dengan benar di sisi server. Memperbaiki masalah ini dengan melakukan restart ulang pada server local Next.js (npm run dev) agar file konfigurasi environment terbaru dimuat secara sempurna.**

## US-02 Detail produk

**Prompt: Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.**

**Hasil: Halaman detail produk app/produk/[id]/page.jsx berhasil mengambil data berdasarkan parameter id. Jika ID produk tidak valid atau tidak ditemukan di tabel Supabase, fungsi notFound() dari next/navigation dipanggil dan mengarahkan pengguna ke halaman 404. Komponen tombol WhatsApp tetap dipertahankan dan CatatanBelumAktif telah dibersihkan.**

**Perbaikan: Mengoreksi tipe data parameter id saat melakukan query .eq('id', id). Karena data ID dari params bertipe string, sementara di database bertipe integer/uuid, dilakukan konversi tipe data yang sesuai agar pencarian Supabase tidak menghasilkan error mis-match tipe data.**

## US-03 Pesan via WhatsApp

**Prompt: Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.**

**Hasil: Komponen components/TombolWhatsApp.jsx berhasil dimodifikasi menggunakan tag <a> dengan atribut target="_blank" dan rel="noopener noreferrer". Tautan mengarah ke format URL WhatsApp yang dinamis. Teks pesan otomatis memuat nama produk serta nominal harga yang diformat ke Rupiah (IDR). Penggunaan encodeURIComponent memastikan spasi dan karakter khusus aman dalam URL parameter.**

**Perbaikan: Memperbaiki format nomor WhatsApp pada file lib/toko.js agar tidak menggunakan tanda plus + atau angka 0 di depan, melainkan langsung menggunakan kode negara (misal: 628xxx) karena format tautan wa.me mensyaratkan nomor bersih tanpa karakter non-numerik.**

## US-04 Login admin

**Prompt: Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.**

**Hasil: Autentikasi admin berbasis cookie menggunakan @supabase/ssr berhasil diterapkan. Fungsi login via Server Action di app/admin/actions.js memproses kredensial dan mengatur cookie sesi secara aman. Form login mengonsumsi state error untuk menampilkan pesan interaktif jika password/email salah. Tombol logout di components/NavAdmin.jsx juga berhasil memanggil fungsi signOut() dan mengembalikan admin ke /admin/login.**

**Perbaikan: Memperbaiki masalah Client Component yang tidak bisa mengeksekusi Server Action secara langsung tanpa transisi. Menggunakan hook useActionState atau startTransition di form login client-side untuk menangani status loading dan penayangan pesan error tanpa me-refresh halaman.**

## US-05 Ganti password

**Prompt:Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.**

**Hasil: Fungsi Server Action baru untuk ganti password berhasil dibuat dengan validasi lapis pertama di sisi server. Memeriksa kecocokan antara password baru dan konfirmasi password, serta memastikan panjang karakter >= 8. Pesan sukses/gagal dioperasikan kembali ke halaman form app/admin/password/page.jsx agar user mendapatkan feedback visual yang jelas.**

**Perbaikan: Menambahkan penanganan jika sesi admin kedaluwarsa secara tiba-tiba di tengah proses. Ditambahkan pengecekan supabase.auth.getUser() terlebih dahulu di dalam Server Action sebelum memanggil updateUser() untuk menghindari kebocoran eksekusi oleh user tak dikenal.**

## US-06 Proteksi halaman admin

**Prompt: Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.**

**Hasil: File middleware.js dikonfigurasi di root proyek untuk memproteksi seluruh sub-rute /admin/* menggunakan pencocokan matcher, terkecuali rute /admin/login. Admin yang belum terautentikasi otomatis di-redirect kembali ke halaman login. Proteksi ganda juga disematkan di setiap Server Action terkait data (tambah/edit/hapus) dengan memvalidasi ulang token session server sebelum mengeksekusi aksi database.**

**Perbaikan: Menyelaraskan library pembuatan client Supabase di dalam middleware. Menggunakan utilitas createServerClient dari @supabase/ssr khusus untuk middleware agar proses pembacaan dan penulisan ulang (request/response cookies) berjalan mulus tanpa memicu siklus pemanggilan tanpa akhir (infinite redirect loop).**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
