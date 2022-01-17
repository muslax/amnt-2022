import { ObjectId } from "mongodb";
import withSession from "lib/session";
import { connect } from "lib/mongodb";
import { ModelResponden } from "lib/models";

const ACCEPTED_QUERIES = {}

export default withSession(async (req, res) => {
    const user = req.session.get("user");

  if (!user || user.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
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

ACCEPTED_QUERIES['daftar'] = async function (req, res) {
    try {
        const user = req.session.get("user");
        const { db } = await connect();
        const { id } = req.query;
        
        const rs = await db.collection('responden').aggregate([
            { $match: {}},
            { $lookup: {
                from: 'users',
                localField: '_user',
                foreignField: '_id',
                as: 'user'
            }},
            { $unwind: "$user" },
            { $project: {
                _user: 1,
                nama: 1,
                desa: 1,
                tanggal: 1,
                // "user.fullname": 1,
                'enumerator': "$user.fullname",
            }}
        ]).toArray()

        // const rs = await db.collection('responden').find(
        //     {},
        //     { projection: {
        //         _user: 1,
        //         nama: 1,
        //         desa: 1,
        //         tanggal: 1,
        //     }}
        // ).toArray()

        return res.json( rs );
    } catch (error) {
        return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['responden'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
  
      if (!id) return res.status(404).json({ message: 'Not found' })
  
      const rs = await db.collection('responden').findOne({ _id: id });
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['anggota'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { idr } = req.query;
  
      if (!idr) return res.status(404).json({ message: 'Not found' })
  
      const rs = await db.collection('anggota').find({ _idr: idr }).toArray();
      console.log(rs)
  
    //   if (!rs) return res.status(404).json([])
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['tanaman'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { idr } = req.query;
  
      if (!idr) return res.status(404).json({ message: 'Not found' })
  
      const rs = await db.collection('tanaman').find({ _idr: idr }).toArray();
      console.log(rs)
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['ternak'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { idr } = req.query;
  
      if (!idr) return res.status(404).json({ message: 'Not found' })
  
      const rs = await db.collection('ternak').find({ _idr: idr }).toArray();
      console.log(rs)
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['ikan'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { idr } = req.query;
  
      if (!idr) return res.status(404).json({ message: 'Not found' })
  
      const rs = await db.collection('ikan').find({ _idr: idr }).toArray();
      console.log(rs)
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['hutan'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { idr } = req.query;
  
      if (!idr) return res.status(404).json({ message: 'Not found' })
  
      const rs = await db.collection('hutan').find({ _idr: idr }).toArray();
      console.log(rs)
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['aset'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
      
      if (!id) return res.status(404).json({ message: 'Not found' })
      
      const rs = await db.collection('aset').findOne({ _id: id });
      console.log("aset id", rs)
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['nelayan'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
      
      if (!id) return res.status(404).json({ message: 'Not found' })
      
      const rs = await db.collection('nelayan').findOne({ _id: id });
    //   console.log("aset id", rs)
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['konflik'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
      
      if (!id) return res.status(404).json({ message: 'Not found' })
      
      const rs = await db.collection('konflik').findOne({ _id: id });
    //   console.log("aset id", rs)
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['kesmas'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
      
      if (!id) return res.status(404).json({ message: 'Not found' })
      
      const rs = await db.collection('kesmas').findOne({ _id: id });
    //   console.log("aset id", rs)
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['observasi'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
      
      if (!id) return res.status(404).json({ message: 'Not found' })
      
      const rs = await db.collection('observasi').findOne({ _id: id });
    //   console.log("aset id", rs)
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}

ACCEPTED_QUERIES['persepsi'] = async function (req, res) {
    try {
      const { db } = await connect();
      const { id } = req.query;
      
      if (!id) return res.status(404).json({ message: 'Not found' })
      
      const rs = await db.collection('persepsi').findOne({ _id: id });
    //   console.log("aset id", rs)
  
      if (!rs) return res.status(404).json({ message: 'Not found' })
  
      return res.json( rs );
    } catch (error) {
      return res.status(error.status || 500).end(error.message)
    }
}