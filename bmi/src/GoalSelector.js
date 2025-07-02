import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const GoalSelector = ({ goal, setGoal }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="goal-select-label">Select Your Goal</InputLabel>
      <Select
        labelId="goal-select-label"
        id="goal-select"
        value={goal}
        label="Select Your Goal"
        onChange={(e) => setGoal(e.target.value)}
      >
        <MenuItem value="maintenance">Maintain Weight</MenuItem>
        <MenuItem value="loss">Weight Loss</MenuItem>
        <MenuItem value="gain">Weight Gain</MenuItem>
      </Select>
    </FormControl>
  );
};

export default GoalSelector;
