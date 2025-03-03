import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [healthRisks, setHealthRisks] = useState([]);
  const [errors, setErrors] = useState({ weight: false, height: false, age: false });
  const [units, setUnits] = useState({ weight: 'kg', height: 'cm' });
  const [history, setHistory] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('bmiHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bmiHistory', JSON.stringify(history));
  }, [history]);

  const validateInput = () => {
    const newErrors = {
      weight: !weight || weight <= 0,
      height: !height || height <= 0,
      age: age && (age < 2 || age > 120)
    };
    setErrors(newErrors);
    return !newErrors.weight && !newErrors.height && !newErrors.age;
  };

  const toggleUnits = (type) => {
    if (type === 'weight') {
      if (units.weight === 'kg') {
        setUnits({ ...units, weight: 'lb' });
        if (weight) {
          setWeight((parseFloat(weight) * 2.20462).toFixed(1));
        }
      } else {
        setUnits({ ...units, weight: 'kg' });
        if (weight) {
          setWeight((parseFloat(weight) / 2.20462).toFixed(1));
        }
      }
    } else if (type === 'height') {
      if (units.height === 'cm') {
        setUnits({ ...units, height: 'in' });
        if (height) {
          setHeight((parseFloat(height) / 2.54).toFixed(1));
        }
      } else {
        setUnits({ ...units, height: 'cm' });
        if (height) {
          setHeight((parseFloat(height) * 2.54).toFixed(1));
        }
      }
    }
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    // Convert to metric if needed
    let weightInKg = parseFloat(weight);
    let heightInCm = parseFloat(height);
    
    if (units.weight === 'lb') {
      weightInKg = weightInKg / 2.20462;
    }
    
    if (units.height === 'in') {
      heightInCm = heightInCm * 2.54;
    }

    const heightInMeters = heightInCm / 100;
    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = calculatedBMI.toFixed(1);
    
    setBmi(roundedBMI);
    const categoryResult = determineCategory(calculatedBMI);
    
    // Calculate health risks based on BMI, age, and gender
    const risks = calculateHealthRisks(calculatedBMI, age, gender);
    setHealthRisks(risks);
    
    // Save to history
    const newEntry = {
      date: new Date().toLocaleDateString(),
      weight: weightInKg.toFixed(1),
      height: heightInCm.toFixed(1),
      bmi: roundedBMI,
      category: categoryResult.message
    };
    
    setHistory(prevHistory => [newEntry, ...prevHistory.slice(0, 9)]);
  };

  const determineCategory = (value) => {
    let result;
    
    // Standard WHO BMI classifications
    if (value < 16) {
      result = { message: 'Severe Thinness', color: '#FF3C3C', range: 'Below 16' };
    } else if (value < 17) {
      result = { message: 'Moderate Thinness', color: '#FF5C5C', range: '16-16.9' };
    } else if (value < 18.5) {
      result = { message: 'Mild Thinness', color: '#FFA400', range: '17-18.4' };
    } else if (value < 25) {
      result = { message: 'Normal', color: '#2DC653', range: '18.5-24.9' };
    } else if (value < 30) {
      result = { message: 'Overweight', color: '#FFA400', range: '25-29.9' };
    } else if (value < 35) {
      result = { message: 'Obese Class I', color: '#FF7E3C', range: '30-34.9' };
    } else if (value < 40) {
      result = { message: 'Obese Class II', color: '#FF5C3C', range: '35-39.9' };
    } else {
      result = { message: 'Obese Class III', color: '#FF3C3C', range: '40+' };
    }
    
    // Adjust ranges for children if age is provided
    if (age && age < 18) {
      result.message += ' (Child BMI - consult pediatrician)';
    }
    
    setCategory(result);
    return result;
  };

  const calculateHealthRisks = (bmiValue, age, gender) => {
    const risks = [];
    
    // General risks based on BMI
    if (bmiValue < 18.5) {
      risks.push('Potential nutritional deficiencies');
      risks.push('Weakened immune system');
      if (bmiValue < 16) risks.push('Severe health complications');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      risks.push('Increased risk of developing heart disease');
      risks.push('Higher risk of type 2 diabetes');
    } else if (bmiValue >= 30) {
      risks.push('High risk of heart disease and stroke');
      risks.push('High risk of type 2 diabetes');
      risks.push('Increased risk of certain cancers');
      if (bmiValue >= 40) risks.push('Severe health complications');
    }
    
    // Age-specific risks
    if (age) {
      const ageNum = parseInt(age);
      if (ageNum < 18 && bmiValue > 30) {
        risks.push('Risk of early onset diabetes');
      } else if (ageNum > 65 && bmiValue < 22) {
        risks.push('Higher risk of frailty and falls');
      }
    }
    
    // Gender-specific risks
    if (gender === 'female' && bmiValue < 18.5) {
      risks.push('Potential reproductive health issues');
    }
    
    return risks;
  };

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('');
    setBmi(null);
    setCategory('');
    setHealthRisks([]);
    setErrors({ weight: false, height: false, age: false });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bmiHistory');
  };

  return (
    <div className="app">
      <div className="container">
        <h2>BMI Health Calculator</h2>
        <form onSubmit={calculateBMI}>
          <div className="input-group">
            <div className="input-header">
              <label>Weight ({units.weight})</label>
              <button 
                type="button" 
                className="unit-toggle" 
                onClick={() => toggleUnits('weight')}
              >
                Switch to {units.weight === 'kg' ? 'lb' : 'kg'}
              </button>
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.1"
              className={errors.weight ? 'error' : ''}
              placeholder={`Enter weight in ${units.weight}`}
            />
            <span className={`error-message ${errors.weight ? 'show' : ''}`}>
              Please enter a valid weight
            </span>
          </div>

          <div className="input-group">
            <div className="input-header">
              <label>Height ({units.height})</label>
              <button 
                type="button" 
                className="unit-toggle" 
                onClick={() => toggleUnits('height')}
              >
                Switch to {units.height === 'cm' ? 'in' : 'cm'}
              </button>
            </div>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="0"
              step="0.1"
              className={errors.height ? 'error' : ''}
              placeholder={`Enter height in ${units.height}`}
            />
            <span className={`error-message ${errors.height ? 'show' : ''}`}>
              Please enter a valid height
            </span>
          </div>

          <div className="input-group">
            <label>Age (Optional)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
              max="120"
              className={errors.age ? 'error' : ''}
              placeholder="Enter age (2-120)"
            />
            <span className={`error-message ${errors.age ? 'show' : ''}`}>
              Please enter a valid age between 2 and 120
            </span>
          </div>

          <div className="input-group">
            <label>Gender (Optional)</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                />
                Male
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                />
                Female
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="other"
                  checked={gender === 'other'}
                  onChange={() => setGender('other')}
                />
                Other
              </label>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Calculate BMI
            </button>
            <button type="button" className="btn btn-reset" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        {bmi && (
          <div className="result-card" style={{ background: category.color + '15' }}>
            <div className="category-indicator" style={{ background: category.color }}>
              {category.message}
            </div>
            <div className="bmi-value">{bmi}</div>
            <p className="bmi-category">BMI Category: <strong>{category.message}</strong></p>
            <p className="bmi-range">Healthy BMI Range: <strong>18.5-24.9</strong></p>
            <p className="category-range">Your Category Range: <strong>{category.range}</strong></p>
            
            <div className="progress-container">
              <div className="progress-labels">
                <span>0</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((bmi / 40) * 100, 100)}%`,
                    background: category.color
                  }}
                />
                <div className="marker underweight" style={{ left: '18.5%' }}></div>
                <div className="marker normal" style={{ left: '25%' }}></div>
                <div className="marker overweight" style={{ left: '30%' }}></div>
                <div className="marker obese" style={{ left: '40%' }}></div>
              </div>
              <div className="progress-categories">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>

            {healthRisks.length > 0 && (
              <div className="health-risks">
                <h4>Health Considerations:</h4>
                <ul>
                  {healthRisks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
                <p className="disclaimer">Note: This is general guidance. Please consult a healthcare professional for personalized advice.</p>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>BMI History</h3>
              <button className="btn-clear" onClick={clearHistory}>Clear</button>
            </div>
            <div className="history-list">
              {history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">{entry.date}</div>
                  <div className="history-details">
                    <span className="history-bmi">{entry.bmi}</span>
                    <span className="history-category">{entry.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="information-card">
        <h3>About BMI</h3>
        <p>
          Body Mass Index (BMI) is a numerical value calculated from a person's weight and height.
          It provides a simple way to categorize a person's weight relative to their height.
        </p>
        <p>The BMI classifications are based on World Health Organization standards:</p>
        <ul>
          <li>Below 18.5: Underweight</li>
          <li>18.5-24.9: Normal weight</li>
          <li>25.0-29.9: Overweight</li>
          <li>30.0 and above: Obesity</li>
        </ul>
        <p>
          <strong>Limitations:</strong> BMI doesn't account for body composition (muscle vs. fat), 
          age, gender, ethnicity, or fitness level. It's a screening tool and not a diagnostic measurement.
        </p>
      </div>
    </div>
  );
}

export default App;