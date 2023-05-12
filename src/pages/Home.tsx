import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/home_illustration.svg';
import logo from '../assets/Logo.svg';
import googleIcon from '../assets/Icon.svg';
import logInIcon from '../assets/log-in 1.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database, get, ref } from '../services/firebase';
export function Home(){

    const navigate = useNavigate();
    const { user, signIn } = useAuth();
    const[ room, setRoom] = useState('');
    
    async function handleCreateRoom(){
        if(!user){
            await signIn();
        }
        navigate('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(room.trim() === ''){
            return;
        }   

        const roomRef = (await get(ref(database, `rooms/${room}`))).exists();

        console.log(roomRef);

        if(!roomRef){
            alert('room does not exist')
            return;
        }
            navigate(`rooms/${room}`);
    }


    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas." />
                <strong>Crie salas de Q&A ao-vivo.</strong>
                <p>Tire as dúvidas de sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logo} alt="Logo da Letmeask" />
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIcon} alt="Ícone da Google" />
                        Crie sua sala com Google
                    </button>
                    <div className='separator'>
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder='Digite o código da sala'
                        onChange={event => setRoom(event.target.value)}
                        value={room}
                        />
                        <Button type='submit'>
                            <img src={logInIcon} alt="Ícone de Login" />
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}