import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ActivityLevelSelector = ({ activityLevel, setActivityLevel }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="activity-level-select-label">Select Your Activity Level</InputLabel>
      <Select
        labelId="activity-level-select-label"
        id="activity-level-select"
        value={activityLevel}
        label="Select Your Activity Level"
        onChange={(e) => setActivityLevel(e.target.value)}
      >
        <MenuItem value="sedentary">Sedentary (little to no exercise)</MenuItem>
        <MenuItem value="lightly">Lightly Active (light exercise/sports 1-3 days/week)</MenuItem>
        <MenuItem value="moderately">Moderately Active (moderate exercise/sports 3-5 days/week)</MenuItem>
        <MenuItem value="very">Very Active (hard exercise/sports 6-7 days/week)</MenuItem>
        <MenuItem value="extra">Extra Active (very hard exercise/physical job)</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ActivityLevelSelector;
