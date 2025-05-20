import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImportData from './ImportData'; // Import the main component
import { Hooks, Components } from "tracker-capture-app-core";

const { useApi } = Hooks;
const { LoadingMask } = Components;

const ImportDataWrapper = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // Set initial loading state to false

  // If you need to fetch some initial data or perform setup, you can do it here
  // For example:
  // useEffect(() => {
  //   setLoading(true);
  //   fetchSomeData().then(() => setLoading(false));
  // }, []);

  return (
    <div className="importData-wrapper">
      {loading ? (
        <LoadingMask /> // Show a loading spinner if `loading` is true
      ) : (
        <ImportData /> // Render the main ImportData component
      )}
    </div>
  );
};

export default ImportDataWrapper;