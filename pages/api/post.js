import { ObjectId } from "mongodb";
import withSession from "lib/session";
import { connect } from "lib/mongodb";
import { ModelResponden, NewAnggota, NewAset, NewEkonomi, NewKesmas, NewKonflik, NewNelayan, NewObservasi, NewPersepsi, NewResponden } from "lib/models";
import moment from "moment-timezone";

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
        
        // Date
        const now = new Date();
        const wita = moment.tz(now.toISOString(), 'Asia/Makassar').format();
        
        
        const model = NewResponden(nama, user)
        model._id = id
        model.created = wita.substring(0, 10) // yyyy-mm-dd
        model.entry = user.fullname
        model.enumerator = user.fullname
        
        await session.withTransaction(async () => {
            await db.collection('responden').insertOne(model)
            
            const kk = NewAnggota(id)
            kk._id = id
            kk.nama = nama
            await db.collection('anggota').insertOne(kk)
            
            await db.collection('ekonomi').insertOne(NewEkonomi(id))
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
            const fields = req.body
            delete fields._id
            
            // For old entries which have no created date
            if (! fields.created) {
                const now = new Date();
                const wita = moment.tz(now.toISOString(), 'Asia/Makassar').format();
                fields.created = wita
            }
            
            console.log('req.body', fields)
            await db.collection('responden').findOneAndUpdate(
                { _id: _id },
                { $set: fields }
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
                        umur: req.body.umur,
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
                    umur: req.body.umur,
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

ACCEPTED_QUERIES['delete-responden'] = async function (req, res) {
    const { db, client } = await connect()
    const session = client.startSession()
    try {
        await session.withTransaction(async () => {
            const user = req.session.get("user");
            const { id } = req.query
            
            await db.collection('aset',).deleteOne({ _id: id })
            await db.collection('ekonomi').deleteOne({ _id: id })
            await db.collection('nelayan',).deleteOne({ _id: id })
            await db.collection('kesmas',).deleteOne({ _id: id })
            await db.collection('konflik',).deleteOne({ _id: id })
            await db.collection('observasi').deleteOne({ _id: id })
            await db.collection('persepsi',).deleteOne({ _id: id })
            
            await db.collection('anggota').deleteMany({ _idr: id })
            await db.collection('ternak').deleteMany({ _idr: id })
            await db.collection('ikan').deleteMany({ _idr: id })
            await db.collection('hutan',).deleteMany({ _idr: id })
            await db.collection('tanaman').deleteMany({ _idr: id })
            
            await db.collection('responden').deleteOne({ _id: id })
            
            return res.json({ message: 'OK' })
        })
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

ACCEPTED_QUERIES['save-ekonomi'] = async function (req, res) {
    const { db } = await connect()
    try {
        const user = req.session.get("user");
        const { idr, data } = req.body
        const fields = { ...data }
        delete fields._id
        
        if (data._id == 'NEW') {
            await db.collection('ekonomi').insertOne({
                _id: idr,
                ...fields
            })
        } else {
            await db.collection('ekonomi').findOneAndUpdate(
                {_id: data._id},
                { $set: fields }
            )
        }
        
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
        const fields = { ...data }
        delete fields._id
        
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
        const fields = { ...data }
        delete fields._id
        
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
        const fields = { ...data }
        delete fields._id
        
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
        const fields = { ...data }
        delete fields._id
        
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
        const fields = { ...data }
        delete fields._id
        
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
        const fields = { ...data }
        delete fields._id
        
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