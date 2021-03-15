import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { FC, memo } from "react";

import { platformGroups } from "src/data/platforms";
import { useString } from "src/utils";

import { Checker } from "./Checker";
// import { Menu } from "./Menu";
import { SearchBar } from "./SearchBar";

const useStyles = makeStyles({
  root: {
    display: "flex",
    paddingBottom: 100,
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
    gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
    width: "100%",
  },
  sectionTitle: {
    fontFamily: "Roboto",
    gridColumn: "1/-1",
    marginTop: 20,
    padding: "0 12px",
  },
});

export const Dashboard: FC = memo(() => {
  const s = useString();

  const styles = useStyles();

  return (
    <div className={styles.root}>
      {/* <Menu /> */}
      <div className={styles.main}>
        <div className={styles.header}>
          <Typography variant="h3" className={styles.title}>
            Name Check
          </Typography>
          <SearchBar />
        </div>

        <div className={styles.checkers}>
          {platformGroups.map(({ id, platforms }) => (
            <React.Fragment key={id}>
              <Typography className={styles.sectionTitle} variant="body1">
                {s(id)}
              </Typography>
              {platforms.map(({ id: platformId, getURL }) => (
                <Checker
                  key={platformId}
                  getURL={getURL}
                  platform={id === "domainNames" ? "web" : platformId}
                  tld={id === "domainNames" ? `.${platformId}` : ""}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
});
