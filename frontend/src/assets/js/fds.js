const csvFilePath = '/csv/phishing-address.csv';

let dataArray = [];

async function readCSVFile() {
    const response = await fetch(csvFilePath);
    if (response.ok) {
        const csvText = await response.text();
        dataArray = csvText.split(/\r?\n/);
        console.log('CSV file successfully processed');
    } else {
        console.error('Error fetching CSV file:', response.statusText);
    }
}


async function isTargetPhising(targetAddress) {
    if (dataArray.length === 0) {
        await readCSVFile();
    }

    const isTargetInArray = dataArray.includes(targetAddress);
    console.log(`Target address ${targetAddress} is${isTargetInArray ? '' : ' not'} in the CSV-driven array.`);
    return isTargetInArray;
}

export { isTargetPhising }