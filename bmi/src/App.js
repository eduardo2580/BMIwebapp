import './App.css';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function App() {
  const { t } = useTranslation();
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
      result = { message: t('severeThinness'), color: '#FF3C3C', range: 'Below 16' };
    } else if (value < 17) {
      result = { message: t('moderateThinness'), color: '#FF5C5C', range: '16-16.9' };
    } else if (value < 18.5) {
      result = { message: t('mildThinness'), color: '#FFA400', range: '17-18.4' };
    } else if (value < 25) {
      result = { message: t('normal'), color: '#2DC653', range: '18.5-24.9' };
    } else if (value < 30) {
      result = { message: t('overweight'), color: '#FFA400', range: '25-29.9' };
    } else if (value < 35) {
      result = { message: t('obeseClass1'), color: '#FF7E3C', range: '30-34.9' };
    } else if (value < 40) {
      result = { message: t('obeseClass2'), color: '#FF5C3C', range: '35-39.9' };
    } else {
      result = { message: t('obeseClass3'), color: '#FF3C3C', range: '40+' };
    }
    
    // Adjust ranges for children if age is provided
    if (age && age < 18) {
      result.message += t('childBMIConsult');
    }
    
    setCategory(result);
    return result;
  };

  const calculateHealthRisks = (bmiValue, age, gender) => {
    const risks = [];
    
    // General risks based on BMI
    if (bmiValue < 18.5) {
      risks.push(t('potentialNutritionalDeficiencies'));
      risks.push(t('weakenedImmuneSystem'));
      if (bmiValue < 16) risks.push(t('severeHealthComplications'));
    } else if (bmiValue >= 25 && bmiValue < 30) {
      risks.push(t('increasedRiskHeartDisease'));
      risks.push(t('higherRiskType2Diabetes'));
    } else if (bmiValue >= 30) {
      risks.push(t('highRiskHeartDiseaseStroke'));
      risks.push(t('highRiskType2Diabetes'));
      risks.push(t('increasedRiskCertainCancers'));
      if (bmiValue >= 40) risks.push(t('severeHealthComplications'));
    }
    
    // Age-specific risks
    if (age) {
      const ageNum = parseInt(age);
      if (ageNum < 18 && bmiValue > 30) {
        risks.push(t('riskEarlyOnsetDiabetes'));
      } else if (ageNum > 65 && bmiValue < 22) {
        risks.push(t('higherRiskFrailtyFalls'));
      }
    }
    
    // Gender-specific risks
    if (gender === 'female' && bmiValue < 18.5) {
      risks.push(t('potentialReproductiveHealthIssues'));
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
      <LanguageSwitcher />
      <div className="container">
        <h2>{t('bmiHealthCalculator')}</h2>
        <form onSubmit={calculateBMI}>
          <div className="input-group">
            <div className="input-header">
              <label>{t('weight')} ({units.weight})</label>
              <button
                type="button"
                className="unit-toggle"
                onClick={() => toggleUnits('weight')}
              >
                {t('switchTo')} {units.weight === 'kg' ? 'lb' : 'kg'}
              </button>
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.1"
              className={errors.weight ? 'error' : ''}
              placeholder={`${t('enterWeightIn')} ${units.weight}`}
            />
            <span className={`error-message ${errors.weight ? 'show' : ''}`}>
              {t('validWeightError')}
            </span>
          </div>

          <div className="input-group">
            <div className="input-header">
              <label>{t('height')} ({units.height})</label>
              <button
                type="button"
                className="unit-toggle"
                onClick={() => toggleUnits('height')}
              >
                {t('switchTo')} {units.height === 'cm' ? 'in' : 'cm'}
              </button>
            </div>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="0"
              step="0.1"
              className={errors.height ? 'error' : ''}
              placeholder={`${t('enterHeightIn')} ${units.height}`}
            />
            <span className={`error-message ${errors.height ? 'show' : ''}`}>
              {t('validHeightError')}
            </span>
          </div>

          <div className="input-group">
            <label>{t('age')}</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
              max="120"
              className={errors.age ? 'error' : ''}
              placeholder={t('enterAge')}
            />
            <span className={`error-message ${errors.age ? 'show' : ''}`}>
              {t('validAgeError')}
            </span>
          </div>

          <div className="input-group">
            <label>{t('gender')}</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                />
                {t('male')}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                />
                {t('female')}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="other"
                  checked={gender === 'other'}
                  onChange={() => setGender('other')}
                />
                {t('other')}
              </label>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {t('calculateBMI')}
            </button>
            <button type="button" className="btn btn-reset" onClick={resetForm}>
              {t('reset')}
            </button>
          </div>
        </form>

        {bmi && (
          <div className="result-card" style={{ background: category.color + '15' }}>
            <div className="category-indicator" style={{ background: category.color }}>
              {category.message}
            </div>
            <div className="bmi-value">{bmi}</div>
            <p className="bmi-category">{t('bmiCategory')}: <strong>{category.message}</strong></p>
            <p className="bmi-range">{t('healthyBMIRange')}: <strong>18.5-24.9</strong></p>
            <p className="category-range">{t('yourCategoryRange')}: <strong>{category.range}</strong></p>

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
                <span>{t('underweight')}</span>
                <span>{t('normal')}</span>
                <span>{t('overweight')}</span>
                <span>{t('obeseClass1')}</span>
              </div>
            </div>

            {healthRisks.length > 0 && (
              <div className="health-risks">
                <h4>{t('healthConsiderations')}</h4>
                <ul>
                  {healthRisks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
                <p className="disclaimer">{t('disclaimer')}</p>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>{t('bmiHistory')}</h3>
              <button className="btn-clear" onClick={clearHistory}>{t('clear')}</button>
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
        <h3>{t('aboutBMI')}</h3>
        <p>{t('aboutBMIText1')}</p>
        <p>{t('aboutBMIText2')}</p>
        <ul>
          <li>{t('severeThinness')}</li>
          <li>{t('normalWeight')}</li>
          <li>{t('overweight')}</li>
          <li>{t('obesity')}</li>
        </ul>
        <p>
          <strong>{t('limitations')}</strong> {t('limitationsText')}
        </p>
      </div>
    </div>
  );
}

export default App;