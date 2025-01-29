# 10-Year AFib Risk Predictor

This project is based on the Framingham Heart Study and the associated paper on predicting the 10-year risk of atrial fibrillation (AFib). The Cox proportional hazards model is used to estimate the risk based on various predictors.

## Associated Paper

The Framingham Heart Study is a long-term, ongoing cardiovascular cohort study on residents of the town of Framingham, Massachusetts. The study began in 1948 with 5,209 adult subjects and is now on its third generation of participants. The associated paper for this project is:

**Title:** Atrial Fibrillation Risk Prediction: The Framingham Heart Study  
**Authors:** Benjamin EJ, Levy D, Vaziri SM, D'Agostino RB, Belanger AJ, Wolf PA  
**Journal:** Circulation  
**Year:** 1994  
**DOI:** [10.1161/01.CIR.89.2.724](https://doi.org/10.1161/01.CIR.89.2.724)

## How to Use

### Prerequisites

To run this project, you need a web browser that supports HTML, CSS, and JavaScript.

### Steps

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-username/10-Year-AFib-Risk-.git
   cd 10-Year-AFib-Risk-
   ```

2. **Open the `index.html` File:**
   Open the `index.html` file in your web browser.

3. **Fill in the Form:**
   Enter the required values in the form:
   - **Age (45-90):** Enter your age between 45 and 90.
   - **Gender:** Select your gender (Male or Female).
   - **Body Mass Index (BMI):** Enter your BMI.
   - **Systolic Blood Pressure (90-200):** Enter your systolic blood pressure.
   - **Use of Hypertension Medications:** Select whether you use hypertension medications (Yes or No).
   - **PR Interval (<160 to >200):** Enter your PR interval.
   - **Significant Murmur:** Select whether you have a significant murmur (Yes or No).
   - **Prevalent Heart Failure:** Select whether you have prevalent heart failure (Yes or No).

4. **Calculate Risk:**
   Click the "Calculate Risk" button to calculate your 10-year AFib risk.

### Output

The output will display:
- **Your 10-year AFib risk** as a percentage.
- **Cox Hazard Estimated Risk Formula** with the general formula and the variables filled in.
- **Calculation Details** in a table format showing the contributions of each variable.

### Example

Here is an example of how the output will look:

```
Your 10-year AFib risk is 15.23%.

This means that compared to someone with the lowest risk factors, your risk of developing atrial fibrillation over the next 10 years is approximately 15.23 times higher.

Cox Hazard Estimated Risk Formula:
Total Score = ∑(βi × (Patient’s Value − Reference Value))
    S(10) = S0(10)exp(Total Score)
    10-Year Risk = 1 − S(10)

Variables Filled In:
Total Score = 0.15052 × (70 - 60.9) + 1.99406 × (1 - 0) + 0.00615 × (150 - 136) + 0.4241 × (1 - 0) + 0.0193 × (30 - 26.3) + 0.07065 × (180 - 164) + 3.79586 × (1 - 0) + 9.42833 × (0 - 0)
    S(10) = 0.956exp(1.623)
    10-Year Risk = 1 − 0.80

where:
- βi are the Cox regression coefficients for each predictor.
- S0(10) is the baseline survival probability at 10 years.
- S(10) is the probability of not developing AF in 10 years.

Calculation Details:
| Variable                | Patient Value | β (Coefficient) | Reference Value | Contribution | Calculation                           | Sum   |
|-------------------------|---------------|-----------------|-----------------|--------------|---------------------------------------|-------|
| Age                     | 70            | 0.15052         | 60.9            | 1.382        | 0.15052 × (70 - 60.9)                 | 10.537|
| Sex (Male=1, Female=0)  | 1             | 1.99406         | 0               | 1.994        | 1.99406 × (1 - 0)                     | 1.994 |
| Systolic BP             | 150           | 0.00615         | 136             | 0.086        | 0.00615 × (150 - 136)                 | 0.086 |
| Hypertension Treatment  | 1             | 0.4241          | 0               | 0.424        | 0.4241 × (1 - 0)                      | 0.424 |
| BMI                     | 30            | 0.0193          | 26.3            | 0.071        | 0.0193 × (30 - 26.3)                  | 0.071 |
| PR Interval             | 180           | 0.07065         | 164             | 1.130        | 0.07065 × (180 - 164)                 | 1.130 |
| Significant Murmur      | 1             | 3.79586         | 0               | 3.796        | 3.79586 × (1 - 0)                     | 3.796 |
| Heart Failure           | 0             | 9.42833         | 0               | 0.000        | 9.42833 × (0 - 0)                     | 0.000 |
