LenSite
=======

# To Initialize the Repo

1. npm install
2. bower install


LenSite
Dev:
  to start: node app

Daemonized:
  to start: sudo node daemon start
  to stop: sudo node daemon stop
  to restart: sudo node daemon restart


You will need:
the following environment variables created
<pre>
export LENSITE_GPLUS_CLIENT_ID=
export LENSITE_GPLUS_SECRET=
export LENSITE_SESSION_SECRET_KEY=
export LENSITE_DB_USER=
export LENSITE_DB_PASSWORD=
export LENSITE_DB_HOSTNAME="
export LENSITE_DB_DATABASE_NAME=
export NEW_RELIC_LICENSE_KEY=
</pre>

<pre>
mysql> show create table users\G
*************************** 1. row ***************************
       Table: users
Create Table: CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gplus_id` varchar(255) DEFAULT NULL,
  `can_add` tinyint(1) DEFAULT NULL,
  `can_remove` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8
1 row in set (0.00 sec)
</pre>


<pre>
mysql> show create table tasks\G
*************************** 1. row ***************************
       Table: tasks
Create Table: CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `is_done` tinyint(1) DEFAULT NULL,
  `done_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_hidden` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
1 row in set (0.00 sec)</pre>

<pre>
mysql> show create table blog_posts_test\G
*************************** 1. row ***************************
       Table: blog_posts_test
Create Table: CREATE TABLE `blog_posts_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) DEFAULT NULL,
  `body` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8
1 row in set (0.00 sec)
</pre>
