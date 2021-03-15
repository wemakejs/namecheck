import {
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import React, { FC, useEffect, useState } from "react";

import { useSelector } from "src/redux";
import { icons } from "src/resource";
import { checkName, useString } from "src/utils";

const useStyles = makeStyles({
  card: {
    position: "relative",
    transition: "background-color 100ms linear",
  },
  content: {
    display: "flex",
    padding: 12,
  },
  icon: {
    height: 44,
    width: 44,
  },
  info: {
    alignItems: "center",
    display: "flex",
  },
  progress: {
    bottom: 0,
    height: 1,
    position: "absolute",
    width: "100%",
  },
});

interface CheckerProps {
  platform: string;
  tld?: string;
  getURL: (getURL: string) => string;
}

export const Checker: FC<CheckerProps> = ({ platform, tld = "", getURL }) => {
  const [status, setStatus] = useState("waiting");
  const s = useString();
  const username = useSelector((state) => state.username);

  useEffect(() => {
    if (username) {
      const check = async () => {
        setStatus("checking");
        try {
          const { data } = await checkName(username, platform, tld);
          setStatus(data.available ? "available" : "unavailable");
        } catch (err) {
          console.error(err);
        }
      };
      check();
    } else {
      setStatus("waiting");
    }
  }, [username, platform, tld]);

  const styles = useStyles();

  const cardStyle = status === "unavailable" ? { backgroundColor: "#ddd" } : {};
  const statusStyle = status === "available" ? { color: green[500] } : {};

  return (
    <Card className={styles.card} style={cardStyle}>
      <CardActionArea
        component="a"
        disabled={status !== "available" && status !== "unavailable"}
        href={getURL(username)}
        target="_blank"
      >
        <CardContent className={styles.content}>
          <img alt="icon" src={icons[platform]} className={styles.icon} />
          <div style={{ marginLeft: 12 }}>
            <Typography variant="body1" color="textPrimary">
              {platform === "web" ? tld : s(platform)}
            </Typography>
            <Typography
              color="textSecondary"
              style={statusStyle}
              variant="body2"
            >
              {s(status)}
            </Typography>
          </div>
          <div className={styles.info}></div>
        </CardContent>
      </CardActionArea>
      {status === "checking" && <LinearProgress className={styles.progress} />}
    </Card>
  );
};
