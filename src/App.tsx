import { makeStyles } from "@material-ui/core";
import React, { FC } from "react";

import { Checker, Menu } from "src/components";
import { checkers } from "src/utils";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
});

const App: FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Menu />

      <Checker
        fn={checkers.instagram.fn}
        name={"billfeng"}
        title={"facebook"}
      />
    </div>
  );
};

export default App;
