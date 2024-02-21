const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON data

app.post('/runtask', (req, res) => {
    const { script, driver } = req.body;

    // Log the received script and driver values for debugging
    console.log('Received script:', script);
    console.log('Received driver:', driver);

    // Map script names to their corresponding file names
    const scriptFiles = {
        'AppTest': 'AppTest.java',
        'BrowserTest': 'BrowserTest.java'
    };

    // Update TestDriver.java with the selected driver
    const driverPath = `../drivers/${driver}`;
    const testDriverPath = 'src/test/java/com/example/driver/TestDriver.java';
    fs.readFile(testDriverPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // Update the driver property based on the selected driver
        const updatedData = data.replace(/System\.setProperty\("webdriver\.chrome\.driver", "..\/drivers\/.*?"/, `System.setProperty("webdriver.${driver.toLowerCase()}.driver", "${driverPath}")`);
        fs.writeFile(testDriverPath, updatedData, 'utf8', err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Execute the test script
            const command = `mvn -f pom.xml clean test -Dtest=com.example.scripts.${scriptFiles[script]}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Internal Server Error');
                }
                console.log(stdout);
                console.error(stderr);

                // Return the test result
                const reportPath = 'target/surefire-reports/emailable-report.html';
                fs.readFile(reportPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    res.send(data);
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
