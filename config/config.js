
exports.gplus = {
  clientId:process.env.LENSITE_GPLUS_CLIENT_ID,
  clientSecret:process.env.LENSITE_GPLUS_CLIENT_SECRET
};

exports.session = {
  secretKey:process.env.LENSITE_SESSION_SECRET_KEY
};


exports.mysql = {
  host:process.env.LENSITE_DB_HOSTNAME,
  user:process.env.LENSITE_DB_USER,
  password:process.env.LENSITE_DB_PASSWORD,
  database:process.env.LENSITE_DB_DATABASE_NAME
};
