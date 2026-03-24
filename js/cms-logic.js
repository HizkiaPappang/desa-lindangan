/**
 * CMS-LOGIC.JS - DESA LINDANGAN
 * Versi Dinamis & Statistik Lengkap
 */

// 1. FUNGSI UTAMA: MEMUAT DATA APARAT & STATISTIK
async function loadAparatData() {
  try {
    const response = await fetch(
      "data/pemerintahan.json?t=" + new Date().getTime(),
    );
    if (!response.ok) return;
    const data = await response.json();

    // --- A. Sinkronisasi Nama Aparat (Dinamis) ---
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

    // --- B. Statistik Utama ---
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

    // --- C. Statistik Detail (Looping List) ---
    renderListStats("list-pekerjaan", data.pekerjaan);
    renderListStats("list-pendidikan", data.pendidikan);
    renderListStats("list-agama", data.agama);

    // --- D. Logika Modal Jelajah Desa ---
    const profilData = data.profil_section || {};

    // Tombol Sejarah
    const btnSejarah = document.getElementById("btn-sejarah-lengkap");
    if (btnSejarah) {
      btnSejarah.onclick = () =>
        showModal("Sejarah Desa", "", profilData.sejarah, "sejarah");
    }

    // Fungsi Global untuk Modal Profil (Peta)
    window.showModalProfil = () => {
      showModal(
        "Profil & Letak Geografis",
        "assets/img/PETA.png",
        `
                <div class="space-y-4 text-sm">
                    <p><b>Kondisi Geografis:</b> Desa Lindangan berada di dataran tinggi (368 mdpl) dan dilewati aliran Sungai Ranoyapo.</p>
                    <hr>
                    <p><b>Batas Wilayah:</b></p>
                    <ul class="list-none space-y-1">
                        <li><span class="text-red-600 font-bold">UTARA:</span> Desa Ranoyapo</li>
                        <li><span class="text-red-600 font-bold">SELATAN:</span> Desa Torout</li>
                        <li><span class="text-red-600 font-bold">TIMUR:</span> Sungai Ranoyapo</li>
                        <li><span class="text-red-600 font-bold">BARAT:</span> Hutan Lindung</li>
                    </ul>
                </div>
            `,
        "profil",
      );
    };

    // Fungsi Global untuk Modal Visi Misi
    window.showModalVisiMisi = () => {
      showModal(
        "Visi & Misi Desa",
        "",
        `
                <div class="space-y-6">
                    <div>
                        <h4 class="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Visi</h4>
                        <p class="text-xl italic font-medium">"${profilData.visi || "-"}"</p>
                    </div>
                    <div>
                        <h4 class="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Misi</h4>
                        <div class="text-gray-700 leading-relaxed">${profilData.misi ? profilData.misi.replace(/\n/g, "<br>") : "-"}</div>
                    </div>
                </div>
            `,
        "visimisi",
      );
    };
  } catch (e) {
    console.error("Gagal memuat data pemerintahan:", e);
  }
}

// FUNGSI PEMBANTU: Render List Statistik
function renderListStats(containerId, dataList) {
  const container = document.getElementById(containerId);
  if (!container || !dataList) return;
  container.innerHTML = "";
  dataList.forEach((item) => {
    container.innerHTML += `
            <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                <span class="text-gray-600">${item.nama}</span>
                <span class="font-bold text-red-600">${item.jumlah}</span>
            </div>`;
  });
}

// 2. FUNGSI MEMUAT POTENSI DESA (Tampil Semua)
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
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded w-fit">${item.category}</span>
                        <h3 class="text-xl font-bold mt-2 text-gray-800">${item.title}</h3>
                        <p class="text-gray-600 mt-2 text-sm leading-relaxed overflow-hidden mb-4" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                            ${item.description}
                        </p>
                        <div class="mt-auto pt-2">
                            <button onclick="showModal('${item.title.replace(/'/g, "\\'")}', '${item.image}', '${item.description.replace(/\n/g, "<br>").replace(/'/g, "\\'")}', 'potensi', '${item.category}')" 
                                    class="text-red-700 font-bold text-xs uppercase tracking-tighter hover:underline">
                                Lihat Detail Potensi ↓
                            </button>
                        </div>
                    </div>
                </div>`;
    });
  } catch (e) {
    console.error("Potensi Error:", e);
  }
}

// 3. FUNGSI MEMUAT BERITA DESA
// Di dalam loadBeritaDesa, cari bagian loop innerHTML:
files.forEach(async (file) => {
    const res = await fetch(file.download_url);
    const item = await res.json();
    const date = new Date(item.date).toLocaleDateString('id-ID');

    // --- TAMBAHKAN LOGIKA PEMOTONG TEKS DI SINI ---
    // Kita ambil hanya 150 karakter pertama saja untuk kartu depan
    const ringkasanBerita = item.body ? item.body.substring(0, 150).replace(/[#*]/g, '') + '...' : '';

    container.innerHTML += `
        <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
            <img src="${item.image}" class="w-full h-48 object-cover">
            <div class="p-5 flex flex-col flex-grow">
                <p class="text-red-600 text-[10px] font-bold mb-1 uppercase tracking-widest">${date}</p>
                <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.title}</h3>
                
                <p class="text-gray-500 text-xs mb-4 leading-relaxed">
                    ${ringkasanBerita}
                </p>
                
                <div class="mt-auto pt-4 border-t border-gray-50">
                    <button onclick="showModal('${item.title.replace(/'/g, "\\'")}', '${item.image}', '${item.body.replace(/\n/g, '<br>').replace(/'/g, "\\'")}', 'berita')" 
                            class="text-red-700 font-bold text-xs italic hover:underline">
                        Baca Selengkapnya →
                    </button>
                </div>
            </div>
        </div>`;
});

// 4. FUNGSI MODAL UNIVERSAL
function showModal(title, image, content, type, category = "") {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm";

  const modalImage = image
    ? `<img src="${image}" class="w-full h-64 md:h-80 object-cover rounded-t-3xl">`
    : "";
  const badge = category
    ? `<span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg uppercase">${category}</span>`
    : "";

  modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div class="relative">${modalImage}${badge}</div>
            <div class="p-8 md:p-12">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 uppercase tracking-tighter">${title}</h2>
                <div class="text-gray-600 leading-relaxed text-base md:text-lg space-y-4 whitespace-pre-line">
                    ${content}
                </div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="mt-10 w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition shadow-lg uppercase text-xs tracking-widest">
                    Tutup
                </button>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  loadAparatData();
  loadPotensiDesa();
  loadBeritaDesa();
});
