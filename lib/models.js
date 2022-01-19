export const ModelResponden = {
    _id: '',
    _user: '',
    tanggal: '',
    desa: '',
    gender: '',
    nama: '',
    tanggalLahir: '',
    statusKeluarga: '',
    statusMarital: '',
    pendidikan: '',
    jumlahKlgSerumah: '',
    jumlahOrangSerumah: '',
    agama: '',
    suku : '',
    bahasa: '',
    lamaTinggal: '',
    asal: '',
    pekerjaanUtama: '',
    pekerjaanLain: '',
    // minatKerjaDiAMNT: '',
    // pernahMelamarAMNT: '',
    // minatPelatihan: '',
    // jenisPelatihan: '',
    // pendapatanPerBulan: '',
    // sumberPendapatan: [],
    // belanjaPerBulan: '',
    // belanjaKonsumsi: '',
    // belanjaKesehatan: '',
    // belanjaPendidikan: '',
    // belanjaKomunikasi: '',
    // belanjaTransportasi: '',
    // belanjaSewaRumah: '',
    // belanjaListrik: '',
    // belanjaCicilan: '',
    // belanjaLainnya: '',
    // tabungan: '',
    // jumlahTabungan: '',
    // tempatTabungan: '',
    // kecukupanPendapatan: '',
    // caraPemenuhanKebutuhan: '',
}

export function NewResponden(nama, user) {
    return {
        _id: '',
        _user: user._id,
        // isNelayan: false,
        enumerator: '',
        tanggal: '',
        desa: '',
        gender: '',
        nama: nama,
        tanggalLahir: '',
        umur: 0,
        statusKeluarga: '',
        statusMarital: '',
        pendidikan: '',
        jumlahKlgSerumah: '',
        jumlahOrangSerumah: '',
        agama: '',
        suku : '',
        bahasa: '',
        lamaTinggal: '',
        asal: '',
        pekerjaanUtama: '',
        pekerjaanLain: '',
    }
}

export function NewEkonomi(idr) {
    return {
        _id: idr,
        minatKerjaDiAMNT: '',
        pernahMelamarAMNT: '',
        minatPelatihan: '',
        jenisPelatihan: '',
        pendapatanPerBulan: '',
        sumberPendapatan: [],
        belanjaPerBulan: '',
        belanjaKonsumsi: '',
        belanjaKesehatan: '',
        belanjaPendidikan: '',
        belanjaKomunikasi: '',
        belanjaTransportasi: '',
        belanjaSewaRumah: '',
        belanjaListrik: '',
        belanjaCicilan: '',
        belanjaLainnya: '',
        tabungan: '',
        jumlahTabungan: '',
        tempatTabungan: '',
        kecukupanPendapatan: '',
        caraPemenuhanKebutuhan: '',
    }
}

export function NewAnggota(idr) {
    return {
        _id: '',
        _idr: idr,
        nama: '',
        hubungan: '',
        gender: '',
        marital: '',
        umur: 0,
        melekHuruf: '',
        pendidikan: '',
        pekerjaanUtama: '',
        pekerjaanLain: '',
    }
}

export function NewAset(idr) {
    return {
        _id: idr,
        // _idr: idr,
        jenis: '',
        luas: 0,
        ruang: '',
        statusRumah: '',
        buktiStatus: '',
        luasTanah: 0,
        luasBangunan: 0,
        luasProduktif: 0,
        luasNonProduktif: 0,
        luasLainnya: 0,
        mobil: 0,
        motor: 0,
        perahuMesin: 0,
        perahuNonMesin: 0,
        traktor: 0,
        sumberListrik: '',
    }
}

export function NewNelayan(idr) {
    return {
        _id: idr,
        // _idr: idr,
        isNelayan: false,
        polaMencari: '',
        frekuensi: '',
        lokasi: [],
        hasil: '',
        perbedaan: '',
        infoPerbedaan: '',
        dampakTailing: '',
        kualitasHasil: '',
        infoKualitas: '',
        jikaTailingMengganggu: '',
        minatUbahPencaharian: '',
        infoMinatUbahPencaharian: '',
        minatPelatihan: '',
        infoMinatPelatihan: '',
        minatMenjadiNelayanLaut: '',
        infoMinatMenjadiNelayanLaut: '',
        yangDilakukanAMNT: '',
        harapanUntukAMNT: '',
        harapanUntukPemerintah: '',
    }
}

export function NewKonflik(idr) {
    return {
        _id: idr,
        // _idr: idr,
        konflik: '',
        infoKonflik: '',
        konflikHorisontal: '',
        konflikVertikal: '',
        tokohResolusi: '',
    }
}

export function NewKesmas(idr) {
    return {
        _id:idr,
        // _idr: idr,
        penyakit: [],
        stunting: '',
        infoStunting: '',
        wabah: [],
        tempatBerobat: '',
        aksesFaskes: '',
        biaya: '',
        kisbpjs: [],
        kualitasLayanan: '',
        sumberAirMinum: '',
        merebusAirMinum: '',
        konsumsiPerHari: '',
        sumberAirBersih: '',
        masalahAir: '',
        penyelesaianMasalahAir: '',
        saranaBAB: '',
        saranaLimbahCair: '',
        pengolahanSampah: '',
    }
}

export function NewObservasi(idr) {
    return {
        _id: idr,
        // _idr: idr,
        genangan: '',
        jentik: '',
        vektor: '',
        kebersihan: '',
        kelompokSampah: [],
        plafon: '',
        dinding: '',
        lantai: '',
        jendelaKamar: '',
        jendelaKeluarga: '',
        ventilasi: '',
        pencahayaan: '',
        konsumsiSayur: '',
        olahraga: '',
        kebersihanDiri: [],
        perokok: '',
        tempatMerokok: '',
        konsumsiMiras: '',
        dampakMiras: [],
    }
}

export function NewPersepsi(idr) {
    return {
        _id: idr,
        // _idr: idr,
        tahuRencana: '',
        sumberTahu: '',
        manfaatEkonomi: [],
        pekerjaanKasar: '',
        infoPekerjaanKasar: '',
        pilihanPekerjaan: '',
        infoPilihanPekerjaan: '',
        dampakLingkungan: '',
        infoDampakLingkungan: '',
        dampakKesehatan: '',
        infoDampakKesehatan: '',
        dampakLayananPublik: '',
        infoDampakLayananPublik: '',
        dampakAdat: '',
        infoDampakAdat: '',
        dampakSignifikan: '',
        gotongroyong: '',
        infoGotongroyong: '',
        dukungan: '',
        infoDukungan: '',
        aktivitas: '',
        infoAktivitas: '',
    }
}

export function NewTanaman(idr) {
    return {
        _id: 'NEW',
        _idr: idr,
        // 
        jenis: '',
        luas: '',
        dikonsumsi: 0,
        dijual: 0,
        nilai: 0,
    }
}

export function NewTernak(idr) {
    return {
        _id: 'NEW',
        _idr: idr,
        // 
        jenis: '',
        jumlah: 0,
        dikonsumsi: 0,
        dijual: 0,
        nilai: 0,
    }
}

export function NewIkan(idr) {
    return {
        _id: 'NEW',
        _idr: idr,
        // 
        jenis: '',
        // -----
        dikonsumsi: 0,
        dijual: 0,
        nilai: 0,
    }
}

export function NewHutan(idr) {
    return {
        _id: 'NEW',
        _idr: idr,
        // 
        jenis: '',
        jumlah: '',
        satuan: '',
        dijual: 0,
        nilai: 0,
    }
}
