document.getElementById('risk-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const bmi = parseFloat(document.getElementById('bmi').value);
    const bloodPressure = parseInt(document.getElementById('blood-pressure').value);
    const hypertensionMedications = document.getElementById('hypertension-medications').value;
    const prInterval = parseInt(document.getElementById('pr-interval').value);
    const murmur = document.getElementById('murmur').value;
    const heartFailure = document.getElementById('heart-failure').value;
    
    const risk = calculateRisk(age, gender, bmi, bloodPressure, hypertensionMedications, prInterval, murmur, heartFailure);
    
    document.getElementById('result').innerText = `Your 10-year AFib risk is ${risk}%`;
});

function calculateRisk(age, gender, bmi, bloodPressure, hypertensionMedications, prInterval, murmur, heartFailure) {
    let score = 0;

    // Step 1 - Age X Demographic Score
    if (gender === 'female') {
        if (age >= 45 && age <= 49) score -= 3;
        else if (age >= 50 && age <= 54) score -= 2;
        else if (age >= 55 && age <= 59) score += 0;
        else if (age >= 60 && age <= 64) score += 1;
        else if (age >= 65 && age <= 69) score += 3;
        else if (age >= 70 && age <= 74) score += 4;
        else if (age >= 75 && age <= 79) score += 6;
        else if (age >= 80 && age <= 84) score += 7;
        else if (age >= 85) score += 8;
    } else {
        if (age >= 45 && age <= 49) score += 1;
        else if (age >= 50 && age <= 54) score += 2;
        else if (age >= 55 && age <= 59) score += 3;
        else if (age >= 60 && age <= 64) score += 4;
        else if (age >= 65 && age <= 69) score += 5;
        else if (age >= 70 && age <= 74) score += 6;
        else if (age >= 75 && age <= 79) score += 7;
        else if (age >= 80 && age <= 84) score += 7;
        else if (age >= 85) score += 8;
    }

    // Step 2 - Blood Pressure Score
    if (bloodPressure >= 160) score += 1;

    // Step 3 - Hypertension Score
    if (hypertensionMedications === 'yes') score += 1;

    // Step 4 - BMI Score
    if (bmi >= 30) score += 1;

    // Step 5 - PR Interval Score
    if (prInterval >= 160 && prInterval <= 199) score += 1;
    else if (prInterval >= 200) score += 2;

    // Step 6 - Murmur Score
    if (murmur === 'yes') {
        if (age >= 45 && age <= 54) score += 5;
        else if (age >= 55 && age <= 64) score += 4;
        else if (age >= 65 && age <= 74) score += 2;
        else if (age >= 75 && age <= 84) score += 1;
    }

    // Step 7 - Heart Failure Score
    if (heartFailure === 'yes') {
        if (age >= 45 && age <= 54) score += 10;
        else if (age >= 55 && age <= 64) score += 6;
        else if (age >= 65 && age <= 74) score += 2;
    }

    // Final Step - Total Points and Risk Estimates
    let risk;
    if (score <= 0) risk = 1;
    else if (score === 1) risk = 2;
    else if (score === 2) risk = 2;
    else if (score === 3) risk = 3;
    else if (score === 4) risk = 4;
    else if (score === 5) risk = 6;
    else if (score === 6) risk = 8;
    else if (score === 7) risk = 12;
    else if (score === 8) risk = 16;
    else if (score === 9) risk = 22;
    else risk = 30;

    // Cox Proportional Hazards Regression Coefficients for Direct Estimation of Risk of First AF Event
    // This method provides a more accurate risk estimation by considering multiple variables and their interactions.
    // Uncomment the following lines to use this method instead of the simple point-based method above.
    
    const beta = {
        age: 0.15052,
        age2: -0.00038,
        maleSex: 1.99406,
        bmi: 0.0193,
        bloodPressure: 0.00615,
        hypertensionTreatment: 0.4241,
        prInterval: 0.07065,
        murmur: 3.79586,
        heartFailure: 9.42833,
        maleSexAge2: -0.00028,
        ageMurmur: -0.04238,
        ageHeartFailure: -0.12307
    };

    const age2 = age * age;
    const maleSex = gender === 'male' ? 1 : 0;
    const hypertensionTreatment = hypertensionMedications === 'yes' ? 1 : 0;
    const significantMurmur = murmur === 'yes' ? 1 : 0;
    const prevalentHeartFailure = heartFailure === 'yes' ? 1 : 0;

    const coxScore = beta.age * age +
                     beta.age2 * age2 +
                     beta.maleSex * maleSex +
                     beta.bmi * bmi +
                     beta.bloodPressure * bloodPressure +
                     beta.hypertensionTreatment * hypertensionTreatment +
                     beta.prInterval * prInterval +
                     beta.murmur * significantMurmur +
                     beta.heartFailure * prevalentHeartFailure +
                     beta.maleSexAge2 * maleSex * age2 +
                     beta.ageMurmur * age * significantMurmur +
                     beta.ageHeartFailure * age * prevalentHeartFailure;

    risk = Math.exp(coxScore);
    

    return risk;
}

