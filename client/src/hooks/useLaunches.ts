import { useCallback, useEffect, useState } from 'react';

import { httpGetLaunches, httpSubmitLaunch, httpAbortLaunch } from './requests';
import { RocketLaunch } from '../pages/AppLayout';

type useLaunchesReturnType = {
  launches: RocketLaunch[];
  isPendingLaunch: boolean;
  submitLaunch: (e: React.FormEvent<HTMLFormElement>) => void;
  abortLaunch: (flightNumber: number) => void;
};

const useLaunches = (
  onSuccessSound,
  onAbortSound,
  onFailureSound
): useLaunchesReturnType => {
  const [launches, saveLaunches] = useState<RocketLaunch[]>([]);
  const [isPendingLaunch, setPendingLaunch] = useState(false);

  const getLaunches = useCallback(async () => {
    const fetchedLaunches: RocketLaunch[] = await httpGetLaunches();
    saveLaunches(fetchedLaunches);
  }, []);

  useEffect(() => {
    getLaunches();
  }, [getLaunches]);

  const submitLaunch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPendingLaunch(true);
      const data = new FormData(e.target as HTMLFormElement);

      const launchDateString = data.get('launch-day') as string;
      const launchDate = launchDateString ? new Date(launchDateString) : null;

      const mission = data.get('mission-name') as string;
      const rocket = data.get('rocket-name') as string;
      const target = data.get('planets-selector') as string;
      const response = await httpSubmitLaunch({
        launchDate,
        mission,
        rocket,
        target,
      });

      const success = response.ok;
      if (success) {
        getLaunches();
        setTimeout(() => {
          setPendingLaunch(false);
          onSuccessSound();
        }, 800);
      } else {
        onFailureSound();
      }
    },
    [getLaunches, onSuccessSound, onFailureSound]
  );

  const abortLaunch = useCallback(
    async (id: number) => {
      const response = await httpAbortLaunch(id);

      const success = response.ok;
      if (success) {
        getLaunches();
        onAbortSound();
      } else {
        onFailureSound();
      }
    },
    [getLaunches, onAbortSound, onFailureSound]
  );

  return {
    launches,
    isPendingLaunch,
    submitLaunch,
    abortLaunch,
  };
};

export default useLaunches;
