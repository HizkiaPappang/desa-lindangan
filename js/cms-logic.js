async function loadAparatData() {
  try {
    const response = await fetch(
      "data/pemerintahan.json?t=" + new Date().getTime(),
    );
    const data = await response.json();

    // 1. Data Utama & Statistik Dasar
    document.getElementById("stat-penduduk").innerText =
      data.stats_utama.penduduk || "0";
    document.getElementById("stat-kk").innerText = data.stats_utama.kk || "0";
    document.getElementById("stat-lk").innerText = data.stats_utama.lk || "0";
    document.getElementById("stat-pr").innerText = data.stats_utama.pr || "0";

    // 2. Loop Data Pekerjaan
    const listPekerjaan = document.getElementById("list-pekerjaan");
    listPekerjaan.innerHTML = "";
    data.pekerjaan.forEach((p) => {
      listPekerjaan.innerHTML += `<div class="flex justify-between"><span>${p.nama}</span><span class="font-bold text-red-600">${p.jumlah}</span></div>`;
    });

    // 3. Loop Data Pendidikan
    const listPendidikan = document.getElementById("list-pendidikan");
    listPendidikan.innerHTML = "";
    data.pendidikan.forEach((p) => {
      listPendidikan.innerHTML += `<div class="flex justify-between"><span>${p.nama}</span><span class="font-bold text-red-600">${p.jumlah}</span></div>`;
    });

    // 4. Loop Data Agama
    const listAgama = document.getElementById("list-agama");
    listAgama.innerHTML = "";
    data.agama.forEach((a) => {
      listAgama.innerHTML += `<div class="flex justify-between"><span>${a.nama}</span><span class="font-bold text-red-600">${a.jumlah}</span></div>`;
    });

    // 5. Fungsi Modal Profil (Gunakan PETA.png)
    window.showModalProfil = () => {
      showModal(
        "Profil & Letak Geografis",
        "assets/img/PETA.png",
        `
                <b>Letak Geografis:</b><br>
                Desa Lindangan berada di dataran tinggi (368 mdpl) dan dilewati aliran Sungai Ranoyapo.<br><br>
                <b>Batas Wilayah:</b><br>
                Utara: Desa Ranoyapo<br>
                Selatan: Desa Torout<br>
                Timur: Sungai Ranoyapo<br>
                Barat: Hutan Lindung
            `,
        "profil",
      );
    };

    // 6. Fungsi Modal Visi Misi
    window.showModalVisiMisi = () => {
      showModal(
        "Visi & Misi Desa",
        "",
        `
                <h3 class='font-bold text-red-600'>VISI:</h3>
                <p class='italic'>"${data.visi}"</p><br>
                <h3 class='font-bold text-red-600'>MISI:</h3>
                <p>${data.misi.replace(/\n/g, "<br>")}</p>
            `,
        "visimisi",
      );
    };

    // 7. Sejarah
    document.getElementById("btn-sejarah-lengkap").onclick = () => {
      showModal("Sejarah Desa", "", data.sejarah, "sejarah");
    };
  } catch (e) {
    console.error("Error muat data:", e);
  }
}

// 2. FUNGSI MEMUAT POTENSI DESA
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
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
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
    console.error("Potensi Error");
  }
}

// 3. FUNGSI MEMUAT BERITA DESA
async function loadBeritaDesa() {
  const container = document.getElementById("berita-container");
  if (!container) return;
  try {
    // Ganti username jika berbeda
    const response = await fetch(
      "https://api.github.com/repos/HizkiaPappang/desa-lindangan/contents/data/berita",
    );
    if (!response.ok) return;
    const files = await response.json();

    // Ambil 3 file JSON terbaru
    const newsFiles = files
      .filter((f) => f.name.endsWith(".json"))
      .reverse()
      .slice(0, 3);

    container.innerHTML = "";
    for (const file of newsFiles) {
      const res = await fetch(file.download_url);
      const item = await res.json();
      const date = new Date(item.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      container.innerHTML += `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
                    <img src="${item.image}" class="w-full h-40 object-cover">
                    <div class="p-5 flex flex-col flex-grow">
                        <p class="text-red-600 text-[10px] font-bold mb-1">${date}</p>
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.title}</h3>
                        <p class="text-gray-500 text-xs overflow-hidden mb-4" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
                            ${item.body.replace(/[#*]/g, "")}
                        </p>
                        <div class="mt-auto pt-4 border-t border-gray-50">
                            <button onclick="showModal('${item.title.replace(/'/g, "\\'")}', '${item.image}', '${item.body.replace(/\n/g, "<br>").replace(/'/g, "\\'")}', 'berita')" 
                                    class="text-red-700 font-bold text-xs italic hover:underline">
                                Baca Selengkapnya →
                            </button>
                        </div>
                    </div>
                </div>`;
    }
  } catch (e) {
    console.error("Berita Error:", e);
  }
}

// 4. FUNGSI MODAL UNIVERSAL (Untuk Sejarah, Potensi, & Berita)
function showModal(title, image, content, type, category = "") {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm";

  // Header modal (Gambar hanya jika ada)
  const modalImage = image
    ? `<img src="${image}" class="w-full h-64 md:h-80 object-cover">`
    : "";
  const badge = category
    ? `<span class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg uppercase">${category}</span>`
    : "";

  modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div class="relative">${modalImage}${badge}</div>
            <div class="p-8 md:p-12">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">${title}</h2>
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

  // Kunci scroll body saat modal buka
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// EKSEKUSI SAAT HALAMAN SELESAI DIMUAT
document.addEventListener("DOMContentLoaded", () => {
  loadAparatData();
  loadPotensiDesa();
  loadBeritaDesa();
});
