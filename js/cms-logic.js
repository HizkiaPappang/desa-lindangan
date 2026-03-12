// 1. Fungsi Memuat Data Aparat
async function loadAparatData() {
    try {
        const response = await fetch('data/pemerintahan.json');
        const data = await response.json();
        const mapping = {
            'nama-hukum-tua': data.hukum_tua,
            'nama-sekdes': data.sekdes,
            'nama-kasie-pem': data.kasie_pemerintahan,
            'nama-kasie-kesra': data.kasie_kesejahteraan,
            'nama-kasie-pelayanan': data.kasie_pelayanan,
            'nama-kaur-umum': data.kaur_umum,
            'nama-kaur-rencana': data.kaur_perencanaan,
            'nama-kaur-keu': data.kaur_keuangan,
            'nama-jaga-1': data.jaga_1,
            'nama-jaga-2': data.jaga_2,
            'nama-jaga-3': data.jaga_3
        };
        for (const [id, value] of Object.entries(mapping)) {
            const el = document.getElementById(id);
            if (el) el.innerText = value || '-';
        }
    } catch (e) { console.error("Gagal muat aparat"); }
}

// 2. Fungsi Memuat Potensi (Metode File Tunggal)
async function loadPotensiDesa() {
    const container = document.getElementById('potensi-container');
    if (!container) return;
    try {
        const response = await fetch('data/potensi.json');
        const data = await response.json();
        // Karena kita pakai widget 'list', datanya ada di dalam array 'potensi'
        const list = data.potensi || [];
        container.innerHTML = ''; 
        list.forEach(item => {
            container.innerHTML += `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">${item.category}</span>
                        <h3 class="text-xl font-bold mt-2 text-gray-800">${item.title}</h3>
                        <p class="text-gray-600 mt-2 text-sm">${item.description}</p>
                    </div>
                </div>`;
        });
    } catch (e) { container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Tambahkan potensi desa melalui panel admin.</p>'; }
}

async function loadBeritaDesa() {
    const container = document.getElementById('berita-container');
    if (!container) return;

    try {
        // PERHATIKAN: Ganti 'HizkiaPappang' dengan username GitHub Anda jika berbeda
        const response = await fetch('https://api.github.com/repos/HizkiaPappang/desa-lindangan/contents/data/berita');
        
        if (!response.ok) {
            throw new Error("Folder berita belum ada atau kosong");
        }

        const files = await response.json();
        
        // Filter file .json dan ambil yang terbaru (berdasarkan nama file/tanggal)
        const newsFiles = files.filter(f => f.name.endsWith('.json')).reverse().slice(0, 3);
        
        if (newsFiles.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Belum ada berita yang dipublikasikan.</p>';
            return;
        }

        container.innerHTML = ''; 

        for (const file of newsFiles) {
            // Gunakan cache-buster agar data selalu baru
            const res = await fetch(file.download_url + '?t=' + new Date().getTime());
            const item = await res.json();
            
            // Format tanggal (misal: 12/03/2026)
            const dateStr = item.date ? new Date(item.date).toLocaleDateString('id-ID') : 'Baru saja';

            container.innerHTML += `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                    <img src="${item.image || 'assets/img/hero-desa.jpg'}" class="w-full h-40 object-cover" onerror="this.src='assets/img/hero-desa.jpg'">
                    <div class="p-5 flex flex-col flex-grow">
                        <p class="text-red-600 text-[10px] font-bold mb-1 uppercase tracking-wider">${dateStr}</p>
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.title}</h3>
                        <p class="text-gray-500 text-xs overflow-hidden mb-4" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                            ${item.body ? item.body.replace(/[#*]/g, '') : ''}
                        </p>
                        <div class="mt-auto">
                            <span class="text-red-700 font-bold text-xs italic cursor-pointer hover:underline">Baca Selengkapnya →</span>
                        </div>
                    </div>
                </div>`;
        }
    } catch (e) {
        console.error("Error Berita:", e);
        container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Berita sedang disiapkan...</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadAparatData();
    loadPotensiDesa();
    loadBeritaDesa();
});