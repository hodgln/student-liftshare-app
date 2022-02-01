CREATE DATABASE testliftshare;

CREATE TABLE Liftshare(
    user_id SERIAL PRIMARY KEY,
    longitude VARCHAR(16),
    latitude VARCHAR(16),
    category VARCHAR(10),
    datepicked timestamptz
);

CREATE TABLE Liftshares(
    liftshare_id SERIAL PRIMARY KEY,
    user_id UUID,
    originlocation POINT,
    destinationlocation POINT,
    originname VARCHAR(16),
    destinationname VARCHAR(16),
    seats SMALLINT CHECK (seats >= 0),
    datepicked timestamptz,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

/* check if liftshare_id is properly referenced because of changing the data type */

CREATE TABLE Requests(
  request_id SERIAL PRIMARY KEY,
  liftshare_id SMALLINT,
  user_id UUID,
  /* add in status 'pending' or 'confirmed' */
  FOREIGN KEY (liftshare_id) references Liftshares(liftshare_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



CREATE TABLE Users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_firstname VARCHAR(255) NOT NULL,
  user_surname VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_account VARCHAR(255) NOT NULL
);

CREATE TABLE Conversations(
        conversation_id SERIAL PRIMARY KEY,
        driver_id UUID,
        passenger_id UUID,
        FOREIGN KEY (driver_id) REFERENCES Users(user_id),
        FOREIGN KEY (passenger_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages(
        conversation_id SMALLINT,
        sender_id UUID,
        text VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY (sender_id) REFERENCES Users(user_id),
        FOREIGN KEY (conversation_id) REFERENCES Conversations(conversation_id)
);

CREATE TABLE Ratings(
    user_id UUID,
    rating SMALLINT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Confirmations(
        confirmation_id SERIAL PRIMARY KEY,
        user_id UUID,
        code VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

/* look at paths and line segments for starting and ending latlong
compare starting and ending destination and add up the total distance and rank based on that number*/

CREATE ROLE postgres LOGIN SUPERUSER;

`SELECT l.user_id,
        l.category, 
        l.datepicked, 
        l.originname, 
        l.destinationname, 
        (l.originlocation <@> shef.originlocation) as distanceOne
        FROM Liftshare l, 
        lateral (select user_id, originlocation FROM Liftshare where user_id = ${userid}) 
        as shef 
        where l.user_id <> shef.user_id 
        order by distance;`

/* get request that searches for drivers closest to input route (below)*/

        `SELECT l.user_id,
        l.category, 
        l.datepicked, 
        l.originname, 
        l.destinationname, 
        (l.originlocation <@> $1) as distance 
        FROM Liftshare l 
        order by distance;`, [originlocation]
        )


/* https://launchschool.com/books/sql_first_edition/read/multi_tables for relating users id and liftshares id together*/


"SELECT
            l.liftshare_id,
            l.datepicked, 
            l.originname, 
            l.destinationname,
            u.user_email, 
            u.user_firstname, 
            user_surname 
            FROM Users AS u 
            INNER JOIN 
            Liftshares as l 
            ON u.user_id = l.user_id 
            WHERE u.user_id = $1"


'SELECT 
        l.datepicked,
        l.originname,
        l.destinationname,
        u.user_firstname,
        u.user_surname,
        r.liftshare_id,
        r.request_id,
        r.user_id
        FROM Requests AS r
        INNER JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
        INNER JOIN Users AS u ON u.user_id = l.user_id
        WHERE r.user_id = $1'






/* request for decrementing seat number =

"UPDATE Liftshares SET seats = seats - 1 WHERE liftshare_id = $1 AND user_id = $3 RETURNING *", 
[liftshare_id, driver_id]

/* request to join liftshare_id from requests inner join with liftshare_id from Liftshares; */


`SELECT 
        l.liftshare_id,
        l.datepicked, 
        l.originname, 
        l.destinationname,
        l.seats,
        l.liftshare_id,
        (l.originlocation <@> $1) as distance
        FROM Liftshares l 
        order by distance;`, [originlocation]
        );`

        ((l.originlocation <@> $1) + (l.destinationlocation <@> $2)) as distance`


        `SELECT 
        l.liftshare_id,
        l.datepicked, 
        l.originname, 
        l.destinationname,
        l.seats,
        l.liftshare_id,
        r.user_id
        FROM Liftshares l
        LEFT JOIN Requests AS r ON r.liftshare_id = l.liftshare_id
        WHERE r.user_id IS NOT $3`


        SELECT 
        l.liftshare_id,
        l.datepicked, 
        l.originname, 
        l.destinationname,
        l.seats,
        l.liftshare_id,
        r.user_id
        FROM Liftshares l
        RIGHT JOIN Requests AS r ON r.liftshare_id = l.liftshare_id
        WHERE r.user_id IS NULL OR r.user_id <> '2fd33a1a-6248-4f20-9032-cd23f0145464';`

        SELECT 
        l.liftshare_id,
        l.datepicked, 
        l.originname, 
        l.destinationname,
        l.seats,
        l.liftshare_id,
        r.user_id
        FROM Liftshares as l
        RIGHT JOIN Requests AS r ON r.liftshare_id = l.liftshare_id
        WHERE r.liftshare_id NOT IN (SELECT r.liftshare_id FROM Requests as r WHERE r.user_id = '2fd33a1a-6248-4f20-9032-cd23f0145464');



SELECT 
        l.liftshare_id,
        l.datepicked, 
        l.originname, 
        l.destinationname,
        l.seats,
        l.liftshare_id,
        r.user_id
        FROM Requests as r
        RIGHT JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
        WHERE l.liftshare_id NOT IN (SELECT r.liftshare_id FROM Requests as r WHERE r.user_id = '"; ');

        `/* this works for only allowing one request per user */


`INSERT INTO Liftshares 
(datepicked, 
originlocation, 
destinationlocation, 
originname, 
destinationname, 
seats, 
user_id)
VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ((originlocation <@> destinationlocation) * 0.159) as price`

"INSERT INTO Liftshares (datepicked, originlocation, destinationlocation, originname, destinationname, seats, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *"

"SELECT count(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = 10;"

`SELECT 
(SELECT count(*) WHERE r.status = 'confirmed'),
l.driverprice
FROM Requests AS r
INNER JOIN Liftshares as l ON r.liftshare_id = l.liftshare_id 
WHERE l.liftshare_id = $1`

`SELECT count(*) WHERE r.status = 'confirmed',
l.driverprice
FROM Requests AS r
INNER JOIN Liftshares as l ON r.liftshare_id = l.liftshare_id 
WHERE l.liftshare_id = $1`


`SELECT
            u.user_email, 
            u.user_firstname, 
            u.user_surname,
            u.user_account,
            u.phone_number,
            u.profile_picture,
            AVG(r.rating)
            FROM Users AS u
            INNER JOIN Ratings as r ON r.user_id = u.user_id
            WHERE u.user_id = $1
            GROUP BY u.user_firstname`

works


/* make two db tables, one CONVERSATION table with DRIVER and PASSENGER columns

another with messages, conversation id and sender columns

trial this and see if it works */




/*


*****
schedule a local notification on the accepted request for the driver onPress of the accepted request

schedule a local notification if the push notification is clicked by the passenger


*****
alternatively, use a cron job that checks every day at 8am? for dates of liftshares and requests that are confirmed, then send out push notifcations to all of those users. 

*/



/*

requests

add status of completed lift and then link to rating table with headers of:
rating id, driver, passenger, rating - reference user id from the liftshare

select requests where liftshare_id = this and r.status = completed

will need to get the time of the journey for this to happen.

//put component over mylifts!!!! can always put a little badge reminder thing in there and a notification

status changes to completed once the journey has been scanned. 

use request user_ids to rate passengers, use liftshare user_ids to rate drivers. 

make rating page/pop up component that can only be closed once the stars have been done

think about how it is triggered

if liftshare status != completed then show popupcomponent, else rest of app. 

*/











/* select the ratings where liftshare_id = $1 and where user_id is not req.user.id
 if this count does not 

 add submitted by and liftshare_id 

 passenger side check for just one, driver side check for as many as there are seats, return count in the same db query