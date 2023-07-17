import { useCallback, useEffect, useState } from 'react';

import { httpGetPlanets } from './requests';
import { Planet } from '../pages/AppLayout';

type usePlanetsReturnType = Planet[];

const usePlanets = (): usePlanetsReturnType => {
  const [planets, savePlanets] = useState<Planet[]>([]);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets: Planet[] = await httpGetPlanets();
    savePlanets(fetchedPlanets);
  }, []);

  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  return planets;
};

export default usePlanets;
