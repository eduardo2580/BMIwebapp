import React, { useState } from 'react';
import GoalSelector from './GoalSelector';
import ActivityLevelSelector from './ActivityLevelSelector';
import NutritionalPlanDisplay from './NutritionalPlanDisplay';
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacros } from './nutritionalCalculator';
import { Button, Typography, Paper, Alert } from '@mui/material';

const NutritionalPlanner = ({ userData }) => {
  const [goal, setGoal] = useState('maintenance'); // 'loss', 'gain', 'maintenance'
  const [activityLevel, setActivityLevel] = useState('sedentary'); // 'sedentary', 'lightly', 'moderately', 'very', 'extra'
  const [plan, setPlan] = useState(null);
  const [localError, setLocalError] = useState(''); // Added error state

  const handleCalculatePlan = () => {
    setLocalError(''); // Clear previous errors
    if (!userData || !userData.weight || !userData.height || !userData.age || !userData.gender) {
      setLocalError('Please enter all your details in the BMI Calculator section first.');
      setPlan(null); // Clear previous plan if error
      return;
    }

    // Convert userData to numbers
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);
    const age = parseInt(userData.age, 10);
    const gender = userData.gender; // 'male' or 'female'

    if (isNaN(weight) || isNaN(height) || isNaN(age) ) {
        setLocalError('Invalid user data. Please check your inputs.');
        setPlan(null);
        return;
    }

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const calorieGoal = calculateTargetCalories(tdee, goal);
    const macros = calculateMacros(calorieGoal, weight);

    setPlan({
      tdee,
      calories: calorieGoal,
      ...macros,
    });
  };

  return (
    <Paper elevation={2} sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Nutritional Plan Generator
      </Typography>
      {localError && <Alert severity="error" sx={{ marginBottom: 2 }}>{localError}</Alert>}
      <GoalSelector goal={goal} setGoal={setGoal} />
      <ActivityLevelSelector activityLevel={activityLevel} setActivityLevel={setActivityLevel} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCalculatePlan}
        fullWidth
        sx={{ marginTop: 2, marginBottom: 2 }}
      >
        Calculate Nutritional Plan
      </Button>
      {plan && <NutritionalPlanDisplay plan={plan} />}
    </Paper>
  );
};

export default NutritionalPlanner;
