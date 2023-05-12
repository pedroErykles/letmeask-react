import copyImg from '../assets/room-id-icon.svg';

import '../styles/room-code.scss';

type RoomCodeProps= { 
    code: string;
}

export function RoomCode(props: RoomCodeProps){
    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.code);
    }
    return(
        <button onClick={copyToClipboard} className='room-code'>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>
                Sala #{props.code}
            </span>
        </button>
    );
}