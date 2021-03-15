import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { debounce } from "lodash";
import React, { FC, memo, useCallback, useState } from "react";

import domain from "src/resource/domain.svg";
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
    margin: "auto",
    maxWidth: 1200,
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
    fontFamily: "Comfortaa",
    marginBottom: 20,
  },
  checkers: {
    display: "grid",
    gridGap: 10,
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    width: "100%",
  },
  sectionTitle: {
    fontFamily: "Roboto",
    gridColumn: "1/-1",
    marginTop: 20,
    padding: "0 12px",
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
          <Typography className={styles.sectionTitle} variant="body1">
            Domain Names
          </Typography>
          <Checker
            icon={domain}
            link={`http://${name}.com/`}
            name={name}
            platform="web"
            tld=".com"
          />
          <Checker
            icon={domain}
            link={`http://${name}.net/`}
            name={name}
            platform="web"
            tld=".net"
          />
          <Checker
            icon={domain}
            link={`http://${name}.org/`}
            name={name}
            platform="web"
            tld=".org"
          />
          <Checker
            icon={domain}
            link={`http://${name}.co/`}
            name={name}
            platform="web"
            tld=".co"
          />
          <Checker
            icon={domain}
            link={`http://${name}.io/`}
            name={name}
            platform="web"
            tld=".io"
          />

          <Typography className={styles.sectionTitle} variant="body1">
            Social Media
          </Typography>
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
