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
        // Ambil list file di folder data/berita melalui API GitHub
        const response = await fetch('https://api.github.com/repos/HizkiaPappang/desa-lindangan/contents/data/berita');
        const files = await response.json();

        container.innerHTML = ''; 

        // Ambil 3 berita terbaru saja
        const newsFiles = files.filter(f => f.name.endsWith('.json')).reverse().slice(0, 3);

        for (const file of newsFiles) {
            const res = await fetch(file.download_url);
            const item = await res.json();
            
            // Format tanggal sederhana
            const date = new Date(item.date).toLocaleDateString('id-ID');

            container.innerHTML += `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-cover">
                    <div class="p-5">
                        <p class="text-red-600 text-[10px] font-bold mb-1">${date}</p>
                        <h3 class="text-lg font-bold text-gray-800 leading-tight mb-2">${item.title}</h3>
                        <p class="text-gray-500 text-xs line-clamp-3 mb-4">${item.body.substring(0, 100)}...</p>
                        <a href="#" class="text-red-700 font-bold text-xs hover:underline italic">Baca Selengkapnya →</a>
                    </div>
                </div>`;
        }
    } catch (e) {
        container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Belum ada berita terbaru.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadAparatData();
    loadPotensiDesa();
    loadBeritaDesa();
});