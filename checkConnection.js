const oracledb = require('oracledb');
const http = require('http');
const fs = require('fs');
const url = require('url');
const hostname = 'localhost';
const port = 8000;

var password;
fs.readFile('password.txt', 'utf8', function(err, data) {
      if (err) throw err;
      password = data;
    });

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

            if (questionId == '0') return getCount();
            else if (questionId == '1')  return query1();
            else if (questionId == '2') return query2();
            else if (questionId == '3') return query3();
            else if (questionId == '4') return query4();
            else if (questionId == '5') return query5();
            else if (questionId == '6') return query6();

      } catch (e) {
            console.error(e.message);
      }

}

/* COUNT TUPLES */
async function getCount() {
      result = await connection.execute(`
      SELECT a.num + b.num 
      FROM (
          SELECT COUNT(*) num 
          FROM cases
          ) a, (
          SELECT count(*) num 
          FROM arrests 
          ) b
      `);

      console.log(result);
      return result.rows;
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
                        AND EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) = 2023
                        )
                  )
            WHERE timeframe IS NOT NULL
            GROUP BY day, timeframe
            )
            GROUP BY timeframe
            ORDER BY timeframe
      `);

      console.log(result);
      return result.rows;
}

/* QUERY 2*/
/* What is the average time (in days) between a crime and its first arrest if an arrest was made for the year 2022 */
async function query2() {
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
 
}

/* QUERY 3 */
/* What are the top 3 rising types of crime over the last 9 years? */
async function query3() {
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
                ) rising_crimes 
                JOIN 
                Cases ON rising_crimes.crime_type = Cases.crime_type
            GROUP BY EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')), Cases.crime_type
            ORDER BY year, crime_type
      `);

      console.log(result);
      return result.rows;
}

/* QUERY 4 */
/* What is the difference in trends between two crime types (that the user selects) versus 
others within a specific district?*/
async function query4() {
      data = [4, 'THEFT', 4, 'ASSAULT', 4, 'THEFT', 'ASSAULT'];
      result = await connection.execute(`
            SELECT a.yr, acount as type1, bcount as type2, ccount as "Others"
            FROM (
                    select crime_type, EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) yr, count(*) acount
                    from Cases
                    where (location_district = :1) and (crime_type = :2) /* allow user to select first crime of choice */
                    group by crime_type, EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'))
                    ) a
                    JOIN 
                    (
                    select crime_type, EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) yr, count(*) bcount
                    from Cases
                    where (location_district = :3) and (crime_type = :4) /* allow user to select second crime of choice*/
                    group by crime_type, EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'))
                    ) b on a.yr = b.yr
                    JOIN 
                    (
                    select EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM')) yr, count(*) ccount
                    from Cases
                    where (location_district = :5) 
                    and crime_type not in (
                                            select c.crime_type
                                            from Cases c
                                            where crime_type = :6 or crime_type = :7
                                            )
                    group by EXTRACT(YEAR FROM TO_DATE(dateofcrime, 'MM/DD/YYYY HH:MI:SS AM'))
                    ) c on a.yr = c.yr
            ORDER BY a.yr ASC
            `, data);
            
      console.log(result);
      return result.rows;
}

/* QUERY 5 */
/* Does the ratio of no arrests in comparison to crimes each year affect how much Area 5 residents trust in the police? */
async function query5() {
      result = await connection.execute(`
            
      `);

      console.log(result);
      return result.rows;
}

/* QUERY 6 */
/* */
async function query6() {
      result = await connection.execute(`
            
      `);

      console.log(result);
      return result.rows;
}