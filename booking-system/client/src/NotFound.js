import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { Link } from 'react-router-dom';
import './NotFound.css';
import astronaut from "./images/astronaut.svg";
import planet from "./images/planet.svg";
import particlesOptions from './particles.json';

const NotFound = () => {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    return (
      <div style={{height:"100vh"}}>
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesOptions}
        />
        <div className="permission_denied">
          <div id="tsparticles"></div>
          <div className="denied__wrapper">
              <h1>404</h1>
              <h3>LOST IN <span>SPACE</span> Remote Labs? Hmm, looks like this page doesn't exist.</h3>
              <img id="astronaut" src={astronaut} alt="astronaut" />
              <img id="planet" src={planet} alt="planet"/>
              <Link to="/"><button className="denied__link">Go to Login</button></Link>
          </div>
        </div>
      </div>
      
    );
};

export default NotFound;
