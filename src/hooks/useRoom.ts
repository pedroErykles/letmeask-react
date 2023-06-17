import { useState, useEffect } from "react";

import { database, get, push, ref, onValue, off } from '../services/firebase';
import { useAuth } from "./useAuth";

type Question = {
    id: string;
    author: {
        name: string,
        avatar: string
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}


type FirebaseQuestions = Record<string, {
    likes: Record<string, {
        authorId: string;
    }>
    question: {
        author: {
            avatar: string,
            name: string
        };
        content: string;
        isAnswered: boolean;
        isHighlighted: boolean;
    }
}>

export function useRoom(roomId: string){
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const dbRef = ref(database, `rooms/${roomId}`);
    
        onValue(dbRef, (room => {
            if(room.exists()){
                const databaseRoom = room.val();
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        author: value.question.author,
                        content: value.question.content,
                        isAnswered: value.question.isAnswered,
                        isHighlighted: value.question.isHighlighted,
                        likeCount: Object.values(value.likes ?? {}).length,
                        likeId: Object.entries(value.likes ?? {})
                        .find(([key, like]) => like.authorId === user?.id)?.[0]
                    }
                })
        
                setTitle(databaseRoom.title);
                setQuestions(parsedQuestions)
                
            }
        }))

        return () => { 
            off(dbRef, 'value');
        }
    }, [roomId, user?.id])

    return { questions, title }

}