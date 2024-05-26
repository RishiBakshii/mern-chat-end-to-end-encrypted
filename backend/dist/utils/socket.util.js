import { userSocketIds } from "../index.js";
export const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    io.to(getMemberSockets(users)).emit(event, data);
};
export const getOtherMembers = ({ members, user }) => {
    return members.filter(member => member !== user);
};
export const getMemberSockets = (members) => {
    return members.map(member => userSocketIds.get(member));
};
//# sourceMappingURL=socket.util.js.map