
async function loadAparatData() {
    try {
        // Mengambil data dari folder data/pemerintahan.json
        const response = await fetch('data/pemerintahan.json');
        if (!response.ok) throw new Error('File data tidak ditemukan');
        
        const data = await response.json();
        
        // Pemetaan ID HTML sesuai dengan struktur grid baru di index.html
        const mapping = {
            'nama-hukum-tua': data.hukum_tua,
            'nama-sekdes': data.sekdes,
            // Bagian Kasie
            'nama-kasie-pem': data.kasie_pemerintahan,
            'nama-kasie-kesra': data.kasie_kesejahteraan,
            'nama-kasie-pelayanan': data.kasie_pelayanan,
            // Bagian Kaur
            'nama-kaur-umum': data.kaur_umum,
            'nama-kaur-rencana': data.kaur_perencanaan,
            'nama-kaur-keu': data.kaur_keuangan,
            // Bagian Jaga
            'nama-jaga-1': data.jaga_1,
            'nama-jaga-2': data.jaga_2,
            'nama-jaga-3': data.jaga_3
        };

        // Memasukkan data ke dalam elemen HTML
        for (const [id, value] of Object.entries(mapping)) {
            const element = document.getElementById(id);
            if (element) {
                if (value && value.toLowerCase() === 'lowong') {
                    element.innerText = 'Dalam Pengisian';
                    element.classList.add('text-gray-400', 'italic', 'font-normal');
                } else {
                    element.innerText = value || '-';
                    // Menghapus class italic jika data tersedia
                    element.classList.remove('text-gray-400', 'italic');
                }
            }
        }
    } catch (error) {
        console.error("Gagal memuat data aparat:", error);
    }
}

// Fungsi untuk Memuat Potensi Desa (Opsional jika file JSON potensi sudah ada)
async function loadPotensiDesa() {
    const container = document.getElementById('potensi-container');
    if (!container) return;

    try {
        const response = await fetch('data/potensi.json');
        const potensiList = await response.json();

        container.innerHTML = ''; 

        potensiList.forEach(item => {
            container.innerHTML += `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">${item.category}</span>
                        <h3 class="text-xl font-bold mt-2">${item.title}</h3>
                        <p class="text-gray-600 mt-2 text-sm">${item.description}</p>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Data potensi desa sedang disiapkan.</p>';
    }
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadAparatData();
    loadPotensiDesa();
});