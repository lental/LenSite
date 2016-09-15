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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_done` tinyint(1) NOT NULL DEFAULT 0,
  `done_at` timestamp NOT NULL DEFAULT 0,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
1 row in set (0.00 sec)</pre>

<pre>
mysql> show create table blog_posts\G
*************************** 1. row ***************************
       Table: blog_posts
Create Table: CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) DEFAULT NULL,
  `body` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
1 row in set (0.09 sec)
</pre>

<pre> 

mysql> show create table portfolio_projects\G
*************************** 1. row ***************************
       Table: portfolio_projects 
CREATE TABLE `portfolio_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) DEFAULT NULL,
  `body` text,
  `thumbnail_image` varchar(512),
  `detailed_image` varchar(512),
  `redirect_url` varchar(512),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) 
</pre>


insert into portfolio_projects (title, body, thumbnail_image, detailed_image, redirect_url) values 
("Mass Warfare",
"Mass Warfare was an idea for a massively multiplayer casual/idler game.  Every user is randomly assigned a team.  These users all control an army unit that spawns from their root node, running randomly to the enemy root node.  Just by keeping the site open, users will continue to spawn units for the team.  However, the user can also define a route that they want their units to travel by clicking on their root node, and dragging a path to the enemy node. Doing so can add a tactical advantage to your team's army, reinforcing specific areas in the front line. 

MassWarfare was my first actual attempt at a long-lived application, and I'm pretty happy it still runs (when the heroku instance is up). The game logic is pretty much done, and it needed a little more UX polish and tutorial to make it interesting. Some of the harder challenges was to ensure people don't spoof the game into making multiple accounts.

This application uses: node.js, heroku, and mysql. I use Raphael to render the application entirely in SVG.  This makes the app work just fine on both Android and iOS browsers.",

"/images/portfolio/masswarfarethumb.png",
"/images/portfolio/masswarfarefull.png",
"https://masswarfare.herokuapp.com/")
