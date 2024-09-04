const { Op, QueryTypes } = require("sequelize");
const { user, sequelize } = require("./");

const saveUser = async (id, password) => {
  const result = await user.create({ user_id: id, password: password });

  return result;
};

const findOneUserByUserId = async (id) => {
  const thisUser = await user.findOne({ where: { user_id: id } });
  return thisUser;
};

const findOneUserById = async (id) => {
  const thisUser = await user.findOne({ where: { id }});

  return thisUser;
}

const updateAccessToken = async (id, accesstoken) => {
  const result = await user.update(
    { accesstoken: accesstoken },
    {
      where: {
        id,
      },
    }
  );
  return result;
};

const deltoken = async (id) => {
  const result = await user.update(
    { accesstoken: "" },
    {
      where: {
        id,
      },
    }
  );
  return result;
};

module.exports = {
  saveUser,
  findOneUserByUserId,
  findOneUserById,
  updateAccessToken,
  deltoken,
};
