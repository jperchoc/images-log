import { parse } from 'node-html-parser';
import fs from 'fs'; 

const intervalHours = Number(process.env.HOURS || 1);
const intervalMinutes = Number(process.env.MINUTES || 0);
const intervalSeconds = Number(process.env.SECONDS || 0);

const LIGHT_THRESHOLD = Number(process.env.LIGHT_THRESHOLD || 50);
const API_URL = process.env.API_URL || 'http://0.0.0.0:8080'

const interval = 1000 * (intervalSeconds + 60 * intervalMinutes + 60 * 60 * intervalHours);


console.log(intervalHours);
console.log(intervalMinutes);
console.log(intervalSeconds);


console.log("Starting application");
console.log("*****************");
console.log(`*  HOURS   = ${pad(intervalHours, 2)} *`);
console.log(`*  MINUTES = ${pad(intervalMinutes, 2)} *`);
console.log(`*  SECONDS = ${pad(intervalSeconds, 2)} *`);
console.log("*****************");
console.log(`interval in ms: ${interval}`);





function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

async function getSensorsData() {
    const response = await fetch(`${API_URL}/sensors`);
    return await response.json();
}

async function fetchImage() {
    try {
        const sensorsData = await getSensorsData();
        const lightSensor = sensorsData.sensors.filter(sensor => sensor.measurement = 'light')[0];
        console.log(`Light value is ${lightSensor.value} lux`);
        if (lightSensor.value > LIGHT_THRESHOLD) {
            const response = await fetch(`${API_URL}/camera`);
            const htmldata = await response.text();
            const parsedHtml = parse(htmldata);
            const imageData = parsedHtml.firstChild.attrs.src;
            const filteredImageData = imageData.replace(/^data:image\/jpg;base64,/, "");
            const buffer = Buffer.from(filteredImageData, 'base64');

            const now = new Date();
            const [date, time] = now.toISOString().split('T');
            const [hours, minutes, seconds] = time.split('.')[0].split(':');
            const dir = `images/${date}`
            if (!fs.existsSync(dir)){
                console.log(`Creating directory ${dir}`);
                fs.mkdirSync(dir);
            }

            console.log(`Writing image ${dir}/${hours}-${minutes}-${seconds}.jpg`);
            fs.writeFile(`${dir}/${hours}-${minutes}-${seconds}.jpg`, buffer, err => {
                if (err) console.log(err);
            })
        }
    } 
    catch(e) {
        console.log(e);
    }
}

await fetchImage();
setInterval(async () => {
    await fetchImage();
}, interval);