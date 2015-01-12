LenSite
=======

LenSite
Dev:
  to start: node app

Daemonized:
  to start: sudo node daemon start
  to stop: sudo node daemon stop
  to restart: sudo node daemon restart


You will need:
config/config with gplus client ID and secret

exports.gplus = {
  clientId:"id",
  clientSecret:"secret"
};

exports.session = {
  secretKey:"another_secret"
};


create table tasks ( id int auto_increment primary key, is_done bit, description varchar(255), done_at timestamp, created_at timestamp not null default CURRENT_TIMESTAMP );