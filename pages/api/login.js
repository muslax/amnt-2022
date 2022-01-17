import withSession from "lib/session";
import { connect } from "lib/mongodb";
import { MONGO_DOC } from "lib/config";

export default withSession(async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const { db } = await connect();
    const rs = await db.collection(MONGO_DOC.Users).findOne({ username: username});

    console.log("RS", rs)

    if (!rs) {
      return res.status(404).json({ message: "[01] Username/password salah." });
    }

    // const verified = bcrypt.compareSync(password, rs.hash);
    // Temporarily using simple trick
    const verified = password == rs.xfpwd.split('').reverse().join('')
    if (!verified) {
      return res.status(404).json({ message: "[02] Username/password salah." });
    }

    const user = {
      isLoggedIn: true,
      _id: rs._id,
      fullname: rs.fullname,
      username: rs.username,
      type: rs.type,
    }

    req.session.set("user", user);
    await req.session.save();
    return res.json(user);
  } catch (error) {
    res.status(404);
    res.json({ message: "[3] Username/password salah." });
  }
});
