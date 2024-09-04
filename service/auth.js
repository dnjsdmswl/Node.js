const bcrypt = require("bcrypt");
const {
  saveUser,
  findOneUserByUserId,
  findOneUserById,
  updateAccessToken,
  deltoken,
} = require("../model/repository");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { userId, password } = req.body;

  const thisUser = await findOneUserByUserId(userId);
  if (thisUser) {
    res.status(409).send("이미 가입된 아이디입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await saveUser(userId, hashedPassword);

  return res.status(201).json({
    id: user.id,
  });
};

const login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await findOneUserByUserId(userId);
    const accesstoken = await generateAccessToken(user.id);
    await updateAccessToken(user.id, accesstoken);

    if (!user) {
      return res.status(404).send("가입되어 있지 않은 아이디입니다.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("비밀번호가 틀렸습니다.");
    }

    return res.status(201).json({
      id: user.user_id,
      token: accesstoken,
    });
  } catch (e) {
    console.error(e);
    return e;
  }
};

const generateAccessToken = async (id) => {
  const key = process.env.SECRET_OR_PRIVATE;

  const accesstoken = jwt.sign(
    {
      id,
    },
    key,
    {
      algorithm: "HS256",
      expiresIn: "1h",
    }
  );

  return accesstoken;
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header가 없습니다.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "토큰이 없습니다.1",
      });
    }

    const key = process.env.SECRET_OR_PRIVATE;
    const decoded = jwt.verify(token, key);
    const { id } = decoded;

    if (!id) {
      return res.status(401).json({
        error: "토큰에 유효한 ID가 포함되어 있지 않습니다.",
      });
    }

    const thisUser = await findOneUserById(id);
    console.log(thisUser);
    console.log(thisUser.accesstoken);
    if (!thisUser || !thisUser.accesstoken) {
      return res
        .status(401)
        .send("잘못된 토큰이거나 유효한 사용자가 없습니다.");
    }
    await deltoken(id);
    return res.status(200).send("로그아웃이 되었습니다");
  } catch (e) {
    console.error(e);
    return e;
  }
};

const signout = async (req, res) => {
  try {
    const { id, password } = req.body;
    const thisUser = await findOneUserById(id);
    console.log(password);
    console.log(thisUser.password);
    if (!(await bcrypt.compare(password, thisUser.password))) {
      return res.status(401).json({
        error: "비밀번호가 일치하지 않습니다.",
      });
    }
    await thisUser.destroy();

    return res.status(204).json("회원탈퇴에 성공하였습니다");
  } catch (e) {
    console.error(e);
    return e;
  }
};

module.exports = {
  signup,
  login,
  logout,
  generateAccessToken,
  signout,
};
