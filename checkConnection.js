const oracledb = require('oracledb');
const http = require('http');
const hostname = 'localhost';
const port = 8000;

var password = 'VBGOIPdqRcM1YwtK2bFukWk5';

const server = http.createServer(function (req, res) {
      res.writeHead(200, { "Content-Type": "text/plain" });

      // Send the response body "Hello World"
      res.end("Hello World\n");
});

server.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function checkConnection() {
      let connection;
      
      try {
            connection = await oracledb.getConnection({
                  user: 'lauren.bartyczak',
                  password: password,
                  connectString: 'oracle.cise.ufl.edu:1521/orcl'
            });
            console.log('connected to db');

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
                        WHERE EXTRACT(MONTH FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = EXTRACT(MONTH FROM TO_DATE('MAR', 'MON'))
                        AND EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = EXTRACT(YEAR FROM TO_DATE('2022', 'YYYY'))
                        )
                    )
                WHERE timeframe IS NOT NULL
                GROUP BY day, timeframe
                )
            GROUP BY timeframe
            ORDER BY timeframe
            `);
            console.log(result);
      } catch (e) {
            console.error(e.message);
      } finally {
            if (connection) {
                  try {
                        await connection.close();
                        console.log('closed connection');
                  } catch (e) {
                        console.error(e.message);
                  }
            }
      
      }
}

checkConnection();