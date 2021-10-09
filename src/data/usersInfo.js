class UsersInfo {
    constructor() {
        this.info = {};
        this.sessionUserId = null;
    }

    getUser(userId) {
        return this.info[userId];
    }

    hasUser(userId) {
        return userId in this.info;
    }

    isSessionUser(userId) {
        return userId === this.sessionUserId;
    }

    setUser(user) {
        this.info[user.id] = user;
    }

    setSessionUser(user) {
        this.setUser(user);
        this.sessionUserId = user.id;
    }
}

export default UsersInfo