import { ObjectId } from "mongodb";
import withSession from "lib/session";
import { connect } from "lib/mongodb";
import { ModelResponden, NewAset, NewKesmas, NewKonflik, NewNelayan, NewObservasi, NewPersepsi } from "lib/models";

const ACCEPTED_QUERIES = {}

export default withSession(async (req, res) => {
    const user = req.session.get("user");

  if (!user || user.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { q } = req.query;
  console.log(new Date(), q);

  if (!q || !ACCEPTED_QUERIES[q]) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const task = ACCEPTED_QUERIES[q];
  return task (req, res);
})

ACCEPTED_QUERIES['new-name'] = async function (req, res) {
    const { db, client } = await connect()
    const session = client.startSession()
    try {
        const user = req.session.get("user");
        const { nama } = req.body
        const id = ObjectId().toString()
        const model = ModelResponden
        model._id = id
        model._user = user._id
        model.nama = nama
        
        await session.withTransaction(async () => {
            await db.collection('responden').insertOne(model)
            
            await db.collection('aset').insertOne(NewAset(id))
            await db.collection('nelayan').insertOne(NewNelayan(id))
            await db.collection('konflik').insertOne(NewKonflik(id))
            await db.collection('kesmas').insertOne(NewKesmas(id))
            await db.collection('observasi').insertOne(NewObservasi(id))
            await db.collection('persepsi').insertOne(NewPersepsi(id))
            
            return res.json({ message: 'OK', id: id })
        })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-responden'] = async function (req, res) {
    const { db, client } = await connect()
    const session = client.startSession()
    try {
        await session.withTransaction(async () => {
            const user = req.session.get("user");
            const { _id } = req.body
            await db.collection('responden').findOneAndUpdate(
                { _id: _id },
                { $set: {
                    tanggal: req.body.tanggal,
                    desa: req.body.desa,
                    gender: req.body.gender,
                    nama: req.body.nama,
                    tanggalLahir: req.body.tanggalLahir,
                    statusKeluarga: req.body.statusKeluarga,
                    statusMarital: req.body.statusMarital,
                    pendidikan: req.body.pendidikan,
                    jumlahKlgSerumah: req.body.jumlahKlgSerumah,
                    jumlahOrangSerumah: req.body.jumlahOrangSerumah,
                    agama: req.body.agama,
                    suku: req.body.suku,
                    bahasa: req.body.bahasa,
                    lamaTinggal: req.body.lamaTinggal,
                    asal: req.body.asal,
                    pekerjaanUtama: req.body.pekerjaanUtama,
                    pekerjaanLain: req.body.pekerjaanLain,
                }}
            );
            
            const found = await db.collection('anggota').findOne({ _id: _id })
            if (found) {
                await db.collection('anggota').findOneAndUpdate(
                    { _id: _id },
                    { $set: {
                        _idr: _id,
                        nama: req.body.nama,
                        hubungan: req.body.statusKeluarga,
                        gender: req.body.gender,
                        marital: req.body.statusMarital,
                        umur: '',
                        melekHuruf: '',
                        pendidikan: req.body.pendidikan,
                        pekerjaanUtama: req.body.pekerjaanUtama,
                        pekerjaanLain: req.body.pekerjaanLain,
                    }}
                )
            } else {
                await db.collection('anggota').insertOne({
                    _id: _id,
                    _idr: _id,
                    nama: req.body.nama,
                    hubungan: req.body.statusKeluarga,
                    gender: req.body.nama,
                    marital: req.body.statusMarital,
                    umur: req.body.nama,
                    melekHuruf: '',
                    pendidikan: req.body.pendidikan,
                    pekerjaanUtama: req.body.pekerjaanUtama,
                    pekerjaanLain: req.body.pekerjaanLain,
                })
            }
            
            return res.json({ message: 'OK' })
        })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-ekonomi'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { _id } = req.body
        await db.collection('responden').findOneAndUpdate(
            { _id: _id },
            { $set: {
                // pekerjaanUtama: req.body.pekerjaanUtama,
                // pekerjaanLain: req.body.pekerjaanLain,
                minatKerjaDiAMNT: req.body.minatKerjaDiAMNT,
                pernahMelamarAMNT: req.body.pernahMelamarAMNT,
                minatPelatihan: req.body.minatPelatihan,
                jenisPelatihan: req.body.jenisPelatihan,
                pendapatanPerBulan: req.body.pendapatanPerBulan,
                sumberPendapatan: req.body.sumberPendapatan,
                belanjaPerBulan: req.body.belanjaPerBulan,
                belanjaKonsumsi: req.body.belanjaKonsumsi,
                belanjaKesehatan: req.body.belanjaKesehatan,
                belanjaPendidikan: req.body.belanjaPendidikan,
                belanjaKomunikasi: req.body.belanjaKomunikasi,
                belanjaTransportasi: req.body.belanjaTransportasi,
                belanjaSewaRumah: req.body.belanjaSewaRumah,
                belanjaListrik: req.body.belanjaListrik,
                belanjaCicilan: req.body.belanjaCicilan,
                belanjaLainnya: req.body.belanjaLainnya,
                tabungan: req.body.tabungan,
                jumlahTabungan: req.body.jumlahTabungan,
                tempatTabungan: req.body.tempatTabungan,
                kecukupanPendapatan: req.body.kecukupanPendapatan,
                caraPemenuhanKebutuhan: req.body.caraPemenuhanKebutuhan,
            }}
        );
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-anggota'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { _id } = req.body
        const fields = {
            _idr: req.body._idr,
            nama: req.body.nama,
            hubungan: req.body.hubungan,
            gender: req.body.gender,
            marital: req.body.marital,
            umur: req.body.umur,
            melekHuruf: req.body.melekHuruf,
            pendidikan: req.body.pendidikan,
            pekerjaanUtama: req.body.pekerjaanUtama,
            pekerjaanLain: req.body.pekerjaanLain,
        }
        
        if (_id == 'NEW') {
            await db.collection('anggota').insertOne({
                _id: ObjectId().toString(),
                ...fields
            })
        } else {
            await db.collection('anggota').findOneAndUpdate(
                {_id: _id},
                { $set: { ...fields }}
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-tanaman'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { _id } = req.body
        const fields = {
            _idr: req.body._idr,
            jenis: req.body.jenis,
            luas: req.body.luas,
            dikonsumsi: req.body.dikonsumsi,
            dijual: req.body.dijual,
            nilai: req.body.nilai,
        }
        
        if (_id == 'NEW') {
            await db.collection('tanaman').insertOne({
                _id: ObjectId().toString(),
                ...fields
            })
        } else {
            await db.collection('tanaman').findOneAndUpdate(
                {_id: _id},
                { $set: { ...fields }}
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-ternak'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { _id } = req.body
        const fields = {
            _idr: req.body._idr,
            jenis: req.body.jenis,
            jumlah: req.body.jumlah,
            dikonsumsi: req.body.dikonsumsi,
            dijual: req.body.dijual,
            nilai: req.body.nilai,
        }
        
        if (_id == 'NEW') {
            await db.collection('ternak').insertOne({
                _id: ObjectId().toString(),
                ...fields
            })
        } else {
            await db.collection('ternak').findOneAndUpdate(
                {_id: _id},
                { $set: { ...fields }}
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-ikan'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { _id } = req.body
        const fields = {
            _idr: req.body._idr,
            jenis: req.body.jenis,
            // jumlah: req.body.jumlah,
            dikonsumsi: req.body.dikonsumsi,
            dijual: req.body.dijual,
            nilai: req.body.nilai,
        }
        
        if (_id == 'NEW') {
            await db.collection('ikan').insertOne({
                _id: ObjectId().toString(),
                ...fields
            })
        } else {
            await db.collection('ikan').findOneAndUpdate(
                {_id: _id},
                { $set: { ...fields }}
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-hutan'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { _id } = req.body
        const fields = {
            _idr: req.body._idr,
            jenis: req.body.jenis,
            jumlah: req.body.jumlah,
            satuan: req.body.satuan,
            dijual: req.body.dijual,
            nilai: req.body.nilai,
        }
        
        if (_id == 'NEW') {
            await db.collection('hutan').insertOne({
                _id: ObjectId().toString(),
                ...fields
            })
        } else {
            await db.collection('hutan').findOneAndUpdate(
                {_id: _id},
                { $set: { ...fields }}
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['delete-anggota'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { id } = req.query
        await db.collection('anggota').deleteOne({ _id: id })
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['delete-tanaman'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { id } = req.query
        await db.collection('tanaman').deleteOne({ _id: id })
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['delete-ternak'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { id } = req.query
        await db.collection('ternak').deleteOne({ _id: id })
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['delete-ikan'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { id } = req.query
        await db.collection('ikan').deleteOne({ _id: id })
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['delete-hutan'] = async function (req, res) {
    const { db, client } = await connect()
    try {
        const user = req.session.get("user");
        const { id } = req.query
        await db.collection('hutan').deleteOne({ _id: id })
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-aset'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = {
            jenis: data.jenis,
            luas: data.luas,
            ruang: data.ruang,
            statusRumah: data.statusRumah,
            buktiStatus: data.buktiStatus,
            luasTanah: data.luasTanah,
            luasBangunan: data.luasBangunan,
            luasProduktif: data.luasProduktif,
            luasNonProduktif: data.luasNonProduktif,
            luasLainnya: data.luasLainnya,
            mobil: data.mobil,
            motor: data.motor,
            perahuMesin: data.perahuMesin,
            perahuNonMesin: data.perahuNonMesin,
            traktor: data.traktor,
            sumberListrik: data.sumberListrik,
        }
        console.log(data._id)
        if (data._id == 'NEW') {
            await db.collection('aset').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('aset').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-nelayan'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = {
            polaMencari: data.polaMencari,
            frekuensi: data.frekuensi,
            lokasi: data.lokasi,
            hasil: data.hasil,
            perbedaan: data.perbedaan,
            infoPerbedaan: data.infoPerbedaan,
            dampakTailing: data.dampakTailing,
            kualitasHasil: data.kualitasHasil,
            infoKualitas: data.infoKualitas,
            jikaTailingMengganggu: data.jikaTailingMengganggu,
            minatUbahPencaharian: data.minatUbahPencaharian,
            infoMinatUbahPencaharian: data.infoMinatUbahPencaharian,
            minatPelatihan: data.minatPelatihan,
            infoMinatPelatihan: data.infoMinatPelatihan,
            minatMenjadiNelayanLaut: data.minatMenjadiNelayanLaut,
            infoMinatMenjadiNelayanLaut: data.infoMinatMenjadiNelayanLaut,
            yangDilakukanAMNT: data.yangDilakukanAMNT,
            harapanUntukAMNT: data.harapanUntukAMNT,
            harapanUntukPemerintah: data.harapanUntukPemerintah,
        }
        console.log(data._id)
        if (data._id == 'NEW') {
            await db.collection('nelayan').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('nelayan').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-konflik'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = {
            konflik: data.konflik,
            infoKonflik: data.infoKonflik,
            konflikHorisontal: data.konflikHorisontal,
            konflikVertikal: data.konflikVertikal,
            tokohResolusi: data.tokohResolusi,
        }
        console.log(data._id)
        if (data._id == 'NEW') {
            await db.collection('konflik').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('konflik').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-kesmas'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = {
            penyakit: data.penyakit,
            stunting: data.stunting,
            infoStunting: data.infoStunting,
            wabah: data.wabah,
            tempatBerobat: data.tempatBerobat,
            aksesFaskes: data.aksesFaskes,
            biaya: data.biaya,
            kisbpjs: data.kisbpjs,
            kualitasLayanan: data.kualitasLayanan,
            sumberAirMinum: data.sumberAirMinum,
            merebusAirMinum: data.merebusAirMinum,
            konsumsiPerHari: data.konsumsiPerHari,
            sumberAirBersih: data.sumberAirBersih,
            masalahAir: data.masalahAir,
            penyelesaianMasalahAir: data.penyelesaianMasalahAir,
            saranaBAB: data.saranaBAB,
            saranaLimbahCair: data.saranaLimbahCair,
            pengolahanSampah: data.pengolahanSampah,
        }
        console.log(data._id)
        if (data._id == 'NEW') {
            await db.collection('kesmas').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('kesmas').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-observasi'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = {
            genangan: data.genangan,
            jentik: data.jentik,
            vektor: data.vektor,
            kebersihan: data.kebersihan,
            kelompokSampah: data.kelompokSampah,
            plafon: data.plafon,
            dinding: data.dinding,
            lantai: data.lantai,
            jendelaKamar: data.jendelaKamar,
            jendelaKeluarga: data.jendelaKeluarga,
            ventilasi: data.ventilasi,
            pencahayaan: data.pencahayaan,
            konsumsiSayur: data.konsumsiSayur,
            olahraga: data.olahraga,
            kebersihanDiri: data.kebersihanDiri,
            perokok: data.perokok,
            tempatMerokok: data.tempatMerokok,
            konsumsiMiras: data.konsumsiMiras,
            dampakMiras: data.dampakMiras,
        }
        console.log(data._id)
        if (data._id == 'NEW') {
            await db.collection('observasi').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('observasi').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['save-persepsi'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = {
            tahuRencana: data.tahuRencana,
            sumberTahu: data.sumberTahu,
            manfaatEkonomi: data.manfaatEkonomi,
            pekerjaanKasar: data.pekerjaanKasar,
            infoPekerjaanKasar: data.infoPekerjaanKasar,
            pilihanPekerjaan: data.pilihanPekerjaan,
            infoPilihanPekerjaan: data.infoPilihanPekerjaan,
            dampakLingkungan: data.dampakLingkungan,
            infoDampakLingkungan: data.infoDampakLingkungan,
            dampakKesehatan: data.dampakKesehatan,
            infoDampakKesehatan: data.infoDampakKesehatan,
            dampakLayananPublik: data.dampakLayananPublik,
            infoDampakLayananPublik: data.infoDampakLayananPublik,
            dampakAdat: data.dampakAdat,
            infoDampakAdat: data.infoDampakAdat,
            gotongroyong: data.gotongroyong,
            infoGotongroyong: data.infoGotongroyong,
            dukungan: data.dukungan,
            infoDukungan: data.infoDukungan,
            aktivitas: data.aktivitas,
            infoAktivitas: data.infoAktivitas,
        }
        console.log(data._id)
        if (data._id == 'NEW') {
            await db.collection('persepsi').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('persepsi').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
        return res.json({ message: 'OK' })
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}