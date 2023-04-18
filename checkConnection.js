const oracledb = require('oracledb');
const http = require('http');
const fs = require('fs');
const url = require('url');
const hostname = 'localhost';
const port = 8000;

var password = 'VBGOIPdqRcM1YwtK2bFukWk5';

const server = http.createServer(async function (req, res) {
      const requestUrl = url.parse(req.url, true);
      if (requestUrl.pathname.startsWith('/get-data')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            const questionId = requestUrl.query.questionId;

            try {
                  const data = await getData(questionId);
                  res.end(JSON.stringify(data));
            } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
            }
      }
      else if (requestUrl.pathname.startsWith('/')) {
            fs.readFile('templates/index.html', 'utf-8', (err, content) => {
                  if (err) {
                        console.log('Error reading index.html:', err);
                        res.end();
                  } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.write(content);
                        res.end();
                  }
            });
      }
      else {
            res.writeHead(404);
            res.end();
      }
});

server.listen(port, hostname, function () {
      console.log(`Server running at http://${hostname}:${port}/`);
});

async function getData(questionId) {
      let connection;

      try {
            connection = await oracledb.getConnection({
                  user: 'lauren.bartyczak',
                  password: password,
                  connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });
            console.log('connected to db');

            if (questionId == '1')  return query1();
            else if (questionId == '2') return query2();
            else if (questionId == '3') return query3();

      } catch (e) {
            console.error(e.message);
      }

}

/* QUERY 1*/
/* What is the average crime ocurrance across the hours of the day for the month of March, 2023? */
async function query1() {
      result = await connection.execute(`
            SELECT timeframe, ROUND(AVG(num),2) avg_hourly_crimerate
            FROM (
            SELECT timeframe, COUNT(*) num
            FROM (
                  SELECT CASE
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 0 THEN '00:00-00:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 1 THEN '01:00-01:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 2 THEN '02:00-02:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 3 THEN '03:00-03:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 4 THEN '04:00-04:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 5 THEN '05:00-05:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 6 THEN '06:00-06:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 7 THEN '07:00-07:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 8 THEN '08:00-08:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 9 THEN '09:00-09:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 10 THEN '10:00-10:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 11 THEN '11:00-11:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 12 THEN '12:00-12:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 13 THEN '13:00-13:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 14 THEN '14:00-14:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 15 THEN '15:00-15:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 16 THEN '16:00-16:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 17 THEN '17:00-17:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 18 THEN '18:00-18:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 19 THEN '19:00-19:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 20 THEN '20:00-20:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 21 THEN '21:00-21:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 22 THEN '22:00-22:59'
                        WHEN TO_CHAR(TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'), 'HH24') = 23 THEN '23:00-23:59'
                        END timeframe,
                        EXTRACT(DAY FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) day
                  FROM (
                        SELECT * 
                        FROM CASES
                        WHERE EXTRACT(MONTH FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = 03
                        AND EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = 2022
                        )
                  )
            WHERE timeframe IS NOT NULL
            GROUP BY day, timeframe
            )
            GROUP BY timeframe
            ORDER BY timeframe
            `);
      return result.rows;
}

/* QUERY 2*/
/* What is the average time (in days) between a crime and its first arrest if an arrest was made for the year 2022 */
async function query2() {
      let connection;

      try {
            connection = await oracledb.getConnection({
                  user: 'lauren.bartyczak',
                  password: password,
                  connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });
            console.log('connected to db');

            result = await connection.execute(`
            SELECT month, ROUND(AVG(
                  EXTRACT(MINUTE FROM timediff) +
                  EXTRACT(HOUR FROM timediff) * 60 +
                  EXTRACT(DAY FROM timediff) * 60 * 24) / 60 / 24, 2) avgtime
            FROM (
                  SELECT Crimes_2022.month, firstarrestdate - 
                        TO_TIMESTAMP(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM') timediff
                  FROM (
                        SELECT EXTRACT(MONTH FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) month, Cases.*
                        FROM Cases
                        WHERE EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = 2022
                        ) Crimes_2022 
                        JOIN (
                        SELECT casenumber, TO_TIMESTAMP(MIN(TO_TIMESTAMP(dateofarrest, 'MM/DD/YYYY HH:MI:SS AM'))) firstarrestdate
                        FROM Arrests
                        WHERE casenumber IS NOT NULL
                        GROUP BY casenumber
                      ) First_Arrests ON Crimes_2022.casenumber = First_Arrests.casenumber
                  )
              GROUP BY month
              ORDER BY month
            `);
            console.log(result);
            return result.rows;
      } catch (e) {
            console.error(e.message);
      }
}

/* QUERY 3 */
/* What are the top 3 rising types of crime over the last 9 years? */
async function query3() {
      let connection;

      try {
            connection = await oracledb.getConnection({
                  user: 'lauren.bartyczak',
                  password: password,
                  connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });
            console.log('connected to db');

            result = await connection.execute(`
            SELECT EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) year, Cases.crime_type, count(*)
            FROM (
                SELECT * 
                FROM (
                    SELECT crimes_2014.crime_type, crimes_2022.counts - crimes_2014.counts diff
                    FROM (
                        SELECT crime_type, COUNT(*) counts
                        FROM Cases
                        WHERE EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = 2014
                        GROUP BY crime_type
                        ) crimes_2014, (
                        SELECT crime_type, COUNT(*) counts
                        FROM Cases 
                        WHERE EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = 2022
                        GROUP BY crime_type
                        ) crimes_2022
                    WHERE crimes_2014.crime_type = crimes_2022.crime_type
                    ORDER BY diff DESC
                    )
                WHERE ROWNUM <= 3
                ) rising_crimes JOIN Cases ON rising_crimes.crime_type = Cases.crime_type
            GROUP BY EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')), Cases.crime_type
            ORDER BY year, crime_type
            `);
            console.log(result);
            return result.rows;
      } catch (e) {
            console.error(e.message);
      }
}
