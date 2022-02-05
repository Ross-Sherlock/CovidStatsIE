const weeklyFiguresXml = new XMLHttpRequest();
const weeklyFiguresUrl = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";
// Error string returned from API when url incorrect
const errorString = '{"error":{"code":400,"message":"Invalid URL","details":["Invalid URL"]}}';

// If successful, call populate weekly function else display error message
weeklyFiguresXml.onreadystatechange = () => {
    if (weeklyFiguresXml.readyState === 4 && weeklyFiguresXml.status === 200 && weeklyFiguresXml.responseText != (errorString)) {
        const weeklyParsed = JSON.parse(weeklyFiguresXml.responseText);
        populateWeekly(weeklyParsed);

    } else if ((weeklyFiguresXml.readyState === 4 && weeklyFiguresXml.status != 200) || weeklyFiguresXml.responseText == (errorString)) {
        document.getElementById("failed1").style.visibility = 'visible';
        document.getElementById("failed1").style.height = 'auto';
        document.getElementById("failed1").style.width = "auto";
        document.getElementById("failed1").style.margin = "5%";
    }
};

// Send GET request to weekly vaccines API
weeklyFiguresXml.open("GET", weeklyFiguresUrl, true);
weeklyFiguresXml.send();

const countyFiguresXml = new XMLHttpRequest();
const countyFiguresUrl = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

// If successful, call populatte county function else display error message
countyFiguresXml.onreadystatechange = () => {
    if (countyFiguresXml.readyState === 4 && countyFiguresXml.status === 200 && countyFiguresXml.responseText != (errorString)) {
        const countyParsed = JSON.parse(countyFiguresXml.responseText);
        populateCounty(countyParsed);
    } else if ((countyFiguresXml.readyState === 4 && countyFiguresXml.status != 200) || countyFiguresXml.responseText == (errorString)) {
        document.getElementById("failed2").style.visibility = 'visible';
        document.getElementById("failed2").style.height = 'auto';
        document.getElementById("failed2").style.width = "auto";
        document.getElementById("failed2").style.margin = "5%";
    }
};

// Send GET request to county figures API
countyFiguresXml.open("GET", countyFiguresUrl, true);
countyFiguresXml.send();

let weeklyFeatures = {};
let featuresReversed = {};
let index = 0;

// Function to populate the weekly stats section of the webpage
const populateWeekly = obj => {
    weeklyFeatures = obj.features;
    // Shift to remove first element - remove 2020 data
    weeklyFeatures.shift();
    // Clone features array and reverse it
    featuresReversed = [...weeklyFeatures];
    featuresReversed.reverse();
    // Set index to end of features
    index = weeklyFeatures.length - 1;
    // Create a new array of objectID's and week numbers
    let optionsArr = [];
    for (let i = 0; i < featuresReversed.length; i++) {
        objectId = featuresReversed[i].attributes.ObjectId - 2
        week_num = objectId + 1
        optionsArr.push("<option value=" + objectId + ">Week " + week_num + "</option>")

    }

    // Convert options array to string
    const optionsStr = optionsArr.join();

    // Populate dropdown with items
    document.getElementById("dropdownItems").innerHTML = optionsStr;
    window.onload = changeWeek();
    window.onload = changeCheckbox("unchecked")
    const value = document.getElementById('dropdownItems');
    value.addEventListener('change', changeCheckbox);
    value.addEventListener('change', changeWeek);
    const check = document.getElementById('percentage')
    check.addEventListener('change', changeCheckbox)
};



const changeWeek = () => {
    index = document.getElementById("dropdownItems").value;

    // Calculate cumulative total up until current index
    let cum_total = 0
    for (let i = 0; i <= index; i++) {
        cum_total += weeklyFeatures[i].attributes.TotalweeklyVaccines
    }

    // Display weekly vaccine values
    document.getElementById("cum-total-title").innerHTML = "Total Administered in 2021 to Week " + (parseInt(document.getElementById("dropdownItems").value) + 1);
    document.getElementById("cum-total").innerHTML = cum_total.toLocaleString('en-uk');
    document.getElementById("total-weekly").innerHTML = weeklyFeatures[index].attributes.TotalweeklyVaccines.toLocaleString('en-UK');
    document.getElementById("modernaNum").innerHTML = weeklyFeatures[index].attributes.Moderna.toLocaleString('en-UK');
    document.getElementById("pfizerNum").innerHTML = weeklyFeatures[index].attributes.Pfizer.toLocaleString('en-UK');
    document.getElementById("janssenNum").innerHTML = weeklyFeatures[index].attributes.Janssen.toLocaleString('en-UK');
    document.getElementById("astraNum").innerHTML = weeklyFeatures[index].attributes.AstraZeneca.toLocaleString('en-UK');

};

const changeCheckbox = () => {
    // If checkbox checked, convert to percentage
    if (document.getElementById("percentage").checked == false) {
        document.getElementById("age10to19").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age10to19.toLocaleString('en-UK');
        document.getElementById("age20to29").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age20to29.toLocaleString('en-UK');
        document.getElementById("age30to39").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age30to39.toLocaleString('en-UK');
        document.getElementById("age40to49").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age40to49.toLocaleString('en-UK');
        document.getElementById("age50to59").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age50to59.toLocaleString('en-UK');
        document.getElementById("age60to69").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age60to69.toLocaleString('en-UK');
        document.getElementById("age70to79").innerHTML = weeklyFeatures[index].attributes.FullyCum_Age70to79.toLocaleString('en-UK');
        document.getElementById("age80").innerHTML = weeklyFeatures[index].attributes.FullyCum_80_.toLocaleString('en-UK');
    } else {
        document.getElementById("age10to19").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age10to19 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age20to29").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age20to29 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age30to39").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age30to39 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age40to49").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age40to49 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age50to59").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age50to59 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age60to69").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age60to69 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age70to79").innerHTML = (weeklyFeatures[index].attributes.FullyPer_Age70to79 * 100).toLocaleString('en-UK') + "%";
        document.getElementById("age80").innerHTML = (weeklyFeatures[index].attributes.FullyPer_80_ * 100).toLocaleString('en-UK') + "%";

    }

};

let countyArr = [];
let proportionalArr = [];
let plainCountyNameArr = [];
let countyStr = [];
let countyFeatures = [];

// Function to populate county section of webpage
const populateCounty = obj => {
    countyFeatures = obj.features;

    // Make array of county names and array of html formatted county names
    for (let i = 0; i < obj.features.length; i++) {
        countyName = countyFeatures[i].attributes.CountyName;
        if (plainCountyNameArr.includes(countyName) == false) {
            plainCountyNameArr.push(countyName);
            proportionalArr.push(countyFeatures[i].attributes.PopulationProportionCovidCases);
            countyArr.push("<option value=" + i + ">" + countyName + "</option>");
        }
    }
    // Convert array to string
    countyStr = countyArr.join();

    // Populate dropdowns
    document.getElementById("dropdownCounty1").innerHTML = countyStr;
    document.getElementById("dropdownCounty2").innerHTML = countyStr;
    document.getElementById("dropdownCounty3").innerHTML = countyStr;

    // On load, display Dublin, Cork and Galway
    window.onload = changeCounty(1, 5);
    window.onload = changeCounty(2, 3);
    window.onload = changeCounty(3, 6);
    let highestRate = Math.max(...proportionalArr);
    let highestIndex = proportionalArr.indexOf(highestRate);
    let lowestRate = Math.min(...proportionalArr);
    let lowestIndex = proportionalArr.indexOf(lowestRate);
    let highestCounty = plainCountyNameArr[highestIndex];
    let lowestCounty = plainCountyNameArr[lowestIndex];
    document.getElementById("highestCounty").innerHTML = "<b>Highest COVID rate per 100,000</b> <br>" + highestCounty + ": " + highestRate.toLocaleString('en-UK');
    document.getElementById("lowestCounty").innerHTML = "<b>Lowest COVID rate per 100,000</b> <br>" + lowestCounty + ": " + lowestRate.toLocaleString('en-UK');
};

const changeCounty = (e, pageLoadIndex) => {
    // Event object will not be passed on load
    // Handle for integer on load
    if (Number.isInteger(e)) {
        dropdownId = "dropdownCounty" + e;
        statsId = "countyStats" + e;
        countyIndex = pageLoadIndex;
        document.getElementById(dropdownId).value = countyIndex;
        popId = "population" + e;
        casesId = "cases" + e;
        propId = "prop" + e;

    } else {
        dropdownId = e.target.id;
        dropdownNum = (e.target.id).slice(-1);
        statsId = "countyStats" + (e.target.id).slice(-1);
        popId = "population" + dropdownNum;
        casesId = "cases" + dropdownNum;
        propId = "prop" + dropdownNum;
        countyIndex = e.target.value;
    }

    population = countyFeatures[countyIndex].attributes.PopulationCensus16;
    document.getElementById(popId).innerHTML = population.toLocaleString('en-UK');
    cases = countyFeatures[countyIndex].attributes.ConfirmedCovidCases;
    document.getElementById(casesId).innerHTML = cases.toLocaleString('en-UK');
    proportion = (countyFeatures[countyIndex].attributes.PopulationProportionCovidCases).toFixed(2);
    document.getElementById(propId).innerHTML = proportion;

};

const countyVal1 = document.getElementById('dropdownCounty1');
countyVal1.addEventListener('change', changeCounty);
const countyVal2 = document.getElementById('dropdownCounty2');
countyVal2.addEventListener('change', changeCounty);
const countyVal3 = document.getElementById('dropdownCounty3');
countyVal3.addEventListener('change', changeCounty);