const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "FARM",
  password: "",
});

function queryMysql(str_query) {
  return new Promise((resolve, reject) => {
    connection.query(str_query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = queryMysql;
