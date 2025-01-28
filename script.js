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
    
    const result = calculateRisk(age, gender, bmi, bloodPressure, hypertensionMedications, prInterval, murmur, heartFailure);
    
    document.getElementById('result').innerHTML = `
        <p>Your 10-year AFib risk is ${result.risk}%.</p>
        <p>This means that compared to someone with the lowest risk factors, your risk of developing atrial fibrillation over the next 10 years is approximately ${result.risk} times higher.</p>
        <h3>Calculation Details:</h3>
        <table>
            <tr><th>Variable</th><th>Formula</th><th>Score</th></tr>
            <tr><td>Age</td><td>${result.ageFormula}</td><td>${result.ageScore}</td></tr>
            <tr><td>Sex</td><td></td><td>${result.maleSexScore} (male)</td></tr>
            <tr><td>SBP</td><td>${result.bloodPressureFormula}</td><td>${result.bloodPressureScore}</td></tr>
            <tr><td>Hypertension treatment</td><td></td><td>${result.hypertensionTreatmentScore}</td></tr>
            <tr><td>BMI</td><td>${result.bmiFormula}</td><td>${result.bmiScore}</td></tr>
            <tr><td>PR interval</td><td>${result.prIntervalFormula}</td><td>${result.prIntervalScore}</td></tr>
            <tr><td>Significant murmur</td><td></td><td>${result.murmurScore}</td></tr>
            <tr><td>Heart failure</td><td></td><td>${result.heartFailureScore} (absent)</td></tr>
            <tr><td>Total score</td><td>${result.totalScoreFormula}</td><td>${result.totalScore}</td></tr>
            <tr><td>Baseline survival (S<sub>0</sub>(10))</td><td></td><td>${result.baselineSurvival}</td></tr>
            <tr><td>Survival probability</td><td>${result.survivalProbabilityFormula}</td><td>${result.survivalProbability}</td></tr>
            <tr><td>10-Year Risk</td><td>${result.riskFormula}</td><td>${result.risk}%</td></tr>
        </table>
    `;
});

function calculateRisk(age, gender, bmi, bloodPressure, hypertensionMedications, prInterval, murmur, heartFailure) {
    // Cox Proportional Hazards Regression Coefficients
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

    // Reference values
    const reference = {
        age: 60.9,
        bloodPressure: 136,
        bmi: 26.3,
        prInterval: 164
    };

    // Calculate individual contributions
    const age2 = age * age;
    const maleSex = gender === 'male' ? 1 : 0;
    const hypertensionTreatment = hypertensionMedications === 'yes' ? 1 : 0;
    const significantMurmur = murmur === 'yes' ? 1 : 0;
    const prevalentHeartFailure = heartFailure === 'yes' ? 1 : 0;

    const ageScore = beta.age * (age - reference.age);
    const age2Score = beta.age2 * (age2 - reference.age * reference.age);
    const maleSexScore = beta.maleSex * maleSex;
    const bmiScore = beta.bmi * (bmi - reference.bmi);
    const bloodPressureScore = beta.bloodPressure * (bloodPressure - reference.bloodPressure);
    const hypertensionTreatmentScore = beta.hypertensionTreatment * hypertensionTreatment;
    const prIntervalScore = beta.prInterval * (prInterval - reference.prInterval);
    const murmurScore = beta.murmur * significantMurmur;
    const heartFailureScore = beta.heartFailure * prevalentHeartFailure;
    const maleSexAge2Score = beta.maleSexAge2 * maleSex * age2;
    const ageMurmurScore = beta.ageMurmur * age * significantMurmur;
    const ageHeartFailureScore = beta.ageHeartFailure * age * prevalentHeartFailure;

    // Sum the contributions to get the total score
    const totalScore = ageScore + age2Score + maleSexScore + bmiScore + bloodPressureScore + hypertensionTreatmentScore + prIntervalScore + murmurScore + heartFailureScore + maleSexAge2Score + ageMurmurScore + ageHeartFailureScore;

    // Baseline survival probability at 10 years (assumed value)
    const baselineSurvival = 0.956;

    // Calculate the survival probability at 10 years
    const survivalProbability = baselineSurvival ** Math.exp(totalScore);

    // Calculate the 10-year risk
    const risk = (1 - survivalProbability) * 100;

    return {
        risk: risk.toFixed(2),
        ageFormula: `${beta.age} × (${age} - ${reference.age})`,
        ageScore: ageScore.toFixed(3),
        maleSexScore: maleSexScore.toFixed(3),
        bloodPressureFormula: `${beta.bloodPressure} × (${bloodPressure} - ${reference.bloodPressure})`,
        bloodPressureScore: bloodPressureScore.toFixed(3),
        hypertensionTreatmentScore: hypertensionTreatmentScore.toFixed(3),
        bmiFormula: `${beta.bmi} × (${bmi} - ${reference.bmi})`,
        bmiScore: bmiScore.toFixed(3),
        prIntervalFormula: `${beta.prInterval} × (${prInterval} - ${reference.prInterval})`,
        prIntervalScore: prIntervalScore.toFixed(3),
        murmurScore: murmurScore.toFixed(3),
        heartFailureScore: heartFailureScore.toFixed(3),
        totalScoreFormula: `${ageScore.toFixed(3)} + ${age2Score.toFixed(3)} + ${maleSexScore.toFixed(3)} + ${bmiScore.toFixed(3)} + ${bloodPressureScore.toFixed(3)} + ${hypertensionTreatmentScore.toFixed(3)} + ${prIntervalScore.toFixed(3)} + ${murmurScore.toFixed(3)} + ${heartFailureScore.toFixed(3)} + ${maleSexAge2Score.toFixed(3)} + ${ageMurmurScore.toFixed(3)} + ${ageHeartFailureScore.toFixed(3)}`,
        totalScore: totalScore.toFixed(3),
        baselineSurvival: baselineSurvival,
        survivalProbabilityFormula: `${baselineSurvival} ^ Math.exp(${totalScore.toFixed(3)})`,
        survivalProbability: survivalProbability.toFixed(3),
        riskFormula: `1 - ${survivalProbability.toFixed(3)}`
    };
}

