const mysql = require('mysql');
const fs = require('fs'); 

// Luetaan config
const configFile = fs.readFileSync('config.cfg', 'utf-8');
const configLines = configFile.split('\n');

const dbConfig = {};

configLines.forEach((line) => {
    if(line.includes('=')) {
        const[key, value] = line.split('=');
        dbConfig[key.trim()] = value.trim();
    }
});

// Luodaan MySQL yhteys
const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
});

connection.connect((err) => {

    if(err) throw err;
        console.log('Yhdistetty');


    connection.query("CREATE DATABASE IF NOT EXISTS shoppingList", (err) => {
        if (err) throw err;
    });

    connection.changeUser({ database: 'shoppingList' }, (err) => {
        if (err) throw err;
    });

    const sqlLuontiScripti = [
        `CREATE TABLE IF NOT EXISTS item (
            id INT PRIMARY KEY AUTO_INCREMENT,
            description VARCHAR(255) NOT NULL,
            amount SMALLINT UNSIGNED NOT NULL
        )`,
        `INSERT INTO item (description,amount) VALUES ('Test item',1)`,
        `INSERT INTO item (description,amount) VALUES ('Test item2',2)`,
        `INSERT INTO item (description,amount) VALUES ('Test item3',3)`,
        `INSERT INTO item (description,amount) VALUES ('Test item4',4)`
    ];

    sqlLuontiScripti.forEach((command) => { 
    connection.query(command, (err, result, fields) => {
        if(err) throw err;
            console.log("Luodaan table, lisätään testirivejä.");
        });
    });

    //Kysellään data JSON muodossa ja tulostetaan consoleen
    connection.query("SELECT * FROM item", (err, results, fields) => { 
        if(err) throw err;
        console.log("Suoritetaan kysely.")
        console.log(JSON.stringify(results));
    });

    //Katkaistaan yhteys
    connection.end((err) => { 
        if(err) throw err;
            console.log('Yhteys katkaistu.');
    });
});