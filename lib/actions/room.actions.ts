"use server"

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';
import { liveblocks } from '../liveblocks';

export const createDocument = async({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid()

    try {  
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ['room:write']
        });

        revalidatePath('/')

        return parseStringify(room)

    } catch (error) {
        throw new Error(`Something something error while creating a room: ${error}`)
    }
}

export const getDocument = async ({roomId, userId}: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
    
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)
    
        // if (!hasAccess) {
        //     throw new Error("You do not have access to this document")
        // }
    
        return parseStringify(room)
    } catch (error) {
        throw new Error(`blahh blahh error getting room: ${error}`)
        
    }


}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        })

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updatedRoom)
    } catch (error) {
        throw new Error(`New error while updating room: ${error}`)
    }
}

export const getDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email })
        return parseStringify(rooms)
    } catch (error) {
        throw new Error(`blahh blahh error getting rooms: ${error}`)
        
    }


}