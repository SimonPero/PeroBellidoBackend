export default class CurrentUserDTO {
    constructor(user) {
        this.firstName = user.firstName ||"noFirstName";
        this.lastName = user.lastName ||"noLastName";
        this.isAdmin = user.isAdmin;
        this._id = user._id;
        this.role = user.role;
        this.age = user.age ||"noAge";
        this.documents = user.documents;
        this.last_connection =user.last_connection;
    }
}