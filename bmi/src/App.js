import './App.css';
import React, { useState, useEffect } from 'react';
import NutritionalPlanner from './NutritionalPlanner'; // Added
import {
  Container, TextField, Button, RadioGroup, FormControlLabel, Radio,
  Typography, Box, Paper, Grid, FormControl, FormLabel, Alert,
  Tabs, Tab
} from '@mui/material';
// import { useTranslation } from 'react-i18next'; // Removed
// import LanguageSwitcher from './LanguageSwitcher'; // Removed

function App() {
  // const { t } = useTranslation(); // Removed
  const [weight, setWeight] = useState('');
  const [currentTab, setCurrentTab] = useState(0); // 0 for BMI, 1 for Nutritional Planner

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
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
    <Box className="app" sx={{ padding: { xs: 1, sm: 2 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Paper elevation={3} sx={{ padding: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: '600px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered variant="fullWidth">
            <Tab label="BMI Calculator" />
            <Tab label="Nutritional Planner" />
          </Tabs>
        </Box>

        {/* BMI Calculator Tab Panel */}
        {currentTab === 0 && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom align="center">
              BMI Health Calculator
            </Typography>
            <Box component="form" onSubmit={calculateBMI} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={9}>
                  <TextField
                label={`Weight (${units.weight})`}
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                inputProps={{ min: "0", step: "0.1" }}
                error={errors.weight}
                helperText={errors.weight ? "Please enter a valid weight" : ""}
                placeholder={`Enter weight in ${units.weight}`}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="text"
                onClick={() => toggleUnits('weight')}
                size="small"
                fullWidth
                sx={{ mb: errors.weight ? '23px' : '8px' }} // Adjust margin to align with TextField helperText
              >
                Switch to {units.weight === 'kg' ? 'lb' : 'kg'}
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={9}>
              <TextField
                label={`Height (${units.height})`}
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                inputProps={{ min: "0", step: "0.1" }}
                error={errors.height}
                helperText={errors.height ? "Please enter a valid height" : ""}
                placeholder={`Enter height in ${units.height}`}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="text"
                onClick={() => toggleUnits('height')}
                size="small"
                fullWidth
                sx={{ mb: errors.height ? '23px' : '8px' }}
              >
                Switch to {units.height === 'cm' ? 'in' : 'cm'}
              </Button>
            </Grid>
          </Grid>

          <TextField
            label="Age (Optional)"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputProps={{ min: "0", max: "120" }}
            error={errors.age}
            helperText={errors.age ? "Please enter a valid age between 2 and 120" : ""}
            placeholder="Enter age (2-120)"
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Gender (Optional)</FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Calculate BMI
            </Button>
            <Button type="button" variant="outlined" onClick={resetForm} fullWidth>
              Reset
            </Button>
          </Box>
        </Box>

        {bmi && (
          <Paper elevation={1} sx={{ padding: 2, marginTop: 3, backgroundColor: category.color + '15' }}>
            <Box sx={{
              padding: 1,
              backgroundColor: category.color,
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: 2
            }}>
              <Typography variant="h6">{category.message}</Typography>
            </Box>
            <Typography variant="h3" align="center" gutterBottom>{bmi}</Typography>
            <Typography variant="subtitle1" align="center">BMI Category: <strong>{category.message}</strong></Typography>
            <Typography variant="body2" align="center">Healthy BMI Range: <strong>18.5-24.9</strong></Typography>
            <Typography variant="body2" align="center" gutterBottom>Your Category Range: <strong>{category.range}</strong></Typography>

            {/* Progress bar might need a custom component or more complex MUI setup - skipping for now */}
            {/* Health Risks */}
            {healthRisks.length > 0 && (
              <Box mt={2}>
                <Typography variant="h6">Health Considerations:</Typography>
                <ul>
                  {healthRisks.map((risk, index) => (
                    <li key={index}><Typography variant="body2">{risk}</Typography></li>
                  ))}
                </ul>
                <Typography variant="caption" display="block" mt={1}>
                  Note: This is general guidance. Please consult a healthcare professional for personalized advice.
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {history.length > 0 && (
          <Paper elevation={1} sx={{ padding: 2, marginTop: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
              <Typography variant="h5">BMI History</Typography>
              <Button onClick={clearHistory} size="small" color="secondary">Clear</Button>
            </Box>
            {history.map((entry, index) => (
              <Paper key={index} variant="outlined" sx={{ padding: 1.5, marginBottom: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{entry.date}</Typography>
                <Box>
                  <Typography variant="body1" component="span" fontWeight="bold">{entry.bmi} </Typography>
                  <Typography variant="caption" component="span">({entry.category})</Typography>
                </Box>
              </Paper>
            ))}
          </Paper>
        )}
          </Box>
        )}
        {/* End BMI Calculator Tab Panel */}

        {/* Nutritional Planner Tab Panel */}
        {currentTab === 1 && (
          <NutritionalPlanner userData={{ weight, height, age, gender }} />
        )}
        {/* End Nutritional Planner Tab Panel */}
      </Paper>

      {/* Information Card - Placed outside the main Paper конкурирующий with tabs for now */}
      <Paper elevation={1} sx={{ padding: 2, marginTop: 2, width: '100%', maxWidth: '600px' }}>
        <Typography variant="h5" gutterBottom>About BMI & Nutrition</Typography> {/* Updated Title */}
        <Typography variant="body1" paragraph>
          Body Mass Index (BMI) is a numerical value calculated from a person's weight and height.
          It provides a simple way to categorize a person's weight relative to their height.
        </Typography>
        <Typography variant="body1" paragraph>
          The BMI classifications are based on World Health Organization standards:
        </Typography>
        <ul>
          <li><Typography variant="body2">Severe Thinness</Typography></li>
          <li><Typography variant="body2">Normal weight</Typography></li>
          <li><Typography variant="body2">Overweight</Typography></li>
          <li><Typography variant="body2">Obesity</Typography></li>
        </ul>
        <Typography variant="body1" paragraph>
          <strong>Limitations:</strong> BMI doesn't account for body composition (muscle vs. fat),
          age, gender, ethnicity, or fitness level. It's a screening tool and not a diagnostic measurement.
        </Typography>
      </Paper>
    </Box>
  );
}

export default App;