import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { FC, useEffect } from "react";

const useStyles = makeStyles({});

interface CheckProps {
  fn: (name: string) => Promise<boolean>;
  format?: (name: string) => string;
  name: string;
  title: string;
}

export const Checker: FC<CheckProps> = ({
  fn,
  format = (s) => s,
  name,
  title,
}) => {
  useEffect(() => {
    fn(name);
  }, [fn, name]);

  return (
    <Card>
      <CardContent>
        <Typography>{title}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">open</Button>
      </CardActions>
    </Card>
  );
};
