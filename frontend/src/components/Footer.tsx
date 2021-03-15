import { makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  footer: {
    backgroundColor: "#eee",
    bottom: "0",
    display: "flex",
    justifyContent: "center",
    position: "fixed",
    width: "100%",
  },
  text: {
    margin: 5,
  },
  heart: {
    marginRight: 5,
  },
});

export const Footer = () => {
  const styles = useStyles();

  return (
    <section className={styles.footer}>
      <Typography variant="body2" className={styles.text}>
        {"With "}
        <span className={styles.heart}>❤️</span>
        {" by We Make. Support us at "}
        <a
          rel="noreferrer"
          target="_blank"
          href="https://www.patreon.com/wemake"
        >
          Patreon
        </a>
        .
      </Typography>
    </section>
  );
};
