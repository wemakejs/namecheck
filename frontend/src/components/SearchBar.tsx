import { InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import { debounce } from "lodash";
import React, { FC, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { set } from "src/redux/slices/usernameSlice";
import { useString } from "src/utils";

const useStyles = makeStyles({
  searchBarContainer: {
    alignItems: "center",
    display: "flex",
    padding: "2px 8px",
    width: "80%",
    maxWidth: 600,
  },
  searchBar: {
    marginLeft: 30,
    marginRight: 6,
    width: "100%",
  },
});

const debouncedSetUsername = debounce((username, setUsername) => {
  setUsername(username);
}, 500);

export const SearchBar: FC = () => {
  const s = useString();
  const dispatch = useDispatch();

  const [localName, setLocalName] = useState("");

  const handleNameChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/ /g, "");
      setLocalName(value);
      debouncedSetUsername(value, (name: string) => dispatch(set(name)));
    },
    [dispatch]
  );

  const styles = useStyles();

  return (
    <Paper className={styles.searchBarContainer} elevation={2}>
      <InputBase
        autoFocus
        className={styles.searchBar}
        inputProps={{ style: { fontSize: 20, textAlign: "center" } }}
        onChange={handleNameChange}
        value={localName}
        placeholder={s("username")}
      />
      <Search />
    </Paper>
  );
};
