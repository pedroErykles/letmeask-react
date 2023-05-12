import { Link, useParams } from 'react-router-dom';
import { Toast, toast } from 'react-hot-toast';

import logo from '../assets/Logo.svg'; 
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database, get, push, ref } from '../services/firebase';
import { child } from 'firebase/database';

type RoomParamsProps = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        avatar: string,
        name: string
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string,
        avatar: string
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room(){
    const { user } = useAuth();
    const params = useParams<RoomParamsProps>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id!;

    useEffect(() => {
        const dbRef = ref(database);
    
        get(child(dbRef,  `rooms/${roomId}`)).then(room => {
            if(room.exists()){
                const databaseRoom = room.val();
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    console.log(value)
                    console.log(value.content)
                    return {
                        id: key,
                        author: value.author,
                        content: value.content,
                        isAnswered: value.isAnswered,
                        isHighlighted: value.isHighlighted
                    }
                })
        
                setTitle(databaseRoom.title);
                setQuestions(parsedQuestions)
                
            }
        })

    }, [roomId])


    async function handleNewQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You\'re not authenticated');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlited: false,
            isAnswered: false
        };

        await push(ref(database, `rooms/${roomId}/questions`), {
            question
        })

        toast.success('Pergunta enviada!');

        setNewQuestion('');
    }


    return(
        <div id="page-room">
            <header>
                <div className="content">
                <Link to={"/"}><img src={logo} alt="Logo da Letmeask" /></Link>
                    <div>
                        <RoomCode code={roomId}/>
                    </div>
                </div>
                
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{ questions.length } perguntas</span> }
                </div>

                <form onSubmit={handleNewQuestion}>
                    <textarea 
                        placeholder='O que você quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className='form-footer'>
                        { user ?  <div className='user-info'>
                            <img src={ user.avatar } alt="user.name" />
                            <span>{user.name}</span>
                        </div> : 
                        <span>
                            Para enviar uma pergunta, <button>faça seu login</button>.
                        </span> }
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(questions)}
            </main>
        </div>
    );
}