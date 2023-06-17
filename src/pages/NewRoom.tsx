import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/home_illustration.svg';
import logo from '../assets/Logo.svg';

import '../styles/auth.scss'
import { Button } from '../components/Button';
import { database, push, ref, set } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
export function NewRoom(){  
    const { user } = useAuth()
    const [newRoom, setNewRoom] = useState('');
    const navigate = useNavigate();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        
        if(newRoom.trim() === ''){
            return;
        }

        const roomRef = ref(database, 'rooms/');

        const firebaseRoom = await push(roomRef, {
            title: newRoom,
            authorId: user?.id,
        })

        navigate(`/admin/rooms/${firebaseRoom.key}`)

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
                        <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text" 
                        placeholder='Nome da sala'
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}