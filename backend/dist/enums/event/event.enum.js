export var Events;
(function (Events) {
    Events["MESSAGE"] = "MESSAGE";
    Events["NEW_GROUP"] = "NEW_GROUP";
    Events["DELETE_CHAT"] = "DELETE_CHAT";
    Events["MESSAGE_SEEN"] = "MESSAGE_SEEN";
    Events["USER_TYPING"] = "USER_TYPING";
    Events["UNREAD_MESSAGE"] = "UNREAD_MESSAGE";
    Events["NEW_FRIEND_REQUEST"] = "NEW_FRIEND_REQUEST";
    Events["NEW_MEMBER_ADDED"] = "NEW_MEMBER_ADDED";
    Events["MEMBER_REMOVED"] = "MEMBER_REMOVED";
    Events["ONLINE"] = "ONLINE";
    Events["OFFLINE"] = "OFFLINE";
    Events["MESSAGE_EDIT"] = "MESSAGE_EDIT";
    Events["VOTE_IN"] = "VOTE_IN";
    Events["VOTE_OUT"] = "VOTE_OUT";
})(Events || (Events = {}));
