import { IconButton, InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Clear as ClearIcon, Search as SearchIcon } from "@material-ui/icons";
import { debounce } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { set } from "src/redux/slices/usernameSlice";
import { useString } from "src/utils";

const { protocol, host } = window.location;
const baseURL = `${protocol}//${host}/`;

const debouncedSetUsername = debounce((username, setUsername) => {
  var path = `${baseURL}?q=${username}`;
  window.history.pushState({ path }, "", path);
  setUsername(username);
}, 500);

export const SearchBar: FC = () => {
  const s = useString();
  const dispatch = useDispatch();

  const [localName, setLocalName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setLocalName(q);
      dispatch(set(q));
    }

    window.onpopstate = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setLocalName(q);
        dispatch(set(q));
      } else {
        setLocalName("");
        dispatch(set(""));
      }
    };
  }, [dispatch]);

  const handleNameChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/ /g, "");
      setLocalName(value);
      debouncedSetUsername(value, (name: string) => dispatch(set(name)));
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    setLocalName("");
    dispatch(set(""));
    window.history.pushState({ path: baseURL }, "", baseURL);
  }, [dispatch]);

  const styles = useStyles();
  return (
    <Paper className={styles.searchBarContainer} elevation={2}>
      <SearchIcon />
      <InputBase
        autoFocus
        className={styles.searchBar}
        inputProps={{ style: { fontSize: 20, textAlign: "center" } }}
        onChange={handleNameChange}
        value={localName}
        placeholder={s("username")}
      />
      <IconButton
        onClick={handleClear}
        size="small"
        style={{ visibility: localName ? "visible" : "hidden" }}
      >
        <ClearIcon />
      </IconButton>
    </Paper>
  );
};

const useStyles = makeStyles({
  searchBar: {
    margin: "0 8px",
    width: "100%",
  },
  searchBarContainer: {
    alignItems: "center",
    display: "flex",
    padding: "2px 8px",
    width: "80%",
    maxWidth: 600,
  },
});
