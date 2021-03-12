import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { debounce } from "lodash";
import React, { FC, memo, useCallback, useState } from "react";

import instagram from "src/resource/instagram.svg";
import twitter from "src/resource/twitter.svg";

import { Checker } from "./Checker";
// import { Menu } from "./Menu";
import { SearchBar } from "./SearchBar";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  main: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: 10,
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    margin: "80px 0 100px",
    width: "100%",
  },
  title: {
    marginBottom: 20,
  },
  checkers: {
    display: "grid",
    gridGap: 10,
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    width: "100%",
  },
});

const debounced = debounce((name, setName) => {
  setName(name);
}, 500);

export const Dashboard: FC = memo(() => {
  const [name, setName] = useState("");

  const handleNameChange = useCallback((name) => {
    debounced(name, setName);
  }, []);

  const styles = useStyles();

  return (
    <div className={styles.root}>
      {/* <Menu /> */}
      <div className={styles.main}>
        <div className={styles.header}>
          <Typography variant="h3" className={styles.title}>
            Name Check
          </Typography>
          <SearchBar setName={handleNameChange} />
        </div>

        <div className={styles.checkers}>
          <Checker
            link={`http://${name}.com/`}
            name={name}
            platform="web"
            tld=".com"
          />
          <Checker
            link={`http://${name}.net/`}
            name={name}
            platform="web"
            tld=".net"
          />
          <Checker
            link={`http://${name}.org/`}
            name={name}
            platform="web"
            tld=".org"
          />
          <Checker
            link={`http://${name}.co/`}
            name={name}
            platform="web"
            tld=".co"
          />
          <Checker
            link={`http://${name}.io/`}
            name={name}
            platform="web"
            tld=".io"
          />
          <Checker
            icon={instagram}
            link={`http://instagram.com/${name}/`}
            name={name}
            platform="instagram"
          />
          <Checker
            icon={twitter}
            link={`http://twitter.com/${name}/`}
            name={name}
            platform="twitter"
          />
        </div>
      </div>
    </div>
  );
});
