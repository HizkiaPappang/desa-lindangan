// 1. Fungsi Memuat Data Aparat
async function loadAparatData() {
    try {
        const response = await fetch('data/pemerintahan.json?t=' + new Date().getTime());
        if(!response.ok) return;
        const data = await response.json();
        const mapping = {
            'nama-hukum-tua': data.hukum_tua, 'nama-sekdes': data.sekdes,
            'nama-kasie-pem': data.kasie_pemerintahan, 'nama-kasie-kesra': data.kasie_kesejahteraan,
            'nama-kasie-pelayanan': data.kasie_pelayanan, 'nama-kaur-umum': data.kaur_umum,
            'nama-kaur-rencana': data.kaur_perencanaan, 'nama-kaur-keu': data.kaur_keuangan,
            'nama-jaga-1': data.jaga_1, 'nama-jaga-2': data.jaga_2, 'nama-jaga-3': data.jaga_3
        };
        for (const [id, value] of Object.entries(mapping)) {
            const el = document.getElementById(id);
            if (el) el.innerText = value || '-';
        }
    } catch (e) { console.error("Aparat Error"); }
}

// 2. Fungsi Memuat Potensi (TEKS DIPOTONG AGAR RAPI)
async function loadPotensiDesa() {
    const container = document.getElementById('potensi-container');
    if (!container) return;
    try {
        const response = await fetch('data/potensi.json?t=' + new Date().getTime());
        const data = await response.json();
        const list = data.potensi || [];
        container.innerHTML = ''; 
        list.forEach(item => {
            // Kita gunakan fungsi popup yang sama dengan berita agar konsisten
            container.innerHTML += `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
                    <img src="${item.image}" class="w-full h-48 object-cover">
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded w-fit">${item.category}</span>
                        <h3 class="text-xl font-bold mt-2 text-gray-800">${item.title}</h3>
                        <p class="text-gray-600 mt-2 text-sm leading-relaxed overflow-hidden mb-4" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                            ${item.description}
                        </p>
                        <div class="mt-auto pt-2">
                            <button onclick="showDetailPotensi('${item.title.replace(/'/g, "\\'")}', '${item.image}', '${item.description.replace(/\n/g, '<br>').replace(/'/g, "\\'")}', '${item.category}')" 
                                    class="text-red-700 font-bold text-xs uppercase tracking-tighter hover:underline">
                                Lihat Detail Potensi ↓
                            </button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (e) { console.error("Potensi Error"); }
}

// Tambahkan fungsi pembantu untuk Modal Potensi (Letakkan di bawah fungsi showDetailBerita)
function showDetailPotensi(title, image, description, category) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="relative">
                <img src="${image}" class="w-full h-72 object-cover">
                <span class="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase">
                    ${category}
                </span>
            </div>
            <div class="p-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">${title}</h2>
                <div class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">${description}</div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="mt-8 w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition shadow-lg">
                    Tutup Detail
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
// 3. Fungsi Memuat Berita & Fungsi Detail Berita
async function loadBeritaDesa() {
    const container = document.getElementById('berita-container');
    if (!container) return;
    try {
        const response = await fetch('https://api.github.com/repos/HizkiaPappang/desa-lindangan/contents/data/berita');
        if (!response.ok) return;
        const files = await response.json();
        const newsFiles = files.filter(f => f.name.endsWith('.json')).reverse().slice(0, 3);
        
        container.innerHTML = ''; 
        for (const file of newsFiles) {
            const res = await fetch(file.download_url);
            const item = await res.json();
            const date = new Date(item.date).toLocaleDateString('id-ID');

            // Kita simpan data berita ke dalam fungsi onclick
            container.innerHTML += `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
                    <img src="${item.image}" class="w-full h-40 object-cover">
                    <div class="p-5 flex flex-col flex-grow">
                        <p class="text-red-600 text-[10px] font-bold mb-1">${date}</p>
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.title}</h3>
                        <p class="text-gray-500 text-xs overflow-hidden mb-4" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                            ${item.body.replace(/[#*]/g, '')}
                        </p>
                        <div class="mt-auto pt-4">
                            <button onclick="showDetailBerita('${item.title.replace(/'/g, "\\'")}', '${item.image}', '${item.body.replace(/\n/g, '<br>').replace(/'/g, "\\'")}')" 
                                    class="text-red-700 font-bold text-xs italic hover:underline">
                                Baca Selengkapnya →
                            </button>
                        </div>
                    </div>
                </div>`;
        }
    } catch (e) { console.error("Berita Error"); }
}

// 4. Fungsi Menampilkan Modal Detail Berita
function showDetailBerita(title, image, body) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <img src="${image}" class="w-full h-64 object-cover">
            <div class="p-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">${title}</h2>
                <div class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">${body}</div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="mt-8 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition">
                    Tutup Berita
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function loadAparatData() {
    try {
        const response = await fetch('data/pemerintahan.json?t=' + new Date().getTime());
        if(!response.ok) return;
        const data = await response.json();
        
        const mapping = {
            'nama-hukum-tua': data.hukum_tua, 'nama-sekdes': data.sekdes,
            'nama-kasie-pem': data.kasie_pemerintahan, 'nama-kasie-kesra': data.kasie_kesejahteraan,
            'nama-kasie-pelayanan': data.kasie_pelayanan, 'nama-kaur-umum': data.kaur_umum,
            'nama-kaur-rencana': data.kaur_perencanaan, 'nama-kaur-keu': data.kaur_keuangan,
            'nama-jaga-1': data.jaga_1, 'nama-jaga-2': data.jaga_2, 'nama-jaga-3': data.jaga_3,
            // Mapping baru untuk sejarah dan statistik
            'stat-penduduk': data.total_penduduk,
            'stat-kk': data.total_kk
        };

        for (const [id, value] of Object.entries(mapping)) {
            const el = document.getElementById(id);
            if (el) el.innerText = value || '0';
        }

        // Khusus Sejarah menggunakan innerHTML karena formatnya Markdown/HTML
        const sejarahEl = document.getElementById('konten-sejarah');
        if (sejarahEl) sejarahEl.innerHTML = data.sejarah ? data.sejarah.replace(/\n/g, '<br>') : 'Sejarah belum diisi.';

    } catch (e) { console.error("Gagal muat data profil desa"); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAparatData();
    loadPotensiDesa();
    loadBeritaDesa();
});