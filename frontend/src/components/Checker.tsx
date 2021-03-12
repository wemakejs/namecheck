import {
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Web } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";

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
  info: {
    alignItems: "center",
    display: "flex",
  },
  progress: {
    bottom: 0,
    height: 3,
    position: "absolute",
    width: "100%",
  },
});

interface CheckerProps {
  icon?: string;
  link: string;
  name: string;
  platform: string;
  tld?: string;
}

export const Checker: FC<CheckerProps> = ({
  icon,
  link,
  name,
  platform,
  tld = "",
}) => {
  const [status, setStatus] = useState("waiting");
  const s = useString();

  useEffect(() => {
    console.log(name);
    if (name) {
      const check = async () => {
        setStatus("checking");
        try {
          const { data } = await checkName(name + tld, platform);
          // console.log(platform, data);
          setStatus(data.available ? "available" : "unavailable");
        } catch (err) {
          console.error(err);
        }
      };
      check();
    } else {
      setStatus("waiting");
    }
  }, [name, platform, tld]);

  const styles = useStyles();

  const cardStyle = status === "unavailable" ? { backgroundColor: "#ddd" } : {};
  const statusStyle = status === "available" ? { color: green[500] } : {};

  return (
    <Card className={styles.card} style={cardStyle}>
      <CardActionArea
        component="a"
        disabled={status !== "available" && status !== "unavailable"}
        href={link}
        target="_blank"
      >
        <CardContent className={styles.content}>
          {icon ? (
            <img alt="icon" src={icon} style={{ width: 44 }} />
          ) : (
            <Web
              fontSize="inherit"
              color="disabled"
              style={{ fontSize: 44, display: "block" }}
            />
          )}
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
