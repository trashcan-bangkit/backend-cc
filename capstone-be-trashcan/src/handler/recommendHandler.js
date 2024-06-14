const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function handleRecommend(request, h) {
    const { file } = request.payload; // Ambil path dari file yang diunggah

    try {
        if (!file) {
            return h.response({ error: 'No file provided' }).code(400);
        }

        // Kirim file untuk diprediksi ke endpoint external
        const form = new FormData();
        form.append('file', file, { filename: file.hapi.filename, contentType: file.hapi.headers['content-type'] });

        const predictResponse = await axios.post('https://trashcan-qnitsxbfya-et.a.run.app/predict', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // Ambil kategori dan subkategori dari respons prediksi
        const { main_category, sub_category } = predictResponse.data;

        // Rekomendasi berdasarkan kategori dan subkategori dari respons prediksi
        const recommendations = {
            'Anorganik': {                
                'Kaleng': ["1. Pot tanaman kecil." , "2. Lilin aroma terapi.", "3. Penyimpanan alat tulis." , "4. Tempat penyimpanan makanan hewan peliharaan." , "5. Lampu gantung dekoratif.", "6. Mainan edukatif untuk anak-anak.", "7. Tempat penyimpanan bumbu dapur."],
                'PET': ["1. untuk pembuatan pakaian.", "2. Botol daur ulang untuk kemasan." , "3. Komponen serat untuk karpet.", "4. Bahan baku untuk pembuatan selimut." ,"5. Geotekstil untuk proyek konstruksi." , "6. Wadah penyimpanan makanan." ,"7. Aksesoris fashion, seperti gelang atau kalung."],
                'Tas Plastik Belanja': ["1. Tas belanja daur ulang." ,"2. Penutup atau alas tanaman." , "3. Komponen bahan bangunan.", "4. Tempat sampah kecil untuk mobil." , "5. Kantong penyimpanan serbaguna." ,"6. Apron untuk kegiatan melukis atau berkebun." , "7. Pelapis atau pembungkus barang."]
            },
            'B3': {
                'Aerosol': ["1. Material isolasi untuk konstruksi." , "2.Bahan baku untuk pembuatan semen." , "3. Komponen untuk pembuatan baterai." , "4. Bahan dasar untuk produk pembersih industri." , "5. Absorben kebocoran kimia.", "6. Bahan baku untuk pengolahan ulang plastik tahan api.", "7. Penggunaan kembali dalam industri farmasi."],
                'Baterai': ["1. Material isolasi untuk konstruksi." , "2.Bahan baku untuk pembuatan semen." , "3. Komponen untuk pembuatan baterai." , "4. Bahan dasar untuk produk pembersih industri." , "5. Absorben kebocoran kimia.", "6. Bahan baku untuk pengolahan ulang plastik tahan api.", "7. Penggunaan kembali dalam industri farmasi."],
                'Obat Kapsul': ["1. Material isolasi untuk konstruksi." , "2.Bahan baku untuk pembuatan semen." , "3. Komponen untuk pembuatan baterai." , "4. Bahan dasar untuk produk pembersih industri." , "5. Absorben kebocoran kimia.", "6. Bahan baku untuk pengolahan ulang plastik tahan api.", "7. Penggunaan kembali dalam industri farmasi."]
            },
            'Organik': {
                'Daun': ["1. Material isolasi untuk konstruksi." , "2.Bahan baku untuk pembuatan semen." , "3. Komponen untuk pembuatan baterai." , "4. Bahan dasar untuk produk pembersih industri." , "5. Absorben kebocoran kimia.", "6. Bahan baku untuk pengolahan ulang plastik tahan api.", "7. Penggunaan kembali dalam industri farmasi."],
                'Kardus': ["1. Material isolasi untuk konstruksi." , "2.Bahan baku untuk pembuatan semen." , "3. Komponen untuk pembuatan baterai." , "4. Bahan dasar untuk produk pembersih industri." , "5. Absorben kebocoran kimia.", "6. Bahan baku untuk pengolahan ulang plastik tahan api.", "7. Penggunaan kembali dalam industri farmasi."],
                'Makanan Olahan': ["1. Material isolasi untuk konstruksi." , "2.Bahan baku untuk pembuatan semen." , "3. Komponen untuk pembuatan baterai." , "4. Bahan dasar untuk produk pembersih industri." , "5. Absorben kebocoran kimia.", "6. Bahan baku untuk pengolahan ulang plastik tahan api.", "7. Penggunaan kembali dalam industri farmasi."]
            }
        };

        // Deskripsi setiap rekomendasi
        const desc = {
            'Anorganik': 'Jenis  sampah yang tidak dapat terurai secara alami oleh organisme pengurai',
            'Organik' : "Jenis sampah yang berasal dari bahan-bahan alami yang bisa terurai oleh organisme pengurai.",
            'B3' : "Jenis sampah yang mengandung zat atau komponen berbahaya yang dapat membahayakan kesehatan manusia dan lingkungan"
        }

        // Ambil rekomendasi berdasarkan kategori dan subkategori dari prediksi
        const recs = recommendations[main_category][sub_category] || ["No recommendations available."];

        return h.response({ main_category, sub_category, recommendations: recs, description: desc[main_category] || '' }).code(200);
    } catch (error) {
        console.log(error.response.data)
        // Tangani kesalahan jika terjadi
        return h.response({ error: error.message }).code(500);
    }
}

module.exports = {
    handleRecommend
};


