import React, { FC, useState } from "react";

import {
  Dashboard,
  // Footer
} from "src/components";
import { Language, LanguageContext } from "src/utils/contexts";

const App: FC = () => {
  const [language, setLanguage] = useState<Language>(Language.en);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: (language) => {
          setLanguage(language);
        },
      }}
    >
      <Dashboard />
      {/* <Footer /> */}
    </LanguageContext.Provider>
  );
};

export default App;
