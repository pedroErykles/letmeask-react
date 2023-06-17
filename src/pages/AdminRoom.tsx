import { Link, useNavigate, useParams } from 'react-router-dom';

import logo from '../assets/Logo.svg';
import deleteImg from '../assets/Excluir.svg'
import checkmarkIcon from '../assets/checkmark-circle-1.svg'
import messageIcon from '../assets/Messages, Chat.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { ref, remove, update } from 'firebase/database';
import { database } from '../services/firebase';

type RoomParamsProps = {
    id: string;
}

export function AdminRoom(){
    //const { user } = useAuth();
    const params = useParams<RoomParamsProps>();
    const roomId = params.id!;
    const navigate = useNavigate();

    const {questions, title} = useRoom(roomId);

    const handleEndRoom = async () => {
        await update(ref(database, `rooms/${roomId}`), {
            closedAt: new Date().getDate()
        });

        navigate(`/`);
    }

    const handleCheckQuestionAsAnswered = async (questionId: string) => {
        await update(ref(database, `rooms/${roomId}/questions/${questionId}/question`), {
            isAnswered: true
        });
    }

    const handleHighlightQuestion = async (questionId: string) => {
        await update(ref(database, `rooms/${roomId}/questions/${questionId}/question`), {
            isHighlighted: true
        });
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                <Link to={"/"}><img src={logo} alt="Logo da Letmeask" /></Link>
                    <div className='admin-code-bttn'>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>
                            Encerrar sala
                        </Button>
                    </div>
                </div>
                
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{ questions.length } perguntas</span> }
                </div>

                <div className='question-list'>
                {questions.map(question => {
                    return (
                        <Question key={question.id}
                        content={question.content} 
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && (
                            <>
                                <button
                            type='button'
                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                            >
                                <img src={checkmarkIcon} alt="Marcar pergunta como respondida" />
                            </button>

                            <button
                            type='button'
                            onClick={() => handleHighlightQuestion(question.id)}
                            >
                                <img src={messageIcon} alt="Destacar pergunta" />
                            </button>
                            </>
                            )}

                            <button
                            type='button'
                            onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    );
                })}
                </div>
            </main>
        </div>
    );
}