import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const NutritionalPlanDisplay = ({ plan }) => {
  if (!plan) {
    return null;
  }

  return (
    <Box mt={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Your Nutritional Plan
          </Typography>
          <Typography variant="body1" gutterBottom>
            Estimated TDEE: {plan.tdee.toFixed(0)} calories
          </Typography>
          <Typography variant="h6" component="div" color="primary" gutterBottom>
            Target Calories: {plan.calories.toFixed(0)} calories
          </Typography>
          <Typography variant="h6" component="div" mt={2}>
            Macronutrients:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary={`Protein: ${plan.protein.toFixed(0)}g`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Fat: ${plan.fat.toFixed(0)}g`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Carbohydrates: ${plan.carbs.toFixed(0)}g`} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NutritionalPlanDisplay;
