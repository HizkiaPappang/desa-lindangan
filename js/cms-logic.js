/**
 * CMS-LOGIC.JS - DESA LINDANGAN
 * Versi Final: Perbaikan Berita & Potensi
 */

// 1. MEMUAT DATA APARAT & STATISTIK
async function loadAparatData() {
  try {
    const response = await fetch(
      "data/pemerintahan.json?t=" + new Date().getTime(),
    );
    if (!response.ok) return;
    const data = await response.json();

    // Sinkronisasi Nama Aparat
    const pimpinan = data.aparat || {};
    const mapping = {
      "nama-hukum-tua": pimpinan.hukum_tua,
      "nama-sekdes": pimpinan.sekdes,
      "nama-kasie-pem": pimpinan.kasie_pem,
      "nama-kasie-kesra": pimpinan.kasie_kesra,
      "nama-kasie-pelayanan": pimpinan.kasie_pelayanan,
      "nama-kaur-umum": pimpinan.kaur_umum,
      "nama-kaur-rencana": pimpinan.kaur_rencana,
      "nama-kaur-keu": pimpinan.kaur_keu,
      "nama-jaga-1": pimpinan.jaga_1,
      "nama-jaga-2": pimpinan.jaga_2,
      "nama-jaga-3": pimpinan.jaga_3,
    };

    for (const [id, value] of Object.entries(mapping)) {
      const el = document.getElementById(id);
      if (el) el.innerText = value || "-";
    }

    // Statistik Utama
    const stats = data.stats_utama || {};
    if (document.getElementById("stat-penduduk"))
      document.getElementById("stat-penduduk").innerText =
        stats.penduduk || "0";
    if (document.getElementById("stat-kk"))
      document.getElementById("stat-kk").innerText = stats.kk || "0";
    if (document.getElementById("stat-lk"))
      document.getElementById("stat-lk").innerText = stats.lk || "0";
    if (document.getElementById("stat-pr"))
      document.getElementById("stat-pr").innerText = stats.pr || "0";

    // Statistik Detail
    renderListStats("list-pekerjaan", data.pekerjaan);
    renderListStats("list-pendidikan", data.pendidikan);
    renderListStats("list-agama", data.agama);

    // Modal Jelajah Desa
    const profilData = data.profil_section || {};
    const btnSejarah = document.getElementById("btn-sejarah-lengkap");
    if (btnSejarah) {
      btnSejarah.onclick = () =>
        showModal("Sejarah Desa", "", profilData.sejarah, "sejarah");
    }

    window.showModalVisiMisi = () => {
      showModal(
        "Visi & Misi Desa",
        "",
        `
                <div class="space-y-6">
                    <div>
                        <h4 class="text-red-600 font-bold uppercase text-xs mb-2">Visi</h4>
                        <p class="text-xl italic">"${profilData.visi || "-"}"</p>
                    </div>
                    <div>
                        <h4 class="text-red-600 font-bold uppercase text-xs mb-2">Misi</h4>
                        <div class="text-gray-700 leading-relaxed">${profilData.misi ? profilData.misi.replace(/\n/g, "<br>") : "-"}</div>
                    </div>
                </div>
            `,
        "visimisi",
      );
    };
  } catch (e) {
    console.error("Aparat Error:", e);
  }
}

function renderListStats(containerId, dataList) {
  const container = document.getElementById(containerId);
  if (!container || !dataList) return;
  container.innerHTML = "";
  dataList.forEach((item) => {
    container.innerHTML += `<div class="flex justify-between border-b border-gray-50 pb-2"><span>${item.nama}</span><span class="font-bold text-red-600">${item.jumlah}</span></div>`;
  });
}

// 2. MEMUAT POTENSI DESA (Tampil Semua)
async function loadPotensiDesa() {
  const container = document.getElementById("potensi-container");
  if (!container) return;
  try {
    const response = await fetch("data/potensi.json?t=" + new Date().getTime());
    const data = await response.json();
    const list = data.potensi || [];

    container.innerHTML = "";
    list.forEach((item) => {
      container.innerHTML += `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all">
                    <img src="${item.image}" class="w-full h-48 object-cover">
                    <div class="p-6 flex flex-col flex-grow text-left">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded w-fit">${item.category}</span>
                        <h3 class="text-xl font-bold mt-2 text-gray-800">${item.title}</h3>
                        <p class="text-gray-500 text-xs mt-2 mb-4 leading-relaxed">${item.description.substring(0, 100)}...</p>
                        <div class="mt-auto pt-2">
                            <button onclick="showModal('${item.title.replace(/'/g, "\\'")}', '${item.image}', '${item.description.replace(/\n/g, "<br>").replace(/'/g, "\\'")}', 'potensi', '${item.category}')" 
                                    class="text-red-700 font-bold text-xs uppercase hover:underline">Lihat Detail ↓</button>
                        </div>
                    </div>
                </div>`;
    });
  } catch (e) {
    console.error("Potensi Error:", e);
  }
}

// 3. MEMUAT BERITA DESA (Dengan Pemotong Teks)
// --- FUNGSI FULL LOAD BERITA DESA ---
async function loadBeritaDesa() {
    const container = document.getElementById('berita-container');
    if (!container) return;
    
    // Tampilkan pesan loading sementara
    container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Memuat berita terbaru...</p>';

    try {
        // Ganti 'HizkiaPappang' dan 'desa-lindangan' sesuai dengan Repo GitHub kamu
        const repoPath = 'HizkiaPappang/desa-lindangan';
        const url = `https://api.github.com/repos/${repoPath}/contents/data/berita`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-400 italic">Belum ada berita yang tersedia.</p>';
            return;
        }

        const files = await response.json();
        
        // Filter hanya file .json dan balik urutan (terbaru di atas)
        const newsFiles = files.filter(f => f.name.endsWith('.json')).reverse();

        if (newsFiles.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-400">Belum ada berita yang dipublikasikan.</p>';
            return;
        }

        container.innerHTML = ''; // Bersihkan kontainer sebelum isi data

        // Ambil 6 berita terbaru saja
        for (const file of newsFiles.slice(0, 6)) {
            const res = await fetch(file.download_url);
            const item = await res.json();
            
            // 1. Format Tanggal Indonesia
            const dateStr = item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru saja';
            
            // 2. Potong Ringkasan (150 Karakter) agar kotak tetap sejajar
            const rawBody = item.body || '';
            const ringkasan = rawBody.substring(0, 150).replace(/[#*]/g, '') + '...';

            // 3. MEMBERSIHKAN DATA UNTUK TOMBOL (PENTING!)
            // Kita bersihkan tanda kutip agar fungsi showModal tidak error/macet
            const safeTitle = item.title ? item.title.replace(/'/g, "\\'").replace(/"/g, '&quot;') : 'Berita Desa';
            const safeImage = item.image || 'assets/img/top.jpg';
            // Ganti baris baru (\n) menjadi <br> agar rapi di dalam modal
            const safeBody = rawBody.replace(/\n/g, '<br>').replace(/'/g, "\\'").replace(/"/g, '&quot;');

            container.innerHTML += `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
                    <img src="${safeImage}" class="w-full h-48 object-cover border-b" onerror="this.src='assets/img/top.jpg'">
                    <div class="p-5 flex flex-col flex-grow text-left">
                        <p class="text-red-600 text-[10px] font-bold mb-1 uppercase tracking-widest">${dateStr}</p>
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.title || 'Tanpa Judul'}</h3>
                        <p class="text-gray-500 text-xs mb-4 leading-relaxed">${ringkasan}</p>
                        
                        <div class="mt-auto pt-4 border-t border-gray-50">
                            <button onclick="showModal('${safeTitle}', '${safeImage}', '${safeBody}', 'berita')" 
                                    class="text-red-700 font-bold text-xs italic hover:underline cursor-pointer">
                                Baca Selengkapnya →
                            </button>
                        </div>
                    </div>
                </div>`;
        }
    } catch (e) {
        console.error("Error Berita:", e);
        container.innerHTML = '<p class="text-center col-span-full text-red-500 italic text-sm">Gagal memuat berita. Coba refresh halaman.</p>';
    }
}
// 4. FUNGSI MODAL UNIVERSAL
function showModal(title, image, content, type, category = "") {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm";

  const modalImage = image
    ? `<img src="${image}" class="w-full h-64 object-cover rounded-t-3xl">`
    : "";
  const badge = category
    ? `<span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase">${category}</span>`
    : "";

  modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div class="relative">${modalImage}${badge}</div>
            <div class="p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 uppercase tracking-tighter">${title}</h2>
                <div class="text-gray-600 leading-relaxed space-y-4">${content}</div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="mt-10 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition uppercase text-xs tracking-widest">Tutup</button>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// INISIALISASI
document.addEventListener("DOMContentLoaded", () => {
  loadAparatData();
  loadPotensiDesa();
  loadBeritaDesa();
});
