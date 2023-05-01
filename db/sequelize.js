const { Sequelize, DataTypes } = require("sequelize");
const uniqid = require('uniqid');

const sequelize = new Sequelize("iera", "root", "root", {
  port: 3306,
  dialect: "mysql",
});

const Role = sequelize.define("role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  access_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3,
    },
  },
});

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const News = sequelize.define("news", {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(["approved" , "rejected" , "pending"])
  },
  img: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING
  }
}, {
  hooks: {
    beforeValidate: (news, options) => {
      news.id = uniqid(); // generate a unique ID for each record
    }
  }
});

const Event = sequelize.define("events", {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(["approved" , "rejected" , "pending"])
  },
  img: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING
  }
}, {
  hooks: {
    beforeValidate: (event, options) => {
      event.id = uniqid(); 
    }
  }
});

const Request = sequelize.define("requests" , {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postId: {
    type: DataTypes.STRING
  },
})

const Subscribe = sequelize.define("subscribers", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

User.belongsTo(Role , {foreignKey: "roleId"})
News.belongsTo(User , {foreignKey: "authorId"})
Event.belongsTo(User , {foreignKey: "authorId"})
module.exports = { sequelize, Role, User, News, Request , Event,Subscribe};
