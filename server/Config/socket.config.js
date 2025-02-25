import { Server } from 'socket.io';

export var io

/** InitializeSocket
 * Initializes socket for use throughout server
 */
export async function initializeSocket(https){
    const cleaningService = await import('../Services/cleaningService.js');

    const displayUID = cleaningService.displayUID;
    const generateVenueList = cleaningService.generateVenueList

    io = new Server(https, {
        cors: {
            origin: process.env.REACT_APP_PUBLIC_URL
        }
    });
    // io.sockets.on('connection', (socket) => {
    //     socket.on('join', async (data) => {
    //         var venueList;
    //         var uid;
    //         if (data.uid) {
    //             uid = displayUID(data.uid);
    //             socket.join(uid);
    //             if (data.hasVenues) {
    //                 venueList = await generateVenueList(uid, "CAN_MESSAGE")
    //                 venueList.forEach((venueID) => {
    //                     socket.join(venueID);
    //                 })
    //             }
    //             console.log(`Joined as ${data.name}${uid ? "(" + uid + ")" : ""}${data.hasVenues ? ", managing the following venues: " + String(venueList) : ""}`)
    //         }
    //     })
    //     socket.on('logOut', async (data) => {
    //         let rooms = socket.rooms;
    //         console.log(rooms);
    //         rooms.forEach((room) => {
    //             socket.leave(room);
    //         })
    //     })
    // })
} 

export function getIO() {
    return io;
}