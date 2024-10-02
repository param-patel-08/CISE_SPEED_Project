import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MenuProps } from '@mui/material/Menu';

const PopulatedNavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SPEED
        </Typography>
        <Button color="inherit" href="/">
          Home
        </Button>
        <Button color="inherit" href="/admin">
          Admin
        </Button>
        <div>
          <Button
            color="inherit"
            onClick={handleDropdownClick}
            endIcon={<IoMdArrowDropdown />}
          >
            Articles
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleDropdownClose} component="a" href="/articles">
              View articles
            </MenuItem>
            <MenuItem onClick={handleDropdownClose} component="a" href="/articles/new">
              Submit new
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default PopulatedNavBar;
