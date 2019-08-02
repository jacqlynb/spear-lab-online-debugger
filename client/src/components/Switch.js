import React, { useState } from 'react';
import * as Navbar from './Navbar.js';
import Switch from '@material-ui/core/Switch';

const SwitchButton = () => {
  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const switchMarkup = (
    <Switch 
        checked={true}
        onChange={handleChange('checkedA')}
        value="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
    />
  );

  return switchMarkup;
}

export default SwitchButton;
