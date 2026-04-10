import './Videoplayer.scss'

import { useParams, useLocation } from 'react-router-dom'
import ReactPlayer from 'react-player'

const Videoplayer = () => {
    let params = useParams();
    let location = useLocation();
    let key = params.yt_id;

    const isInitialMuted = location.state?.isMuted || false;

    return (
        <div className="react-player-container">
            {(key != null) ?
            <ReactPlayer 
            controls={true}
            playing={true}
            muted={isInitialMuted}
            url={`https://www.youtube.com/watch?v=${key}`}
            width='100%'
            height='100%'
            /> : null}
        </div>
    )
}
export default Videoplayer