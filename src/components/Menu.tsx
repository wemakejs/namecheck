import {
  Checkbox,
  Collapse,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useCallback, useState } from "react";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

export const Menu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const styles = useStyles();

  const drawer = (
    <div>
      {/* <div className={classes.toolbar} /> */}
      <Divider />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
          </ListSubheader>
        }
        // className={classes.root}
      >
        <ListItem button>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={false}
              tabIndex={-1}
              disableRipple
              // inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText primary="Sent mail" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={false}
              tabIndex={-1}
              disableRipple
              // inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>

        <ListItem button onClick={() => {}}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={false}
              tabIndex={-1}
              disableRipple
              // inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {true ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={true} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              // className={classes.nested}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={false}
                  tabIndex={-1}
                  disableRipple
                  // inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <section className={styles.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          // container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: styles.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: styles.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </section>
  );
};
