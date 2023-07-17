import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Frame,
  withSounds,
  withStyles,
  WithSoundsProps,
  WithStyles,
} from 'arwes';

import usePlanets from '../hooks/usePlanets';
import useLaunches from '../hooks/useLaunches';

import Centered from '../components/Centered';
import Header from '../components/Header';
import Footer from '../components/Footer';

import Launch from './Launch';
import History from './History';
import Upcoming from './Upcoming';

export interface Planet {
  keplerName: string;
}

export interface RocketLaunch {
  flightNumber: number;
  launchDate: Date;
  mission: string;
  rocket: string;
  customers?: string[];
  target: string;
  success?: boolean;
  upcoming: boolean;
}

const styles = () => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    margin: 'auto',
  },
  centered: {
    flex: 1,
    paddingTop: '20px',
    paddingBottom: '10px',
  },
});

const AppLayout = (props) => {
  const { sounds, classes } = props;
  const [frameVisible, setFrameVisible] = useState(true);

  const animateFrame = () => {
    setFrameVisible(false);
    setTimeout(() => {
      setFrameVisible(true);
    }, 600);
  };

  const onSuccessSound: () => void = () =>
    sounds.success && sounds.success.play();
  const onAbortSound: () => void = () => sounds.abort && sounds.abort.play();
  const onFailureSound: () => void = () =>
    sounds.warning && sounds.warning.play();

  const { launches, isPendingLaunch, submitLaunch, abortLaunch } = useLaunches(
    onSuccessSound,
    onAbortSound,
    onFailureSound
  );

  const planets = usePlanets();

  return (
    <div className={classes.content}>
      <Header onNav={animateFrame} />
      <Centered className={classes.centered}>
        <Frame
          animate
          show={frameVisible}
          corners={4}
          style={{ visibility: frameVisible ? 'visible' : 'hidden' }}
        >
          {(anim) => (
            <div style={{ padding: '20px' }}>
              <Switch>
                <Route exact path='/'>
                  <Launch
                    entered={anim.entered}
                    planets={planets}
                    submitLaunch={submitLaunch}
                    isPendingLaunch={isPendingLaunch}
                  />
                </Route>
                <Route exact path='/launch'>
                  <Launch
                    entered={anim.entered}
                    planets={planets}
                    submitLaunch={submitLaunch}
                    isPendingLaunch={isPendingLaunch}
                  />
                </Route>
                <Route exact path='/upcoming'>
                  <Upcoming
                    entered={anim.entered}
                    launches={launches}
                    abortLaunch={abortLaunch}
                  />
                </Route>
                <Route exact path='/history'>
                  <History entered={anim.entered} launches={launches} />
                </Route>
              </Switch>
            </div>
          )}
        </Frame>
      </Centered>
      <Footer />
    </div>
  );
};

export default withSounds()(withStyles(styles)(AppLayout));
